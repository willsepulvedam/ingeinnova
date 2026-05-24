from enum import Enum


class TipoRutaEnum(str, Enum):
    ACELERACION = "Aceleración"
    INCUBACION = "Incubación"
    MENTORIA = "Mentoría"
    FINANCIAMIENTO = "Financiamiento"
