from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

from backend.app.emprendimiento.enums import EstadoEmprendimiento


class Emprendimiento(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    nombre: str = Field(..., description="Nombre del emprendimiento", max_length=100)
    propietario_id: uuid.UUID = Field(...)
    descripcion: str = Field(
        ..., description="Descripción del emprendimiento", max_length=500
    )
    fecha_creacion: datetime = Field(default_factory=datetime.now)
    estado: EstadoEmprendimiento = Field(
        default=EstadoEmprendimiento.INACTIVO, description="Estado del emprendimiento"
    )
