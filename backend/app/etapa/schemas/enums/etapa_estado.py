from enum import Enum


class EstadoEtapaEnum(str, Enum):
    PENDIENTE = "Pendiente"
    EN_PROGRESO = "En Progreso"
    COMPLETADA = "Completada"
    RETRASADA = "Retrasada"
