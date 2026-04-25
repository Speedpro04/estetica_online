from fastapi import APIRouter
from app.api.endpoints import (
    auth, leads, campaigns, chat, recovery, clinics, subscriptions, webhooks, webhooks_stripe, evolution, appointments
)

api_router = APIRouter()

# Autenticação
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# Clínicas (cadastro público)
api_router.include_router(clinics.router, prefix="/clinics", tags=["clinics"])

# Assinaturas (requer login)
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["subscriptions"])

# Webhooks (Stripe — público, sem auth)
api_router.include_router(webhooks_stripe.router, prefix="/webhooks", tags=["webhooks_stripe"])

# Evolution API (WhatsApp — público, sem auth via key interna)
api_router.include_router(evolution.router, prefix="/evolution", tags=["evolution"])

# Módulos do sistema (requer login)
api_router.include_router(leads.router, prefix="/leads", tags=["leads"])
api_router.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(recovery.router, prefix="/recovery", tags=["recovery"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
