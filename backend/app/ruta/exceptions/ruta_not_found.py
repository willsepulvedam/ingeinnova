from fastapi import status 


class RutaNotFoundError(Exception): 
    def __init__(
        self,
        message: str = "Ruta no encontrada",
        status_code: int = status.HTTP_404_NOT_FOUND
    ) -> None: 
        self.message = message
        self.status_code = status_code
        super().__init__(message)
        