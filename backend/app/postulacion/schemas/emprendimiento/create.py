import uuid

from sqlmodel import Field
from typing import Annotated
from sqlmodel._compat import SQLModelConfig

from backend.app.postulacion.schemas.detalles_emprendimiento.create import (
    DetallesEmpCreate,
)
from backend.app.postulacion.schemas.emprendimiento.base import EmprendimientoBase


class EmprendimientoCreate(EmprendimientoBase, table=False):
    integrantes_ids: Annotated[
        list[uuid.UUID],
        Field(description="IDs de los emprendedores integrantes del emprendimiento"),
    ]
    detalles: Annotated[
        DetallesEmpCreate | None,
        Field(description="Detalles adicionales del emprendimiento"),
    ] = None

    model_config = SQLModelConfig(
        extra="forbid",
        from_attributes=True,
        json_schema_extra={
            "example": {
                "nom_proyecto": "EcoTech",
                "descripcion": "Desarrollo de soluciones tecnológicas sostenibles para el hogar.",
                "sector": "Tecnología",
                "estado_madurez": "Prototipo",
                "redes_sociales": "https://instagram.com/ecotech",
                "sitio_web": "https://ecotech.com",
                "tipo_cliente_aspirado": "B2C - Consumidor Final (Personas)",
                "integrantes_ids": [
                    "123e4567-e89b-12d3-a456-426614174000",
                    "123e4567-e89b-12d3-a456-426614174001",
                ],
                "detalles": {
                    "constituida_legalmente": "No",
                    "nit_empresa": None,
                    "tiene_rut": "No tiene",
                    "tiene_cvlac": False,
                    "tiempo_existencia": "Menos de 1 año",
                    "cantidad_trabajadores": "1-3",
                    "tipo_negocio": "Producto masivo",
                    "sector_economico": "Tecnología",
                    "es_familiar": "No",
                    "familia_tiene_empresa": "No",
                    "empresa_familia_legal": "No",
                    "historial_quiebra": False,
                    "redes_sociales": "@ecotech_oficial",
                },
            }
        },
    )
