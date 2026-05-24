from enum import Enum

class CategoriaEmprendedor(str, Enum):
    ESTUDIANTE = "Estudiante"
    EGRESADO = "Egresado"
    ADMINISTRATIVO = "Administrativo"