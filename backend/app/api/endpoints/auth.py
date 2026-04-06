from datetime import timedelta
from typing import Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.core import security
from app.core.config import settings
from app.core.supabase_client import supabase

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    access_token: str
    new_password: str


@router.post("/login")
async def login(data: LoginRequest) -> Any:
    """
    Login via Supabase Auth.
    Verifica status da assinatura antes de conceder acesso.
    """
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password,
        })
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos.",
        )

    user = auth_response.user
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos.",
        )

    # Buscar dados do usuário no nosso sistema
    user_data = supabase.table("users") \
        .select("clinic_id, role, name") \
        .eq("id", str(user.id)) \
        .limit(1) \
        .execute()

    if not user_data.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado no sistema. Entre em contato com o suporte.",
        )

    user_record = user_data.data[0]
    clinic_id = user_record["clinic_id"]

    # Verificar se clínica não está suspensa
    clinic = supabase.table("clinics") \
        .select("status, clinic_name") \
        .eq("id", clinic_id) \
        .limit(1) \
        .execute()

    clinic_status = clinic.data[0]["status"] if clinic.data else "unknown"
    clinic_name = clinic.data[0]["clinic_name"] if clinic.data else ""

    # Buscar assinatura
    sub = supabase.table("subscriptions") \
        .select("plan_type, payment_status") \
        .eq("clinic_id", clinic_id) \
        .limit(1) \
        .execute()

    sub_data = sub.data[0] if sub.data else {}

    # Gerar token JWT nosso (para o backend FastAPI)
    access_token = security.create_access_token(
        subject=str(user.id),
        tenant_id=clinic_id,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    # Audit log
    supabase.table("audit_logs").insert({
        "clinic_id": clinic_id,
        "user_id": str(user.id),
        "action": "login",
        "details": {"email": data.email}
    }).execute()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "supabase_token": auth_response.session.access_token if auth_response.session else None,
        "user": {
            "id": str(user.id),
            "name": user_record["name"],
            "email": data.email,
            "role": user_record["role"],
        },
        "clinic": {
            "id": clinic_id,
            "name": clinic_name,
            "status": clinic_status,
        },
        "subscription": {
            "plan": sub_data.get("plan_type", "none"),
            "status": sub_data.get("payment_status", "none"),
        }
    }


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest) -> Any:
    """
    Envia email de recuperação de senha via Supabase Auth.
    """
    try:
        supabase.auth.reset_password_email(data.email)
    except Exception:
        pass  # Não revelar se o email existe ou não (segurança)

    return {
        "message": "Se este email estiver cadastrado, você receberá um link de recuperação."
    }


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest) -> Any:
    """
    Redefine a senha usando o token de recuperação.
    """
    try:
        supabase.auth.admin.update_user_by_id(
            data.access_token,
            {"password": data.new_password}
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Erro ao redefinir senha: {str(e)}"
        )

    return {"message": "Senha redefinida com sucesso!"}
