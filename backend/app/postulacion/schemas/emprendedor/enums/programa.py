from enum import Enum


class ProgramaAcademicoEmprendedor(str, Enum):
    INDUSTRIAL = "Ingeniería Industrial"
    SISTEMAS = "Ingeniería de Sistemas"
    DERECHO = "Derecho"
    TURISMO = "Administración de empresas turísticas y hoteleras"
    INGLES = "Licenciatura en Bilingüismo con énfasis en Inglés"
    CONTADURIA = "Contaduría Pública"
    ADMINISTRACION = "Administración de Empresas"
    EVENTOS = "Especialización gestión integral de eventos"
    OTRO = "Otro"
