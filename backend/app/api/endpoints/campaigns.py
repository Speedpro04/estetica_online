from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.campaign import Campaign
from app.services.redis_service import get_redis_service, RedisService

router = APIRouter()

@router.post("/")
def create_campaign(
    *,
    db: Session = Depends(deps.get_db),
    name: str,
    message: str,
    instance_id: str,
    current_user: User = Depends(deps.get_current_user),
    redis: RedisService = Depends(get_redis_service),
) -> Any:
    """
    Cria uma nova campanha e a coloca na fila do Redis para disparo via Evolution API.
    """
    # 1. Cria o objeto da campanha (Mock)
    campaign_id = "camp_001_solara"
    campaign = Campaign(
        name=name,
        message_template=message,
        whatsapp_instance=instance_id,
        tenant_id=current_user.tenant_id,
        status="agendada"
    )
    
    # 2. Enfileira no Redis para o Worker (Evolution API) processar
    redis.enqueue_campaign_task(campaign_id)
    
    return {
        "status": "success",
        "message": f"Campanha '{name}' enfileirada para a clínica {current_user.tenant_id}",
        "campaign_id": campaign_id
    }
