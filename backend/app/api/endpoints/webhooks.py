from typing import Any
from fastapi import APIRouter, Request, HTTPException
from app.core.supabase_client import supabase

router = APIRouter()

@router.post("/pagseguro")
async def pagseguro_webhook(request: Request) -> Any:
    """
    Webhook endpoint para receber eventos do PagSeguro/PagBank.
    Eventos: payment_approved, payment_failed, subscription_canceled
    """
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Payload inválido.")

    event_type = payload.get("event") or payload.get("notificationType")
    charge = payload.get("charge") or payload.get("transaction") or {}
    
    reference_id = charge.get("reference_id") or charge.get("reference")  # clinic_id
    transaction_id = charge.get("id") or charge.get("code")
    status = charge.get("status", "").upper()

    if not reference_id:
        return {"message": "Evento ignorado — sem reference_id."}

    # Mapear status do PagSeguro para nosso sistema
    status_map = {
        "PAID": "approved",
        "AUTHORIZED": "approved",
        "AVAILABLE": "approved",
        "DECLINED": "failed",
        "CANCELED": "failed",
        "IN_ANALYSIS": "pending",
    }
    
    our_status = status_map.get(status, "pending")

    # 1. Registrar pagamento
    sub_result = supabase.table("subscriptions") \
        .select("id, clinic_id, price") \
        .eq("clinic_id", reference_id) \
        .in_("payment_status", ["active", "pending", "overdue"]) \
        .limit(1) \
        .execute()

    if not sub_result.data:
        return {"message": "Assinatura não encontrada para esta clínica."}

    sub = sub_result.data[0]

    supabase.table("payments").insert({
        "clinic_id": sub["clinic_id"],
        "subscription_id": sub["id"],
        "pagseguro_transaction_id": str(transaction_id),
        "status": our_status,
        "amount": float(sub["price"]),
        "payment_date": "now()"
    }).execute()

    # 2. Atualizar status da assinatura
    if our_status == "approved":
        supabase.table("subscriptions").update({
            "payment_status": "active"
        }).eq("id", sub["id"]).execute()

        # Reativar clínica se estava suspensa
        supabase.table("clinics").update({
            "status": "active"
        }).eq("id", sub["clinic_id"]).execute()

    elif our_status == "failed":
        supabase.table("subscriptions").update({
            "payment_status": "overdue"
        }).eq("id", sub["id"]).execute()

    # 3. Audit log
    supabase.table("audit_logs").insert({
        "clinic_id": sub["clinic_id"],
        "action": f"payment_{our_status}",
        "details": {
            "transaction_id": str(transaction_id),
            "amount": float(sub["price"]),
            "pagseguro_status": status
        }
    }).execute()

    return {"message": f"Webhook processado: {our_status}"}


@router.post("/pagseguro/cancel")
async def pagseguro_cancel_webhook(request: Request) -> Any:
    """Webhook para cancelamento de assinatura."""
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Payload inválido.")

    reference_id = payload.get("reference_id")
    if not reference_id:
        return {"message": "Evento ignorado."}

    # Cancelar assinatura
    supabase.table("subscriptions").update({
        "payment_status": "suspended"
    }).eq("clinic_id", reference_id).in_(
        "payment_status", ["active", "pending", "overdue"]
    ).execute()

    # Suspender clínica
    supabase.table("clinics").update({
        "status": "suspended"
    }).eq("id", reference_id).execute()

    # Audit log
    supabase.table("audit_logs").insert({
        "clinic_id": reference_id,
        "action": "subscription_canceled",
        "details": payload
    }).execute()

    return {"message": "Assinatura cancelada com sucesso."}
