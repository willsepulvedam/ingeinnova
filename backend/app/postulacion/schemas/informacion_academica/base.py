from pydantic import BaseModel, Field
from typing import Annotated

from backend.app.postulacion.schemas.emprendedor.enums.programa import ProgramaAcademicoEmprendedor
from backend.app.postulacion.schemas.emprendedor.enums.semestre import SemestreAcademicoEmprendedor
from backend.app.postulacion.schemas.emprendedor.enums.jornada import JordanAcademicaEmprendedor

class InformacionAcademicaBase(BaseModel):
    semestre: Annotated[SemestreAcademicoEmprendedor, Field(description="Semestre actual o estado")]
    programa: Annotated[ProgramaAcademicoEmprendedor, Field(description="Programa académico")]
    jornada: Annotated[JordanAcademicaEmprendedor, Field(description="Jornada de estudio")]
    ano_graduacion: Annotated[str | None, Field(default=None, max_length=50)] = None
