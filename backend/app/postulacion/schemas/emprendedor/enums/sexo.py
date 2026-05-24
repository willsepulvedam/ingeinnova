from enum import Enum

class GeneroEmprendedor(str, Enum):
    MASCULINO = "Masculino"
    FEMENINO = "Femenino"
    OTRO = "Otro"
    PREFIERO_NO_DECIRLO = "Prefiero no decirlo"