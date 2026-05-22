from enum import StrEnum

class EstadoEtapaEnum(StrEnum):
    PENDIENTE = "Pendiente"
    EN_PROGRESO = "En Progreso"
    COMPLETADA = "Completada"
    RETRASADA = "Retrasada"