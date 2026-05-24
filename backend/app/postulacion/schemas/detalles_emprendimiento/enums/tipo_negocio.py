from enum import Enum


class TipoEspecificoNegocio(str, Enum):
    PRODUCTO_MASIVO = "Producto masivo"
    PRODUCTO_NICHO = "Producto de nicho"
    SERVICIOS = "Servicios"
    TECNOLOGICO = "Plataforma digital / Tecnológico"
