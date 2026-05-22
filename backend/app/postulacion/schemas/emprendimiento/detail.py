from typing import Annotated


from sqlmodel._compat import SQLModelConfig
from sqlmodel import Field
import uuid

from backend.app.etapa.schemas.out import EtapaOut
from backend.app.postulacion.schemas.detalles_emprendimiento.out import DetallesEmpOut
from backend.app.postulacion.schemas.emprendimiento.base import EmprendimientoBase
from backend.app.ruta.schemas.out import RutaOut


class EmprendimientoDetail(EmprendimientoBase):
    id: uuid.UUID
    detalles: DetallesEmpOut | None = None
    etapa_actual: EtapaOut | None = None
    rutas: Annotated[list[RutaOut], Field(default_factory=list)]
    tutor_assigned_name: Annotated[
        str, Field(description="Indica si el emprendimiento tiene un tutor asignado")
    ]
    tutor_assigned_status: Annotated[
        bool,
        Field(
            description="Indica si el emprendimiento tiene un tutor asignado",
            default=False,
        ),
    ]

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
                "redes_sociales": "https://instagram.com/ecotech",
                "tipo_cliente_aspirado": "B2C - Consumidor Final (Personas)",
                "sitio_web": "https://ecotech.com",
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
                "etapa_actual": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "nombre": "Etapa 1: Revisión de documentos",
                    "descripcion": "En esta etapa se revisarán los documentos presentados por los postulantes para verificar que cumplan con los requisitos mínimos.",
                    "estado": "Pendiente",
                    "fecha_inicio": "2026-04-01T00:00:00Z",
                    "fecha_fin": "2026-07-15T23:59:59Z",
                },
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
                "tutor_assigned_name": "María Gómez",
                "tutor_assigned_status": True,
            }
        },
    )
