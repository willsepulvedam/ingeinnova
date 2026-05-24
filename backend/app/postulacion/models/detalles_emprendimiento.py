from typing import TYPE_CHECKING
import uuid
from sqlmodel import Field, Relationship

from backend.app.postulacion.schemas.detalles_emprendimiento.base import (
    DetallesEmprendimientoBase,
)

if TYPE_CHECKING:
    from backend.app.postulacion.models.emprendimiento import Tabla_Emprendimiento


class Tabla_DetallesEmprendimiento(DetallesEmprendimientoBase, table=True):
    __tablename__ = "tabla_detalles_emprendimiento"  # type: ignore

    emprendimiento_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        description="ID único del registro de detalles (PK en BD)",
    )

    emprendimiento: "Tabla_Emprendimiento" = Relationship(back_populates="detalles")

    @property
    def id(self) -> uuid.UUID:
        return self.emprendimiento_id