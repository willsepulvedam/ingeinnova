

from datetime import datetime

from backend.app.ruta.schemas.base import RutaBase
from backend.app.ruta.schemas.enums.estado_ruta import EstadoRutaEnum
from backend.app.ruta.schemas.enums.tipo_ruta import TipoRutaEnum
from sqlmodel._compat import SQLModelConfig

class RutaUpdate(RutaBase, table=False): 
    estado: EstadoRutaEnum | None = None
    fecha_inicio: datetime | None = None
    fecha_final: datetime | None = None
    tipo: TipoRutaEnum | None = None
    contenido: str | None = None
    entrega: str | None = None
    
    
    model_config =  SQLModelConfig(
        extra="forbid",         
        from_attributes=True,
        json_schema_extra={
            "example": {
                "estado": "Finalizada",
                "fecha_final": "2026-09-15T18:59:59Z",
                "contenido": "Se actualizaron los hitos logrados tras la última sesión de mentoría.",
                "entrega": "Plan de negocios final aprobado y pitch deck optimizado."
            }
        },
    )