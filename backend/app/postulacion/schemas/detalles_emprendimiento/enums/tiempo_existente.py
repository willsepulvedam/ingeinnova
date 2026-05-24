from enum import Enum


class TiempoEmprendimiento(str, Enum):
    MENOS_1_ANO = "Menos de 1 año"
    ENTRE_1_Y_3 = "De 1 a 3 años"
    MAS_3_ANOS = "Más de 3 años"
