from datetime import datetime
import uuid
from sqlmodel import SQLModel, Field

from backend.app.etapa.enums import EstadoEtapa


class Ruta(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    emprendimiento_id: uuid.UUID = Field(foreign_key="emprendimiento.id")
    etapa_actual: EstadoEtapa = Field(
        default=EstadoEtapa.BLOQUEADA, description="Estado actual de la ruta"
    )
    fecha_inicio: datetime = Field(default_factory=datetime.now)
