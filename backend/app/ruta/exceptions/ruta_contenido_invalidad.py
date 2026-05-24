from fastapi import status 


class RutaContenidoInvalidoError(Exception): 
    def __init__(
        self,
        message: str = "La descripción de la entrega no complue con los requisitos",
        status_code: int = status.HTTP_400_BAD_REQUEST
    ) -> None: 
        self.message = message
        self.status_code = status_code
        super().__init__(message)