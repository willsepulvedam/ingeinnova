import uuid
from datetime import datetime
from sqlmodel import Field, SQLModel
from typing import Optional
from backend.app.emprendimiento.enums import EstadoEmprendimiento


class EmprendimientoCreate(SQLModel):
    nombre: str = Field(..., description="Nombre del emprendimiento", max_length=100)
    propietario_id: uuid.UUID = Field(...)
    descripcion: str = Field(
        ..., description="Descripción del emprendimiento", max_length=500
    )


class EmprendimientoRead(SQLModel):
    id: uuid.UUID
    nombre: str
    descripcion: str
    propietario_id: uuid.UUID
    fecha_creacion: datetime
    estado: EstadoEmprendimiento


class EmprendimientoUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    estado: Optional[EstadoEmprendimiento] = None
