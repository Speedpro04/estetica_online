from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core import security
from app.core.config import settings

router = APIRouter()

@router.post("/login")
def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    Login via OAuth2 compatível (Username/Password).
    Em um sistema real, validamos contra o banco de dados.
    """
    # MOCK: Validando credencial de teste
    if form_data.username == "admin@solara.com" and form_data.password == "solara123":
        # Simulando uma clínica vinculada (tenant_id)
        mock_user_id = "user_f6851e"
        mock_clinic_id = "clinic_axos_hub"
        
        access_token_expires = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        return {
            "access_token": security.create_access_token(
                mock_user_id, 
                tenant_id=mock_clinic_id,
                expires_delta=access_token_expires
            ),
            "token_type": "bearer",
        }
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Email ou senha incorretos",
        headers={"WWW-Authenticate": "Bearer"},
    )
