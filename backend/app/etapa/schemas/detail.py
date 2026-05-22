from typing import Annotated
from sqlmodel import Field

from backend.app.etapa.schemas.base import EtapaBase
from backend.app.postulacion.schemas.emprendimiento.out import EmprendimientoOut
from sqlmodel._compat import SQLModelConfig
from backend.app.ruta.schemas.out import RutaOut


class EtapaDetail(EtapaBase, table=False):
    emprendimientos: Annotated[
        list[EmprendimientoOut],
        Field(
            default_factory=list,
            description="Lista de emprendimientos asociados a esta etapa",
        ),
    ] = []

    rutas: Annotated[
        list[RutaOut],
        Field(
            default_factory=list, description="Lista de rutas asociadas a esta etapa"
        ),
    ] = []

    model_config = SQLModelConfig(
        extra="forbid",
        from_attributes=True,
        json_schema_extra={
            "example": {
                "nombre": "Etapa 1: Revisión de documentos",
                "descripcion": "En esta etapa se revisarán los documentos presentados por los postulantes para verificar que cumplan con los requisitos mínimos.",
                "estado": "Pendiente",
                "fecha_inicio": "2026-04-01",
                "fecha_final": "2026-07-15",
                "emprendimientos": [
                    {
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
                            "redes_sociales": "@ecotech_oficial",
                        },
                    }
                ],
                "rutas": [
                    {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "estado": "Activa",
                        "fecha_inicio": "2026-05-01T00:00:00Z",
                        "fecha_final": "2026-08-31T23:59:59Z",
                        "tipo": "Aceleración",
                        "contenido": "Mentorías personalizadas enfocadas en tracción comercial y levantamiento de capital.",
                        "entrega": "Documento de validación de mercado en PDF y el mockup del MVP.",
                    },
                    {
                        "id": "123e4567-e89b-12d3-a456-426614174001",
                        "estado": "Pendiente",      
                        "fecha_inicio": "2026-09-01T00:00:00Z",
                        "fecha_final": "2026-12-31T23:59:59Z",
                        "tipo": "Incubación",
                        "contenido": "Talleres grupales sobre validación de hipótesis, diseño de modelos de negocio y estrategias de crecimiento.",
                        "entrega": "Plan de validación de hipótesis en formato PDF.",
                    }
                ],
            }
        },
    )
