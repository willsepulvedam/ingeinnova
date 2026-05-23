from fastapi import status


class PostulacionIncompletedError(Exception):
    """Excepción lanzada cuando postulaciones estan incompletas."""

    def __init__(
        self,
        message: str = "Faltan datos obligatorios del emprendedor o el negocio",
        status_code: int = status.HTTP_400_BAD_REQUEST,
    ):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)
