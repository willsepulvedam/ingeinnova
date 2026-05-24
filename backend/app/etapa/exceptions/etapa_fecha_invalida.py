from fastapi import status 

class EtapaFechasInvalidasError(Exception): 
    def __init__(
        self,
        message: str = "La fecha de inicio no puede ser posterior a la fecha final",
        status_code: int = status.HTTP_421_MISDIRECTED_REQUEST
    ) -> None: 
        self.message = message
        self.status_code = status_code
        super().__init__(message)