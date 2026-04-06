from datetime import datetime
from typing import Any, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.core.supabase_client import supabase
from app.core.config import settings

router = APIRouter()

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

# ─── Helpers ───
PLAN_CONFIG = {
    "essencial": {"dentist_limit": 2, "price": 149.00},
    "profissional": {"dentist_limit": 5, "price": 299.00},
    "clinica": {"dentist_limit": 10, "price": 499.00},
}

# ─── Endpoints ───
@router.post("/register", response_model=ClinicRegisterResponse, status_code=201)
async def register_clinic(data: ClinicRegisterRequest) -> Any:
    """
    Cadastro completo: cria clínica + usuário (Supabase Auth) + assinatura.
    Fluxo anti-fraude: bloqueia CNPJ duplicado.
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

    # 2. Criar usuário no Supabase Auth (com confirmação de email)
    try:
        auth_response = supabase.auth.admin.create_user({
            "email": data.email,
            "password": data.admin_password,
            "email_confirm": False,  # Requer verificação por email
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

    # 3. Criar clínica
    try:
        clinic_result = supabase.table("clinics").insert({
            "clinic_name": data.clinic_name,
            "cnpj": data.cnpj,
            "email": data.email,
            "phone": data.phone,
            "status": "active"
        }).execute()
        clinic_id = clinic_result.data[0]["id"]
    except Exception as e:
        # Rollback: deletar usuário auth criado
        supabase.auth.admin.delete_user(str(user_id))
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao criar clínica: {str(e)}"
        )

    # 4. Vincular usuário à clínica
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

    # 5. Criar assinatura
    try:
        supabase.table("subscriptions").insert({
            "clinic_id": clinic_id,
            "plan_type": data.plan_type,
            "dentist_limit": plan["dentist_limit"],
            "price": plan["price"],
            "payment_status": "pending"
        }).execute()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao criar assinatura: {str(e)}"
        )

    # 6. Log de auditoria
    supabase.table("audit_logs").insert({
        "clinic_id": clinic_id,
        "user_id": str(user_id),
        "action": "clinic_registered",
        "details": {"plan": data.plan_type, "cnpj": data.cnpj}
    }).execute()

    return ClinicRegisterResponse(
        message="Clínica cadastrada com sucesso! Verifique seu email para ativar a conta.",
        clinic_id=clinic_id,
        user_id=str(user_id),
        plan=data.plan_type
    )
