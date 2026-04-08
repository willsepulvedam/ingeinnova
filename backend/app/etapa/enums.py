from enum import Enum


class EstadoEtapa(str, Enum):
    BLOQUEADA = "BLOQUEADA"
    EN_PROGRESO = "EN_PROGRESO"
    COMPLETADA = "COMPLETADA"
