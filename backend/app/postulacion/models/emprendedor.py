from sqlmodel import Field
from uuid import UUID, uuid4
from datetime import datetime, timezone

from backend.app.postulacion.schemas.emprendedor.base import EmprendedorBase


class Tabla_Emprendedor(EmprendedorBase, table=True):
    __tablename__ = "Tabla_Emprendedor"  # type: ignore

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    password_hash: str = Field(...)
    creado_en: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    emprendimiento_id: UUID | None = Field(
        default=None, foreign_key="emprendimientos.id", index=True
    )
