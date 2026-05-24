from enum import Enum


class SectorEmprendimiento(str, Enum):
    TECNOLOGIA = "Tecnología / Software"
    GASTRONOMIA = "Gastronomía / Alimentos"
    MODA = "Moda / Textil"
    ARTESANIAS = "Artesanías / Diseño"
    SERVICIOS = "Servicios profesionales"
    EDUCACION = "Educación / EdTech"
    OTRO = "Otro"
