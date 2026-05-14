from sqlmodel import Field, SQLModel
from typing import Annotated

from backend.app.postulacion.schemas.emprendimiento.enums.estado import EstadoEmprendimiento

from backend.app.postulacion.schemas.emprendimiento.enums.sector import SectorEmprendimiento
from backend.app.postulacion.schemas.emprendimiento.enums.tipo_cliente import TipoClienteEmprendimiento



class EmprendimientoBase(SQLModel, table=False):
    nom_proyecto: Annotated[str, Field(max_length=255, description="Nombre del proyecto o emprendimiento")]
    descripcion: Annotated[str, Field(max_length=1000, description="Breve descripcion de que hace el negocio o proyecto")]
    sector: Annotated[SectorEmprendimiento, Field(description="Sector al que pertenece el emprendimiento")]  
    estado_madurez: Annotated[EstadoEmprendimiento, Field(description="Estado de madurez del emprendimiento")]  
    redes_sociales: Annotated[str | None, Field(default=None, max_length=255, description="Enlaces a Instagram, TikTok, etc.")] = None
    sitio_web: Annotated[str | None, Field(default=None, max_length=255, description="URL del sitio web si aplica")] = None
    tipo_cliente_aspirado: Annotated[
        TipoClienteEmprendimiento, 
        Field(description="Tipo de cliente al que aspira el emprendimiento", default=None),
    ]