from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime
from datetime import datetime
from app.models.base import TenantBase

class Campaign(TenantBase):
    """
    Representa uma campanha de recuperação de pacientes.
    Cada campanha está vinculada a uma instância do WhatsApp.
    """
    __tablename__ = "campaigns"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    message_template: Mapped[str] = mapped_column(String(2000), nullable=False)
    
    # InstanceID da Evolution API (Qual número vai disparar?)
    whatsapp_instance: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Status: 'rascunho', 'agendada', 'enviando', 'concluída'
    status: Mapped[str] = mapped_column(
        String(50), default="rascunho", index=True
    )
    
    scheduled_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    
    total_messages: Mapped[int] = mapped_column(default=0)
    sent_messages: Mapped[int] = mapped_column(default=0)
