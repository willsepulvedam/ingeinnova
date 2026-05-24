from enum import Enum


class EstadoRut(str, Enum):
    TIENE = "Tiene RUT activo"
    NO_TIENE = "No tiene"
    EN_TRAMITE = "En trámite"
