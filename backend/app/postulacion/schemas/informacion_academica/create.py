
from pydantic import ConfigDict

from backend.app.postulacion.schemas.informacion_academica.base import InformacionAcademicaBase


class InformacionAcademicaCreate(InformacionAcademicaBase):
    model_config = ConfigDict(
        extra="forbid",
        from_attributes=True,
        json_schema_extra={
            "example": {
                "semestre": 5,
                "programa": "Ingeniería de Sistemas",
                "ano_graduacion": 2024,
                "jornada": "Diurna"
            }
        }
    ) 