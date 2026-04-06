from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.core.supabase_client import supabase

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


async def get_current_user_id(token: str = Depends(reusable_oauth2)) -> str:
    """Extrai o user_id do JWT token."""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token inválido: falta sub",
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Não foi possível validar as credenciais",
        )


async def get_current_clinic_id(user_id: str = Depends(get_current_user_id)) -> str:
    """Busca o clinic_id do usuário logado no Supabase."""
    result = supabase.table("users") \
        .select("clinic_id") \
        .eq("id", user_id) \
        .limit(1) \
        .execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado no sistema.",
        )

    return result.data[0]["clinic_id"]


async def verify_subscription_active(clinic_id: str = Depends(get_current_clinic_id)):
    """
    Middleware que bloqueia acesso se a assinatura não estiver ativa.
    Usado como dependência em rotas protegidas.
    """
    # Verificar status da clínica
    clinic = supabase.table("clinics") \
        .select("status") \
        .eq("id", clinic_id) \
        .limit(1) \
        .execute()

    if clinic.data and clinic.data[0]["status"] == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Conta suspensa por falta de pagamento. Regularize sua assinatura.",
        )

    # Verificar assinatura
    sub = supabase.table("subscriptions") \
        .select("payment_status") \
        .eq("clinic_id", clinic_id) \
        .in_("payment_status", ["active", "pending"]) \
        .limit(1) \
        .execute()

    if not sub.data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Nenhuma assinatura ativa encontrada.",
        )

    return clinic_id
