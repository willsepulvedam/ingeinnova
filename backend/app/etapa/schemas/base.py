from datetime import datetime

from sqlmodel import Field, SQLModel
from typing import Annotated
from backend.app.etapa.schemas.enums.etapa_estado import EstadoEtapaEnum


class EtapaBase(SQLModel, table=False):
    nombre: Annotated[
        str,
        Field(
            max_length=250, description="Nombre de la etapa del proceso de selección"
        ),
    ]
    descripcion: Annotated[
        str, Field(max_length=1000, description="Descripción detallada de la etapa")
    ]
    estado: Annotated[
        EstadoEtapaEnum,
        Field(default=EstadoEtapaEnum.PENDIENTE, description="Estado de la etapa"),
    ] = EstadoEtapaEnum.PENDIENTE
    fecha_inicio: Annotated[
        datetime | None, Field(..., description="Fecha de inicio de la etapa")
    ] = None
    fecha_fin: Annotated[
        datetime | None, Field(..., description="Fecha de finalización de la etapa")
    ] = None
