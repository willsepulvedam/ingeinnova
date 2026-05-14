

import uuid

from sqlmodel import Field
from typing import Annotated
from sqlmodel._compat import SQLModelConfig

from backend.app.postulacion.schemas.emprendimiento.base import EmprendimientoBase


class EmprendimientoCreate(EmprendimientoBase, table=False):
    integrantes_ids: Annotated[list[uuid.UUID], Field(description="IDs de los emprendedores integrantes del emprendimiento")]
    
    model_config = SQLModelConfig(
        
    )
    