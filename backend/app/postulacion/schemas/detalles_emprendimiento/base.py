from sqlmodel import Field, SQLModel
from typing import Annotated

# Importamos los enums locales que creamos previamente para este sub-módulo
from backend.app.postulacion.schemas.detalles_emprendimiento.enums import (
    EstadoRut,
    TiempoEmprendimiento,
    TipoEspecificoNegocio,
)


class DetallesEmprendimientoBase(SQLModel, table=False):
    constituida_legalmente: Annotated[
        str, Field(max_length=50, description="¿Está constituida legalmente? (Sí/No)")
    ]
    nit_empresa: Annotated[
        str | None,
        Field(default=None, max_length=50, description="NIT de la empresa si aplica"),
    ] = None
    tiene_rut: Annotated[EstadoRut, Field(description="Estado del RUT")]
    tiene_cvlac: Annotated[
        bool, Field(default=False, description="¿Tiene registro en CvLAC?")
    ]
    tiempo_existencia: Annotated[
        TiempoEmprendimiento, Field(description="Tiempo de operación en el mercado")
    ]
    cantidad_trabajadores: Annotated[
        str, Field(max_length=50, description="Rango de cantidad de trabajadores")
    ]
    tipo_negocio: Annotated[
        TipoEspecificoNegocio, Field(description="Tipo específico de negocio")
    ]
    sector_economico: Annotated[
        str, Field(max_length=100, description="Sector económico detallado")
    ]
    es_familiar: Annotated[
        str, Field(max_length=50, description="¿Es un negocio familiar?")
    ]
    familia_tiene_empresa: Annotated[
        str, Field(max_length=50, description="¿Su familia posee otra empresa?")
    ]
    empresa_familia_legal: Annotated[
        str, Field(max_length=50, description="¿La empresa familiar está legalizada?")
    ]
    historial_quiebra: Annotated[
        bool,
        Field(default=False, description="¿Tiene historial de quiebra financiera?"),
    ]
    redes_sociales: Annotated[
        str | None,
        Field(default=None, max_length=255, description="Usuario o handle de la empresa (ej: @ecotech_oficial)"),
    ] = None
