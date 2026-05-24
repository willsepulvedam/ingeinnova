import uuid

from sqlmodel._compat import SQLModelConfig
from sqlmodel import Field, SQLModel
from typing import Annotated
from backend.app.postulacion.schemas.emprendedor.update import EmprendedorUpdate
from backend.app.ruta.schemas.enums.ruta_ingeinnova import RutaIngeinnova


class EmprendimientoUpdate(SQLModel):
    nom_emprendimiento: Annotated[
        str | None,
        Field(
            default=None,
            max_length=255,
            description="Nuevo nombre ofial del emprendimiento",
        ),
    ] = None
    descripcion: Annotated[
        str | None,
        Field(
            default=None, max_length=1000, description="Nueva descripcion del proyecto"
        ),
    ] = None
    ruta_inscripcion: Annotated[
        RutaIngeinnova | None, Field(default=None, description="Nuevaruta asignada")
    ] = None

    integrantes_ids: Annotated[
        list[uuid.UUID] | None,
        Field(
            default=None,
            description="IDs de los emprendedores integrantes del emprendimiento. Si se proporciona, reemplazará a la lista actual de integrantes.",
        ),
    ] = None

    emprendedor: Annotated[
        EmprendedorUpdate | None,
        Field(
            default=None,
            description="Objecto con los datos actualizados del líder o integrantes principal del emprendimiento",
        ),
    ] = None

    model_config = SQLModelConfig(
        extra="forbid",
        from_attributes=True,
        json_schema_extra={
            "example": {
                "nom_emprendimiento": "EcoTech Renovado",
                "descripcion": "Actualización de la descripción del emprendimiento.",
                "ruta_inscripcion": "Ruta 2: Puesta en Marcha",
                "integrantes_ids": [
                    "123e4567-e89b-12d3-a456-426614174000",
                    "123e4567-e89b-12d3-a456-426614174001",
                ],
            }
        },
    )
