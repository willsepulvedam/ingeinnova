from enum import Enum


class EstadoEmprendimiento(str, Enum):
    IDEA = "Idea / Proyecto"
    PROTOTIPO = "Prototipo"
    EN_MARCHA = "En marcha"
    FACTURANDO = "Facturando"
