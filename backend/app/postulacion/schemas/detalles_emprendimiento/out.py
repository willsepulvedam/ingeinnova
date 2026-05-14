import uuid
from typing import Annotated
from sqlmodel import Field
from backend.app.postulacion.schemas.detalles_emprendimiento.base import DetallesEmprendimientoBase
from sqlmodel._compat import SQLModelConfig

class DetallesEmpOut(DetallesEmprendimientoBase):
    id: Annotated[uuid.UUID, Field(description="ID único del registro de detalles (PK en BD)")]
    
    model_config = SQLModelConfig(
        extra="forbid",
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "876e4567-e89b-12d3-a456-426614174999",
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
                "redes_sociales": "@ecotech_oficial"
            }
        }
    )