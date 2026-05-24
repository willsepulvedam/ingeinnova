from enum import Enum


class TipoVinculoEmprendedor(str, Enum):
    ESTUDIANTE = "Estudiante"
    EGRESADO = "Egresado"
    OTRO = "Otro"
