from typing import Annotated

from sqlmodel._compat import SQLModelConfig
from sqlmodel import Field, SQLModel

from backend.app.postulacion.schemas.emprendedor.enums import (
    CategoriaEmprendedor,
    LocalidadEmprendedor,
    GeneroEmprendedor,
    TipoVinculoEmprendedor,
)
from backend.app.postulacion.schemas.informacion_academica.base import (
    InformacionAcademicaBase,
)


class EmprendedorUpdate(SQLModel):
    nom_completo: Annotated[
        str | None,
        Field(
            default=None,
            max_length=255,
            description="Nuevo nombre completo del emprendedor",
        ),
    ] = None
    email: Annotated[
        str | None,
        Field(
            default=None,
            max_length=255,
            description="Nuevo correo electrónico institucional",
        ),
    ] = None
    telefono: Annotated[
        str | None,
        Field(
            default=None,
            description="Nuevo número de teléfono del postulante",
        ),
    ] = None
    sexo: Annotated[
        GeneroEmprendedor | None,
        Field(default=None, description="Nuevo sexo biológico o identidad"),
    ] = None
    edad: Annotated[
        int | None,
        Field(default=None, description="Nueva edad en años del postulante"),
    ] = None
    barrio: Annotated[
        str | None,
        Field(
            default=None,
            max_length=255,
            description="Nuevo barrio de residencia",
        ),
    ] = None
    localidad: Annotated[
        LocalidadEmprendedor | None,
        Field(default=None, description="Nueva localidad de residencia"),
    ] = None
    inf_academica: Annotated[
        InformacionAcademicaBase | None,
        Field(default=None, description="Nueva información académica del emprendedor"),
    ] = None
    es_emprendedor: Annotated[
        bool | None,
        Field(default=None, description="Indica si es emprendedor"),
    ] = None
    interes_emprender: Annotated[
        str | None,
        Field(
            default=None,
            description="Nuevo interés en emprender",
        ),
    ] = None
    categoria: Annotated[
        CategoriaEmprendedor | None,
        Field(default=None, description="Nueva categoría del postulante en UNICOLOMBO"),
    ] = None
    tipo_vinculo: Annotated[
        TipoVinculoEmprendedor | None,
        Field(default=None, description="Nuevo tipo de vínculo con UNICOLOMBO"),
    ] = None

    model_config = SQLModelConfig(
        extra="forbid",
        from_attributes=True,
        json_schema_extra={
            "example": {
                "nom_completo": "Juan Pérez Actualizado",
                "email": "juan.perez@unicolombo.edu.co",
                "telefono": "+573001234567",
                "sexo": "Hombre",
                "edad": 26,
                "barrio": "Centro",
                "localidad": "1 Localidad Histórica y del Caribe Norte",
                "inf_academica": {
                    "semestre": "6",
                    "programa": "Ingeniería de Sistemas",
                    "jornada": "Diurna",
                    "ano_graduacion": None
                },
                "es_emprendedor": True,
                "interes_emprender": "Tecnología",
                "categoria": "Pregrado",
                "tipo_vinculo": "Estudiante"
            }
        },
    )