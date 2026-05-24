import uuid

from backend.app.etapa.schemas.base import EtapaBase
from sqlmodel._compat import SQLModelConfig


class EtapaOut(EtapaBase):
    id: uuid.UUID

    model_config = SQLModelConfig(
        extra="forbid",
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "nombre": "Etapa 1: Revisión de documentos",
                "descripcion": "En esta etapa se revisarán los documentos presentados por los postulantes para verificar que cumplan con los requisitos mínimos.",
                "estado": "Pendiente",
                "fecha_inicio": "2026-04-01T00:00:00Z",
                "fecha_fin": "2026-07-15T23:59:59Z",
            }
        },
    )