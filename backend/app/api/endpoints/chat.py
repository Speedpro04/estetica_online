from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Any

from app.api import deps
from app.models.user import User
from app.services.ai_service import consult_ai

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/", response_model=ChatResponse)
def chat_with_ai(
    request: ChatRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Rota para o Consultor IA do sistema.
    Assegura que tenant_id isolado seja repassado na chamada de IA.
    """
    if not current_user.tenant_id:
        raise HTTPException(status_code=400, detail="Usuário não possui uma clínica (tenant_id) vinculada.")

    # A string pushname não existe no modelo user.py básico, então utilizamos full_name ou username
    user_name = getattr(current_user, "full_name", current_user.email.split("@")[0])
    
    # Chama o serviço de IA injetando os dados de contexto de forma segura (Backend -> LLM -> Backend)
    ai_response = consult_ai(
        message=request.message,
        tenant_id=current_user.tenant_id,
        user_name=user_name,
        db=db
    )
    
    return {"response": ai_response}
