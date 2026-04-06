"""
Serviço de cobrança automática — Assistente Solara

Lógica:
- 7 dias antes do vencimento: alerta
- 3 dias antes: alerta
- No vencimento: alerta
- 3 dias após vencimento sem pagamento: suspensão automática
"""

from datetime import datetime, date, timedelta
from app.core.supabase_client import supabase


def check_billing_alerts():
    """
    Verifica assinaturas e envia alertas de cobrança.
    Deve ser chamado por um cron job (ex: a cada 24h).
    """
    today = date.today()
    
    # Buscar assinaturas ativas com vencimento definido
    result = supabase.table("subscriptions") \
        .select("id, clinic_id, next_due_date, payment_status, plan_type, price") \
        .in_("payment_status", ["active", "pending", "overdue"]) \
        .not_.is_("next_due_date", "null") \
        .execute()

    if not result.data:
        return {"processed": 0}

    processed = 0
    for sub in result.data:
        due_date = date.fromisoformat(sub["next_due_date"])
        days_until = (due_date - today).days
        clinic_id = sub["clinic_id"]

        alert_type = None

        if days_until == 7:
            alert_type = "7_days"
        elif days_until == 3:
            alert_type = "3_days"
        elif days_until == 0:
            alert_type = "overdue"
            # Marcar como overdue no dia do vencimento
            supabase.table("subscriptions").update({
                "payment_status": "overdue"
            }).eq("id", sub["id"]).execute()
        elif days_until <= -3:
            # 3 dias de atraso → SUSPENSÃO
            _suspend_clinic(clinic_id, sub["id"])
            processed += 1
            continue

        if alert_type:
            # Verificar se esse alerta já foi enviado
            existing = supabase.table("billing_alerts") \
                .select("id") \
                .eq("clinic_id", clinic_id) \
                .eq("alert_type", alert_type) \
                .gte("sent_at", today.isoformat()) \
                .execute()

            if not existing.data:
                # Registrar alerta
                supabase.table("billing_alerts").insert({
                    "clinic_id": clinic_id,
                    "alert_type": alert_type,
                }).execute()

                # Log
                supabase.table("audit_logs").insert({
                    "clinic_id": clinic_id,
                    "action": f"billing_alert_{alert_type}",
                    "details": {
                        "due_date": sub["next_due_date"],
                        "plan": sub["plan_type"],
                        "price": float(sub["price"])
                    }
                }).execute()

                # TODO: Integrar envio real de email/WhatsApp aqui
                processed += 1

    return {"processed": processed, "date": today.isoformat()}


def _suspend_clinic(clinic_id: str, subscription_id: str):
    """Suspende uma clínica por inadimplência."""
    # Suspender assinatura
    supabase.table("subscriptions").update({
        "payment_status": "suspended"
    }).eq("id", subscription_id).execute()

    # Suspender clínica
    supabase.table("clinics").update({
        "status": "suspended"
    }).eq("id", clinic_id).execute()

    # Audit log
    supabase.table("audit_logs").insert({
        "clinic_id": clinic_id,
        "action": "clinic_suspended",
        "details": {"reason": "inadimplencia", "subscription_id": subscription_id}
    }).execute()


def reactivate_clinic(clinic_id: str):
    """Reativa uma clínica após pagamento."""
    supabase.table("clinics").update({
        "status": "active"
    }).eq("id", clinic_id).execute()

    supabase.table("subscriptions").update({
        "payment_status": "active"
    }).eq("clinic_id", clinic_id).eq("payment_status", "suspended").execute()

    supabase.table("audit_logs").insert({
        "clinic_id": clinic_id,
        "action": "clinic_reactivated",
        "details": {"reason": "payment_confirmed"}
    }).execute()
