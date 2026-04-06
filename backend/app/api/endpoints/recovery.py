
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from app.api import deps
from app.services import intelligence_service

router = APIRouter()

@router.get("/stats")
async def recovery_stats(
    clinic_id: str = Depends(deps.get_current_clinic_id),
):
    """
    Retorna os KPIs do módulo de recuperação (Supabase).
    """
    stats = intelligence_service.get_recovery_stats(clinic_id=clinic_id)
    return {"status": "ok", "data": stats}

@router.get("/patients")
async def recovery_priority_patients(
    limit: Optional[int] = 50,
    clinic_id: str = Depends(deps.get_current_clinic_id),
):
    """
    Retorna a lista de pacientes prioritários para recuperação.
    """
    patients = intelligence_service.get_priority_patients(
        clinic_id=clinic_id,
        limit=limit
    )
    return {"status": "ok", "total": len(patients), "patients": patients}

@router.post("/trigger-campaign")
async def trigger_campaign(
    body: dict,
    clinic_id: str = Depends(deps.get_current_clinic_id),
):
    """
    Dispara uma campanha de recuperação (Exemplo de integração com Evolution).
    """
    score_alvo = body.get("score_alvo", "CRITICO")
    canal = body.get("canal", "WhatsApp")

    patients = intelligence_service.get_priority_patients(
        clinic_id=clinic_id,
        limit=200
    )
    eligible = [p for p in patients if p["score"] == score_alvo]

    return {
        "status": "ok",
        "message": f"Campanha via {canal} iniciada para {len(eligible)} pacientes.",
        "canal": canal,
        "score_alvo": score_alvo,
        "eligible_count": len(eligible),
        "simulation": True
    }
