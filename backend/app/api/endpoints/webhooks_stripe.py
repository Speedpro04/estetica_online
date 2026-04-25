import stripe
from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from app.core.config import settings
from app.core.supabase_client import supabase

router = APIRouter()

stripe.api_key = settings.STRIPE_SECRET_KEY

def process_successful_checkout(session: stripe.checkout.Session):
    """
    Processa o pagamento concluído e ativa a clínica.
    """
    clinic_id = session.client_reference_id
    stripe_subscription_id = session.subscription
    
    if not clinic_id:
        # Tenta pegar do metadata
        clinic_id = session.metadata.get("clinic_id") if session.metadata else None
        
    if not clinic_id:
        print("Erro: Sessão do Stripe não contém clinic_id")
        return

    # 1. Atualizar Clínica para "active"
    supabase.table("clinics").update({
        "status": "active"
    }).eq("id", clinic_id).execute()

    # 2. Atualizar Subscription para "active"
    supabase.table("subscriptions").update({
        "payment_status": "active",
        "stripe_subscription_id": stripe_subscription_id
    }).eq("clinic_id", clinic_id).execute()
    
    print(f"✅ Clínica {clinic_id} ativada com sucesso pelo Webhook do Stripe!")

@router.post("/stripe")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Webhook para receber eventos do Stripe (ex: pagamento aprovado).
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    # Se você configurou o STRIPE_WEBHOOK_SECRET no .env, usaremos ele
    # Caso contrário, usaremos o payload raw sem verificação de assinatura (Apenas para Dev/Test)
    webhook_secret = settings.STRIPE_WEBHOOK_SECRET

    event = None

    try:
        if webhook_secret:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        else:
            # Fallback para desenvolvimento sem secret (Inseguro para prod)
            import json
            event_data = json.loads(payload)
            event = stripe.Event.construct_from(event_data, stripe.api_key)
            
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event.type == 'checkout.session.completed':
        session = event.data.object
        background_tasks.add_task(process_successful_checkout, session)
        
    elif event.type == 'customer.subscription.deleted':
        # Assinatura cancelada
        subscription = event.data.object
        # Buscar a clínica associada
        res = supabase.table("subscriptions").select("clinic_id").eq("stripe_subscription_id", subscription.id).execute()
        if res.data:
            clinic_id = res.data[0]["clinic_id"]
            supabase.table("clinics").update({"status": "canceled"}).eq("id", clinic_id).execute()
            supabase.table("subscriptions").update({"payment_status": "canceled"}).eq("id", clinic_id).execute()

    return {"status": "success"}
