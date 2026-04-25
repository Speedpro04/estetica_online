from typing import Any, List
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from app.core.supabase_client import supabase
from app.api.deps import get_current_user_id, get_current_clinic_id

router = APIRouter()

# ─── Schemas ───
class AppointmentCreate(BaseModel):
    lead_id: str
    specialist_id: str | None = None
    procedure_name: str
    scheduled_time: str
    duration_minutes: int = 60
    notes: str | None = None

class AppointmentUpdate(BaseModel):
    status: str | None = None
    cancellation_reason: str | None = None
    scheduled_time: str | None = None
    notes: str | None = None

# ─── Endpoints ───
@router.get("/")
async def get_appointments(
    clinic_id: str = Depends(get_current_clinic_id)
) -> Any:
    """Retorna todos os agendamentos da clínica."""
    # Como master bypass usa master-clinic-id, vamos retornar um mock ou buscar real
    if clinic_id == "master-clinic-id":
        return {"appointments": []}
        
    result = supabase.table("appointments") \
        .select("*, leads(name, phone), specialists(name)") \
        .eq("tenant_id", clinic_id) \
        .order("scheduled_time", desc=False) \
        .execute()

    return {"appointments": result.data or []}


@router.post("/")
async def create_appointment(
    data: AppointmentCreate,
    clinic_id: str = Depends(get_current_clinic_id)
) -> Any:
    """Cria um novo agendamento."""
    if clinic_id == "master-clinic-id":
        return {"message": "Bypass: Agendamento simulado com sucesso."}

    try:
        new_app = supabase.table("appointments").insert({
            "tenant_id": clinic_id,
            "lead_id": data.lead_id,
            "specialist_id": data.specialist_id,
            "procedure_name": data.procedure_name,
            "scheduled_time": data.scheduled_time,
            "duration_minutes": data.duration_minutes,
            "notes": data.notes,
            "status": "pendente"
        }).execute()
        return {"message": "Agendamento criado com sucesso", "appointment": new_app.data[0]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{appointment_id}")
async def update_appointment(
    appointment_id: str,
    data: AppointmentUpdate,
    clinic_id: str = Depends(get_current_clinic_id)
) -> Any:
    """Atualiza um agendamento (ex: status para concluído ou cancelado)."""
    if clinic_id == "master-clinic-id":
        return {"message": "Bypass: Agendamento atualizado com sucesso."}

    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    
    if not update_data:
        return {"message": "Nada a atualizar"}
        
    try:
        res = supabase.table("appointments") \
            .update(update_data) \
            .eq("id", appointment_id) \
            .eq("tenant_id", clinic_id) \
            .execute()
        return {"message": "Atualizado com sucesso", "appointment": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
