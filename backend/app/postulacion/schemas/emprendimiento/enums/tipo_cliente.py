from enum import StrEnum

class TipoClienteEmprendimiento(StrEnum):
    B2C = "B2C - Consumidor Final (Personas)"
    B2B = "B2B - Empresas / Corporativos"
    B2G = "B2G - Gobierno / Entidades Públicas"
    B2B2C = "B2B2C - Alianzas comerciales para llegar al usuario"