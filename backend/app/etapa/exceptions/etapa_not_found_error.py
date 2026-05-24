from fastapi import status 


class EtapaNotFoundError(Exception): 
    def __init__(
        self,
        message: str = "Etapa no encontrada",
        status_code: int = status.HTTP_404_NOT_FOUND
    ) -> None: 
        self.message = message
        self.status_code = status_code
        super().__init__(message)
    