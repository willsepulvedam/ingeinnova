from enum import Enum


class NombreEtapaEnum(str, Enum):
    IDEACION = "Ideación"
    VALIDACION_MERCADO = "Validación de Mercado"
    PROTOIPADO = "Prototipado"
    MODELO_NEGOCIO = "Modelo de Negocio"
    ESCALAMIENTO = "Escalamiento"
