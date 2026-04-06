from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Float, Integer
from datetime import datetime
from app.models.base import TenantBase


class Patient(TenantBase):
    """
    Representa um paciente da clínica.
    Dados sensíveis como telefone são protegidos por tenant_id e RLS.

    Campos de Inteligência (Módulo de Recuperação):
    - risk_score: Score calculado pelo Motor de Inteligência (CRITICO, ALTO, MEDIO, BAIXO)
    - missed_appointments: Número de consultas perdidas sem reagendamento
    - treatment_type: Tipo de tratamento realizado (ex: Ortodontia, Implante, Limpeza)
    - treatment_value: Valor potencial do tratamento pendente
    - last_contact_date: Data do último contato de recuperação realizado
    - preferred_channel: Canal preferido de comunicação (WhatsApp, SMS, Email)
    """
    __tablename__ = "patients"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)  # Ex: 5511999999999

    # Status: 'ativo', 'inativo' (precisa de recuperação), 'em_recuperacao'
    status: Mapped[str] = mapped_column(
        String(50), default="ativo", index=True
    )

    last_visit: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    notes: Mapped[str] = mapped_column(String(1000), nullable=True)

    # ── Campos do Módulo de Inteligência ──────────────────────────────────────
    risk_score: Mapped[str] = mapped_column(
        String(20), default="BAIXO", index=True, nullable=True
    )

    missed_appointments: Mapped[int] = mapped_column(
        Integer, default=0, nullable=True
    )

    treatment_type: Mapped[str] = mapped_column(
        String(255), nullable=True
    )

    treatment_value: Mapped[float] = mapped_column(
        Float, nullable=True
    )

    last_contact_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Canal preferido: 'WhatsApp', 'SMS', 'Email'
    preferred_channel: Mapped[str] = mapped_column(
        String(50), default="WhatsApp", nullable=True
    )
