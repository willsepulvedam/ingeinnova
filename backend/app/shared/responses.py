from typing import Any, Dict, Optional


def standard_response(
    success: bool,
    message: str,
    data: Optional[Any] = None,
    status_code: int = 200
) -> Dict[str, Any]:
    """
    Función helper para crear respuestas estándar de la API.
    
    Args:
        success: Indica si la operación fue exitosa
        message: Mensaje descriptivo del resultado
        data: Datos de la respuesta (opcional)
        status_code: Código de estado HTTP
        
    Returns:
        Diccionario con la respuesta estandarizada
    """
    response = {
        "success": success,
        "message": message,
    }
    
    if data is not None:
        response["data"] = data
    
    return response


def success_response(
    message: str,
    data: Optional[Any] = None,
    status_code: int = 200
) -> Dict[str, Any]:
    """
    Helper para respuestas exitosas.
    
    Args:
        message: Mensaje descriptivo del resultado
        data: Datos de la respuesta (opcional)
        status_code: Código de estado HTTP
        
    Returns:
        Diccionario con la respuesta estandarizada exitosa
    """
    return standard_response(
        success=True,
        message=message,
        data=data,
        status_code=status_code
    )


def error_response(
    message: str,
    data: Optional[Any] = None,
    status_code: int = 400
) -> Dict[str, Any]:
    """
    Helper para respuestas de error.
    
    Args:
        message: Mensaje descriptivo del error
        data: Datos adicionales del error (opcional)
        status_code: Código de estado HTTP
        
    Returns:
        Diccionario con la respuesta estandarizada de error
    """
    return standard_response(
        success=False,
        message=message,
        data=data,
        status_code=status_code
    )