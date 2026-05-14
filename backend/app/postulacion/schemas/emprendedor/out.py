from sqlmodel._compat import SQLModelConfig
import uuid

from backend.app.postulacion.schemas.emprendedor.base import EmprendedorBase
from backend.app.postulacion.schemas.informacion_academica.out import InformacionAcademicaOut


class EmprendedorOut(EmprendedorBase, table=False):
    id: uuid.UUID
    
    inf_academica: InformacionAcademicaOut  
    
    model_config = SQLModelConfig(
        extra="forbid",
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "nom_completo": "Juan Pérez",
                "cedula": "1005789123",
                "email": "juan.perez@unicolombo.edu.co",
                "telefono": "+573001234567",
                "sexo": "Hombre",
                "edad": 25,
                "barrio": "Centro",
                "localidad": "1 Localidad Histórica y del Caribe Norte",
                "tipo_vinculo": "Estudiante",
                "inf_academica": {
                    "semestre": "5",
                    "programa": "Ingeniería de Sistemas",
                    "jornada": "Diurna",
                    "ano_graduacion": None
                },
                "es_emprendedor": True,
                "interes_emprender": None
            }
        }
    )