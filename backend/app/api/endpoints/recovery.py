"""
Endpoints de Recuperação de Pacientes — Assistente Solara
Fornece KPIs, lista de pacientes prioritários e disparo de campanhas.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.services import intelligence_service

router = APIRouter()


@router.get("/stats")
def recovery_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retorna os KPIs do módulo de recuperação:
    - Taxa de abandono
    - Pacientes em risco (Crítico + Alto)
    - Faturamento potencial recuperável
    """
    stats = intelligence_service.get_recovery_stats(
        tenant_id=current_user.tenant_id,
        db=db
    )
    return {"status": "ok", "data": stats}


@router.get("/patients")
def recovery_priority_patients(
    limit: Optional[int] = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retorna a lista de pacientes prioritários para recuperação,
    ordenados do mais crítico para o menos urgente.
    """
    patients = intelligence_service.get_priority_patients(
        tenant_id=current_user.tenant_id,
        db=db,
        limit=limit
    )
    return {"status": "ok", "total": len(patients), "patients": patients}


@router.post("/recalculate")
def recalculate_risk_scores(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Recalcula os scores de risco de todos os pacientes da clínica.
    Pacientes com risco CRÍTICO/ALTO e status 'ativo' são reclassificados como 'inativo'.
    """
    total_atualizados = intelligence_service.recalcular_scores_tenant(
        tenant_id=current_user.tenant_id,
        db=db
    )
    return {
        "status": "ok",
        "message": f"Scores recalculados. {total_atualizados} pacientes atualizados.",
        "updated": total_atualizados,
    }


@router.post("/trigger-campaign")
def trigger_campaign(
    body: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Dispara uma campanha de recuperação para um segmento de pacientes.
    
    Body esperado:
    {
        "score_alvo": "CRITICO" | "ALTO" | "MEDIO",
        "canal": "WhatsApp" | "SMS" | "Email",
        "mensagem_personalizada": "Texto opcional"
    }
    """
    score_alvo = body.get("score_alvo", "CRITICO")
    canal = body.get("canal", "WhatsApp")

    if score_alvo not in ["CRITICO", "ALTO", "MEDIO", "BAIXO"]:
        raise HTTPException(status_code=400, detail="score_alvo inválido")

    # Buscar pacientes elegíveis
    pacientes = intelligence_service.get_priority_patients(
        tenant_id=current_user.tenant_id,
        db=db,
        limit=200
    )
    elegíveis = [p for p in pacientes if p["score"] == score_alvo]

    # Aqui seria integrado com Evolution API ou outro canal
    # Por ora retorna a contagem e simulação
    return {
        "status": "ok",
        "message": f"Campanha via {canal} iniciada para {len(elegíveis)} pacientes com score {score_alvo}.",
        "canal": canal,
        "score_alvo": score_alvo,
        "pacientes_alvo": len(elegíveis),
        "simulacao": True,  # Remover quando Evolution API estiver integrada
    }
