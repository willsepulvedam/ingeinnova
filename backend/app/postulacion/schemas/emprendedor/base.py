from sqlmodel import Field, SQLModel
from typing import Annotated
from pydantic import EmailStr, field_validator
from pydantic_extra_types.phone_numbers import PhoneNumber
import re

from backend.app.postulacion.schemas.emprendedor.enums import (
    CategoriaEmprendedor,
    LocalidadEmprendedor,
    GeneroEmprendedor,
    TipoVinculoEmprendedor,
)
from backend.app.postulacion.schemas.informacion_academica.base import (
    InformacionAcademicaBase,
)


class EmprendedorBase(SQLModel, table=False):
    categoria: Annotated[
        CategoriaEmprendedor,
        Field(description="Categoría del postulante en UNICOLOMBO"),
    ]
    nom_completo: Annotated[str, Field(max_length=255)]
    email: Annotated[EmailStr, Field(max_length=255)]
    telefono: Annotated[
        PhoneNumber, Field(description="Número de teléfono del postulante")
    ]
    sexo: Annotated[GeneroEmprendedor, Field(description="Sexo biológico o identidad")]
    edad: Annotated[int, Field(description="Edad en años del postulante")]
    barrio: Annotated[str, Field(max_length=255)]
    localidad: Annotated[
        LocalidadEmprendedor, Field(description="Localidad de residencia")
    ]
    inf_academica: Annotated[
        InformacionAcademicaBase,
        Field(description="Información académica del emprendedor"),
    ]
    es_emprendedor: Annotated[bool, Field(default=True)]
    interes_emprender: Annotated[str | None, Field(default=None)] = None
    cedula: Annotated[
        str, Field(max_length=20, description="Número de documento de identidad")
    ]
    tipo_vinculo: Annotated[
        TipoVinculoEmprendedor, Field(description="Tipo de vinculo con UNICOLOMBO")
    ]

    @field_validator("email")
    @classmethod
    def validar_correo_institucional(cls, v: EmailStr) -> EmailStr:
        dominio_requerido = "@unicolombo.edu.co"

        if not v.endswith(dominio_requerido):
            raise ValueError(
                f"El correo electrónico debe terminar con '{dominio_requerido}'"
            )

        return v

    @field_validator("cedula")
    @classmethod
    def validar_documento_generico(cls, v: str) -> str:
        doc_limpio = v.strip()

        if not re.match(r"^[a-zA-Z0-9-]+$", doc_limpio):
            raise ValueError(
                "El documento de identidad solo puede contener letras, numeros o guiones."
            )

        if len(doc_limpio) < 5 or len(doc_limpio) > 20:
            raise ValueError(
                "El documento de identidad debe tener entre 5 y 20 caracteres."
            )

        return doc_limpio
