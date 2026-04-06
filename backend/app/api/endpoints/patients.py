
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.api import deps
from app.core.supabase_client import supabase

router = APIRouter()

class PatientCreate(BaseModel):
    name: str
    phone: str
    status: str = "ativo"
    notes: str = None

@router.get("/")
async def read_patients(
    skip: int = 0,
    limit: int = 100,
    clinic_id: str = Depends(deps.get_current_clinic_id),
) -> Any:
    """Lista os pacientes da clínica logada (Supabase + RLS)."""
    res = supabase.table("patients") \
        .select("*") \
        .eq("clinic_id", clinic_id) \
        .range(skip, skip + limit - 1) \
        .execute()
    
    return res.data or []

@router.post("/")
async def create_patient(
    data: PatientCreate,
    clinic_id: str = Depends(deps.get_current_clinic_id),
    user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    """Cria um novo paciente vinculado à clínica atual."""
    # Formatar telefone
    clean_phone = "".join(filter(str.isdigit, data.phone))
    
    res = supabase.table("patients").insert({
        "clinic_id": clinic_id,
        "name": data.name,
        "phone": clean_phone,
        "status": data.status,
        "notes": data.notes
    }).execute()

    if not res.data:
        raise HTTPException(status_code=400, detail="Erro ao criar paciente.")

    # Audit Log
    supabase.table("audit_logs").insert({
        "clinic_id": clinic_id,
        "user_id": user_id,
        "action": "patient_create",
        "details": {"id": res.data[0]["id"], "name": data.name}
    }).execute()

    return res.data[0]
