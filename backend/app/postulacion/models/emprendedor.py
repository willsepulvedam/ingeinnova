from typing import TYPE_CHECKING
from sqlmodel import Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB

from backend.app.postulacion.schemas.emprendedor.base import EmprendedorBase

if TYPE_CHECKING:
    from backend.app.postulacion.models.emprendimiento import Tabla_Emprendimiento


class Tabla_Emprendedor(EmprendedorBase, table=True):
    __tablename__ = "Tabla_Emprendedor"  # type: ignore

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    password_hash: str = Field(...)
    creado_en: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    emprendimiento_id: UUID | None = Field(
        default=None, foreign_key="tabla_emprendimiento.emprendimiento_id", index=True
    )

    inf_academica: dict = Field(
        default=None,
        sa_column=Column(JSONB, nullable=False),
        description="Información académica del emprendedor serializada en formato JSON",
    )

    emprendimiento: "Tabla_Emprendimiento" = Relationship(back_populates="integrantes")
