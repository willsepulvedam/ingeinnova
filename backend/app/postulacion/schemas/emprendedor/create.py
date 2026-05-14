from typing_extensions import Annotated

from sqlmodel import Field
from sqlmodel._compat import SQLModelConfig


from backend.app.core.security import PasswordSecure
from backend.app.postulacion.schemas.emprendedor.base import EmprendedorBase


class EmprendedorCreate(EmprendedorBase, table=False):
    password: Annotated[
        PasswordSecure, Field(..., description="Codigo institucional del emprendedor")
    ]

    model_config = SQLModelConfig(
        extra="forbid",
        from_attributes=True,
        json_schema_extra={
            "example": {
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