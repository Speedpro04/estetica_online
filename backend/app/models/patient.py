from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime
from datetime import datetime
from app.models.base import TenantBase

class Patient(TenantBase):
    """
    Representa um paciente da clínica.
    Dados sensíveis como telefone são protegidos por tenant_id e RLS.
    """
    __tablename__ = "patients"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False) # Ex: 5511999999999
    
    # Status: 'ativo', 'inativo' (precisa de recuperação), 'em_recuperação'
    status: Mapped[str] = mapped_column(
        String(50), default="ativo", index=True
    )
    
    last_visit: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    
    notes: Mapped[str] = mapped_column(String(1000), nullable=True)
