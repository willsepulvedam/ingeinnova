from backend.app.postulacion.schemas.detalles_emprendimiento.base import DetallesEmprendimientoBase
from sqlmodel._compat import SQLModelConfig

class DetallesEmpCreate(DetallesEmprendimientoBase):
    
    model_config = SQLModelConfig(
        extra="forbid",
        from_attributes=True,
        json_schema_extra={
            "example": {
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