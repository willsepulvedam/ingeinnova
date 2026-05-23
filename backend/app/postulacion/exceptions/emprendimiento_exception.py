from fastapi import status


class EmpredimientoNotFoundError(Exception):
    """Excepción lanzada cuando no se encuentra un Emprendimiento o Postulacion."""
    
    def __init__(
        self,
        message: str = "Emprendimiento / Postulación no encontrada",
        status_code: int = status.HTTP_404_NOT_FOUND,
    ):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)
