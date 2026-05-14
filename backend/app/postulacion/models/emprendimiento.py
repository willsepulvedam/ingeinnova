


from typing import TYPE_CHECKING
import uuid

from sqlmodel import Field, Relationship

from backend.app.postulacion.models.detalles_emprendimiento import Tabla_DetallesEmprendimiento
from backend.app.postulacion.schemas.emprendimiento.base import EmprendimientoBase

if TYPE_CHECKING: 
    from backend.app.postulacion.models.emprendedor import Tabla_Emprendedor

class Tabla_Emprendimiento(EmprendimientoBase, table=True):
    __tablename__ = "tabla_emprendimiento" # type: ignore

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        description="ID único del emprendimiento (PK en BD)",
    )
    
    detalles_id: uuid.UUID | None = Field(
        default=None,
        foreign_key="tabla_detalles_emprendimiento.id",
        description="FK fisica que apunta a la tabla de detalles de emprendimiento",
    )

    detalles: Tabla_DetallesEmprendimiento = Relationship(back_populates="emprendimiento")
    
    
    integrantes: list["Tabla_Emprendedor"] = Relationship(back_populates="emprendimiento")