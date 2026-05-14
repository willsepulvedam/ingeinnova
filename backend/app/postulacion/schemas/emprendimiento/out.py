from sqlmodel._compat import SQLModelConfig
from sqlmodel import Field
from typing import Annotated
import uuid


from backend.app.postulacion.schemas.emprendedor.out import EmprendedorOut
from backend.app.postulacion.schemas.emprendimiento.base import EmprendimientoBase


class EmprendimientoOut(EmprendimientoBase, table=False):
    id: Annotated[uuid.UUID, Field(description="ID del emprendimiento")]
    integrantes: Annotated[
        list[EmprendedorOut],
        Field(
            description="Lista de emprendedores integrantes del emprendimiento",
            default_factory=list,
        ),
    ] = []  # type: ignore # noqa: F821
    detalles: Annotated[
        DetallesEmpOut | None,  # noqa: F821 # type: ignore
        Field(description="Detalles adicionales del emprendimiento"),
    ] = None  

    model_config = SQLModelConfig(
        extra="forbid",
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "nom_proyecto": "EcoTech",
                "descripcion": "Desarrollo de soluciones tecnológicas sostenibles para el hogar.",
                "sector": "Tecnología",
                "estado_madurez": "Prototipo",
                "tipo_cliente_aspirado": "B2C - Consumidor Final (Personas)",
                "redes_sociales": "https://instagram.com/ecotech",
                "sitio_web": "https://ecotech.com",
                "integrantes": [
                    {
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
                            "ano_graduacion": None,
                        },
                        "es_emprendedor": True,
                        "interes_emprender": None,
                    },
                    {
                        "id": "123e4567-e89b-12d3-a456-426614174001",
                        "nom_completo": "María Gómez",
                        "cedula": "1005789124",
                        "email": "maria.gomez@unicolombo.edu.co",
                        "telefono": "+573001234568",
                        "sexo": "Mujer",
                        "edad": 23,
                        "barrio": "Robledo",
                        "localidad": "2 Localidad Histórica y del Caribe Sur",
                        "tipo_vinculo": "Estudiante",
                        "inf_academica": {
                            "semestre": "5",
                            "programa": "Ingeniería de Sistemas",
                            "jornada": "Diurna",
                            "ano_graduacion": None,
                        },
                        "es_emprendedor": True,
                        "interes_emprender": None,
                    },
                ],
                "detalles": {
                    "fecha_inicio": "2024-01-15",
                    "proyeccion_ventas": 50000,
                    "necesidades": "Asesoría en marketing digital y financiamiento",
                },
            }
        },
    )
