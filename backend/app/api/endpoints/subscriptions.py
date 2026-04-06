from typing import Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.core.supabase_client import supabase
from app.api.deps import get_current_user_id, get_current_clinic_id

router = APIRouter()

# ─── Schemas ───
class SubscriptionResponse(BaseModel):
    id: str
    plan_type: str
    dentist_limit: int
    price: float
    payment_status: str
    next_due_date: str | None

class UpgradePlanRequest(BaseModel):
    new_plan: str  # essencial | profissional | clinica

PLAN_CONFIG = {
    "essencial": {"dentist_limit": 2, "price": 149.00},
    "profissional": {"dentist_limit": 5, "price": 299.00},
    "clinica": {"dentist_limit": 10, "price": 499.00},
}

# ─── Endpoints ───
@router.get("/me")
async def get_my_subscription(
    clinic_id: str = Depends(get_current_clinic_id)
) -> Any:
    """Retorna a assinatura ativa da clínica do usuário logado."""
    result = supabase.table("subscriptions") \
        .select("*") \
        .eq("clinic_id", clinic_id) \
        .in_("payment_status", ["active", "pending"]) \
        .limit(1) \
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Nenhuma assinatura encontrada.")

    sub = result.data[0]
    return {
        "id": sub["id"],
        "plan_type": sub["plan_type"],
        "dentist_limit": sub["dentist_limit"],
        "price": float(sub["price"]),
        "payment_status": sub["payment_status"],
        "next_due_date": sub.get("next_due_date"),
    }


@router.put("/upgrade")
async def upgrade_plan(
    data: UpgradePlanRequest,
    clinic_id: str = Depends(get_current_clinic_id),
    user_id: str = Depends(get_current_user_id)
) -> Any:
    """Altera o plano da clínica."""
    plan = PLAN_CONFIG.get(data.new_plan)
    if not plan:
        raise HTTPException(status_code=400, detail="Plano inválido.")

    # Buscar assinatura ativa
    result = supabase.table("subscriptions") \
        .select("id, plan_type") \
        .eq("clinic_id", clinic_id) \
        .in_("payment_status", ["active", "pending"]) \
        .limit(1) \
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Nenhuma assinatura ativa encontrada.")

    sub_id = result.data[0]["id"]
    old_plan = result.data[0]["plan_type"]

    # Atualizar
    supabase.table("subscriptions").update({
        "plan_type": data.new_plan,
        "dentist_limit": plan["dentist_limit"],
        "price": plan["price"],
    }).eq("id", sub_id).execute()

    # Audit log
    supabase.table("audit_logs").insert({
        "clinic_id": clinic_id,
        "user_id": user_id,
        "action": "plan_change",
        "details": {"from": old_plan, "to": data.new_plan}
    }).execute()

    return {"message": f"Plano atualizado de {old_plan} para {data.new_plan} com sucesso."}


@router.get("/payments")
async def get_payment_history(
    clinic_id: str = Depends(get_current_clinic_id)
) -> Any:
    """Retorna o histórico de pagamentos da clínica."""
    result = supabase.table("payments") \
        .select("*") \
        .eq("clinic_id", clinic_id) \
        .order("created_at", desc=True) \
        .limit(50) \
        .execute()

    return {"payments": result.data or []}
