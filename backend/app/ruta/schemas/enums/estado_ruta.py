from enum import Enum

class EstadoRutaEnum(str,Enum):
    ACTIVA = "Activa"
    INACTIVA = "Inactiva"
    EN_ESPERA = "En Espera"