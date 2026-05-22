from sqlmodel import Field, SQLModel
from typing import Annotated
from datetime import datetime

from backend.app.ruta.schemas.enums.estado_ruta import EstadoRutaEnum
from backend.app.ruta.schemas.enums.tipo_ruta import TipoRutaEnum


class RutaBase(SQLModel, table=False):
    estado: Annotated[EstadoRutaEnum, Field(description="Estado de la ruta")] = (
        EstadoRutaEnum.ACTIVA
    )
    fecha_inicio: Annotated[
        datetime | None, Field(..., description="Fecha y hora de inicio de la ruta")
    ] = None
    fecha_final: Annotated[
        datetime | None,
        Field(..., description="Fecha y hora de finalización de la ruta"),
    ] = None
    tipo: Annotated[
        TipoRutaEnum, Field(description="Tipo de ruta asignada al emprendimiento")
    ] = TipoRutaEnum.INCUBACION
    contenido: Annotated[
        str | None,
        Field(
            default=None,
            max_length=2000,
            description="Contenido, hitos o descripción detallada de la ruta",
        ),
    ] = None
