from enum import Enum


class EstadoEtapa(str, Enum):
    BLOQUEADA = "Bloqueada"
    EN_PROGRESO = "En_Progreso"
    COMPLETADA = "Completada"
