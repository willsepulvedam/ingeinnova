from datetime import datetime


from backend.app.etapa.schemas.enums.etapa_estado import EstadoEtapaEnum
from backend.app.etapa.schemas.base import EtapaBase
from sqlmodel._compat import SQLModelConfig


class EtapaUpdate(EtapaBase):
    nombre: str | None = None
    descripcion: str | None = None
    estado: EstadoEtapaEnum | None = None
    fecha_inicio: datetime | None = None
    fecha_final: datetime | None = None

    model_config = SQLModelConfig(
        extra="forbid",
        from_attributes=True,
        json_schema_extra={
            "example": {
                "descripcion": "En esta etapa se revisarán los documentos presentados por los postulantes para verificar que cumplan con los requisitos mínimos.",
                "estado": "En progreso",
                "fecha_final": "2026-10-15T23:59:59Z",
            }
        },
    )
