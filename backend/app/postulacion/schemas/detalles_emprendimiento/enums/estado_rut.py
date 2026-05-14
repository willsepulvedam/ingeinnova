from enum import StrEnum

class EstadoRut(StrEnum):
    TIENE = "Tiene RUT activo"
    NO_TIENE = "No tiene"
    EN_TRAMITE = "En trámite"
    