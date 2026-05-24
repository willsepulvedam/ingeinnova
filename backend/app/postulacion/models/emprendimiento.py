from typing import TYPE_CHECKING
import uuid

from sqlmodel import Field, Relationship, AutoString
from backend.app.postulacion.schemas.emprendimiento.base import EmprendimientoBase

if TYPE_CHECKING:
    from backend.app.postulacion.models.emprendedor import Tabla_Emprendedor
    from backend.app.postulacion.models.detalles_emprendimiento import (
        Tabla_DetallesEmprendimiento,
    )


class Tabla_Emprendimiento(EmprendimientoBase, table=True):
    __tablename__ = "tabla_emprendimiento"  # type: ignore

    emprendimiento_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
    )

    sector: str = Field(sa_type=AutoString, sa_column_kwargs={"nullable": False})
    estado_madurez: str = Field(
        sa_type=AutoString, sa_column_kwargs={"nullable": False}
    )
    tipo_cliente_aspirado: str = Field(
        sa_type=AutoString, sa_column_kwargs={"nullable": False}
    )

    detalles_id: uuid.UUID | None = Field(
        default=None,
        foreign_key="tabla_detalles_emprendimiento.emprendimiento_id",
    )

    detalles: "Tabla_DetallesEmprendimiento" = Relationship(
        back_populates="emprendimiento"
    )

    integrantes: list["Tabla_Emprendedor"] = Relationship(
        back_populates="emprendimiento"
    )
