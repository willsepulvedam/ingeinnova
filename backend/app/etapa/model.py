from datetime import datetime
import uuid

from sqlmodel import SQLModel, Field
from typing import Optional

from backend.app.etapa.enums import EstadoEtapa


class Etapa(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    ruta_id: uuid.UUID = Field(foreign_key="ruta.id")
    nombre: str = Field(..., description="Nombre de la etapa", max_length=100)
    estado: EstadoEtapa = Field(
        default=EstadoEtapa.BLOQUEADA, description="Estado de la etapa"
    )
    fecha_completada: Optional[datetime] = Field(
        default=None, description="Fecha de finalización de la etapa"
    )
    descripcion: str = Field(..., description="Descripción de la etapa", max_length=500)
    orden: int = Field(..., description="Orden de la etapa en la ruta")
