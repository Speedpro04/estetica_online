from datetime import datetime
from typing import Any, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.core.supabase_client import supabase
from app.core.config import settings

router = APIRouter()

import stripe
from app.core.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

# ─── Schemas ───
class ClinicRegisterRequest(BaseModel):
    clinic_name: str
    cnpj: str
    email: EmailStr
    phone: Optional[str] = None
    admin_name: str
    admin_password: str
    plan_type: str  # essencial | profissional | clinica

class ClinicRegisterResponse(BaseModel):
    message: str
    clinic_id: str
    user_id: str
    plan: str
    checkout_url: Optional[str] = None

# ─── Helpers ───
PLAN_CONFIG = {
    "essencial": {"dentist_limit": 2, "price": 149.00},
    "profissional": {"dentist_limit": 5, "price": 249.00},
    "clinica": {"dentist_limit": 10, "price": 349.00},
}

# ─── Endpoints ───
@router.post("/register", response_model=ClinicRegisterResponse, status_code=201)
async def register_clinic(data: ClinicRegisterRequest) -> Any:
    """
    Cadastro completo: cria clínica + usuário (Supabase Auth) + assinatura.
    Gera link de checkout do Stripe.
    """
    plan = PLAN_CONFIG.get(data.plan_type)
    if not plan:
        raise HTTPException(
            status_code=400,
            detail=f"Plano inválido. Use: essencial, profissional ou clinica."
        )

    # 1. Verificar CNPJ duplicado
    existing = supabase.table("clinics").select("id").eq("cnpj", data.cnpj).execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(
            status_code=409,
            detail="Já existe uma clínica cadastrada com este CNPJ."
        )

    # 2. Criar usuário no Supabase Auth
    try:
        auth_response = supabase.auth.admin.create_user({
            "email": data.email,
            "password": data.admin_password,
            "email_confirm": True,  # Auto confirmar para facilitar o fluxo de checkout
            "user_metadata": {
                "name": data.admin_name,
                "clinic_name": data.clinic_name,
                "role": "admin"
            }
        })
        user_id = auth_response.user.id
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Erro ao criar usuário: {str(e)}"
        )

    # 3. Criar clínica (Tenant)
    try:
        clinic_result = supabase.table("clinics").insert({
            "clinic_name": data.clinic_name,
            "cnpj": data.cnpj,
            "email": data.email,
            "phone": data.phone,
            "status": "pending_payment"
        }).execute()
        clinic_id = clinic_result.data[0]["id"]
    except Exception as e:
        supabase.auth.admin.delete_user(str(user_id))
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao criar clínica: {str(e)}"
        )

    # 4. Vincular usuário
    try:
        supabase.table("users").insert({
            "id": str(user_id),
            "name": data.admin_name,
            "email": data.email,
            "clinic_id": clinic_id,
            "role": "admin"
        }).execute()
    except Exception as e:
        supabase.auth.admin.delete_user(str(user_id))
        supabase.table("clinics").delete().eq("id", clinic_id).execute()
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao vincular usuário: {str(e)}"
        )

    # 5. Gerar Checkout no Stripe
    checkout_url = None
    try:
        # Pega o Price ID correspondente ao plano a partir das variáveis de ambiente
        price_mapping = {
            "essencial": settings.STRIPE_PRICE_ESSENCIAL,
            "profissional": settings.STRIPE_PRICE_PROFISSIONAL,
            "clinica": settings.STRIPE_PRICE_CLINICA
        }
        
        price_id = price_mapping.get(data.plan_type)
        if not price_id:
            raise Exception("ID de preço não configurado no servidor.")

        # Cria Customer no Stripe
        customer = stripe.Customer.create(
            email=data.email,
            name=data.clinic_name,
            metadata={"clinic_id": clinic_id, "tenant_id": clinic_id}
        )

        # Atualiza a clínica com o customer ID
        supabase.table("clinics").update({"stripe_customer_id": customer.id}).eq("id", clinic_id).execute()

        # Cria Checkout Session
        checkout_session = stripe.checkout.Session.create(
            customer=customer.id,
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"http://localhost:5173/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"http://localhost:5173/register",
            client_reference_id=clinic_id,
            metadata={"clinic_id": clinic_id, "plan_type": data.plan_type}
        )
        checkout_url = checkout_session.url
        
        # Cria a Subscription como pending
        supabase.table("subscriptions").insert({
            "clinic_id": clinic_id,
            "plan_type": data.plan_type,
            "dentist_limit": plan["dentist_limit"],
            "price": plan["price"],
            "payment_status": "pending",
            "stripe_subscription_id": None
        }).execute()

    except Exception as e:
        # Em caso de erro com o Stripe, mantemos a conta para tentar pagar depois, 
        # ou retornamos o erro
        print(f"Erro Stripe: {e}")
        pass

    # 6. Log de auditoria
    supabase.table("audit_logs").insert({
        "clinic_id": clinic_id,
        "user_id": str(user_id),
        "action": "clinic_registered",
        "details": {"plan": data.plan_type, "cnpj": data.cnpj, "stripe_session": checkout_url is not None}
    }).execute()

    return ClinicRegisterResponse(
        message="Clínica cadastrada! Redirecionando para o pagamento...",
        clinic_id=clinic_id,
        user_id=str(user_id),
        plan=data.plan_type,
        checkout_url=checkout_url
    )
