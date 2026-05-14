from typing import Annotated


from sqlmodel._compat import SQLModelConfig
from sqlmodel import Field
import uuid

from backend.app.postulacion.schemas.detalles_emprendimiento.out import DetallesEmpOut
from backend.app.postulacion.schemas.emprendimiento.base import EmprendimientoBase


class EmprendimientoDetail(EmprendimientoBase):
    id: uuid.UUID
    detalles: DetallesEmpOut | None = None
    etapa_actual: EtapaOut | None = None  # type: ignore # noqa: F821
    rutas: Annotated[list[RutaOut], Field(default_factory=list)]  # type: ignore # noqa: F821
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
                    "nombre": "Validación de mercado",
                    "descripcion": "Actualmente validando el producto con clientes potenciales.",
                },
                "rutas": [
                    {
                        "nombre": "Ruta de Emprendimiento",
                        "descripcion": "Ruta general para emprendimientos en etapa de prototipo.",
                    },
                    {
                        "nombre": "Ruta de Tecnología",
                        "descripcion": "Ruta especializada para emprendimientos tecnológicos.",
                    },
                ],
                "tutor_assigned_name": "María Gómez",
                "tutor_assigned_status": True,
            }
        },
    )
