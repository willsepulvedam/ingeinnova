from sqlmodel import Field
import uuid
from typing import Annotated


from backend.app.ruta.schemas.base import RutaBase
from sqlmodel._compat import SQLModelConfig


class RutaOut(RutaBase, table=False):
    id: uuid.UUID
    entrega: Annotated[
        str,
        Field(
            description="Descripción de la entrega o resultado esperado al finalizar la ruta",
            min_length=5,
            max_length=2000,
        ),
    ]

    model_config = SQLModelConfig(
        extra="forbid",
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "estado": "Activa",
                "fecha_inicio": "2026-05-01T00:00:00Z",
                "fecha_final": "2026-08-31T23:59:59Z",
                "tipo": "Aceleración",
                "contenido": "Mentorías personalizadas enfocadas en tracción comercial y levantamiento de capital.",
                "entrega": "Documento de validación de mercado en PDF y el mockup del MVP.",
            }
        },
    )
