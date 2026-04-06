from datetime import datetime
import uuid
from sqlmodel import SQLModel, Field


class Ruta(SQLModel, table=True): 
    id: uuid.UUID = Field(default_factory=uuid.uuid4, alias="id") 
    emprendimiento_id: uuid.UUID = Field(default_factory=uuid.uuid4, alias="emprendimiento_id") 
    etapa_actual: str = Field(default="Inicio", alias="etapa_actual", description="Etapa actual de la ruta",max_length=100) 
    fecha_inicio: datetime = Field(default_factory=datetime.now)  

    class Config: 
        orm_mode = True