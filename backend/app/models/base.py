from datetime import datetime, timezone
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import DateTime, String, func
import uuid

class Base(DeclarativeBase):
    pass

class TenantBase(Base):
    """
    Base para todos os modelos que precisam de isolamento por Clínica (Tenant)
    e rastreabilidade (Audit) para LGPD.
    """
    __abstract__ = True

    # Identificador único do registro
    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4
    )

    # Multi-tenancy: Toda clínica verá apenas seus dados
    tenant_id: Mapped[str] = mapped_column(
        String(255), index=True, nullable=False
    )

    # LGPD: Trilha de auditoria automática
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    
    # Opcional: Quem criou o registro (LGPD audit)
    created_by: Mapped[str] = mapped_column(
        String(255), nullable=True
    )
