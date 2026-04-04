from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.patient import Patient

router = APIRouter()

@router.get("/")
def read_patients(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Lista os pacientes da clínica logada (Tenant ID Filtered).
    """
    # MOCK: Simulando a consulta filtrada por tenant_id
    # No SQLAlchemy real: 
    # return db.query(Patient).filter(Patient.tenant_id == current_user.tenant_id).offset(skip).limit(limit).all()
    
    return [
        {
            "id": "p1", 
            "name": "Mariana Silva", 
            "status": "inativo", 
            "tenant_id": current_user.tenant_id
        },
        {
            "id": "p2", 
            "name": "Roberto Alves", 
            "status": "ativo", 
            "tenant_id": current_user.tenant_id
        }
    ]

@router.post("/")
def create_patient(
    *,
    db: Session = Depends(deps.get_db),
    name: str,
    phone: str,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Cria um novo paciente vinculado à clínica atual (Auto-tenant).
    """
    # Criamos o objeto já amarrando o tenant_id do usuário logado
    patient = Patient(
        name=name, 
        phone=phone, 
        tenant_id=current_user.tenant_id,
        created_by=str(current_user.id) # Audit Log LGPD
    )
    
    # Mock de sucesso
    return {
        "status": "success", 
        "message": f"Paciente {name} cadastrado na clínica {current_user.tenant_id}"
    }
