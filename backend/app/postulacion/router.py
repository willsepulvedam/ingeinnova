from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel import Session
from uuid import UUID
from typing import Dict, Any, Union

from backend.app.core.database import get_db
from backend.app.postulacion.repository import EmprendimientoRepository
from backend.app.postulacion.service import EmprendimientoService
from backend.app.postulacion.schemas.emprendimiento import (
    EmprendimientoCreate,
    EmprendimientoUpdate,
)
# Importamos el esquema real del emprendedor para el registro suelto
from backend.app.postulacion.schemas.emprendedor.create import EmprendedorCreate

from backend.app.postulacion.exceptions.emprendimiento_exception import (
    EmpredimientoNotFoundError,
)
from backend.app.postulacion.exceptions.postulacion_incompleted import (
    PostulacionIncompletedError,
)

# Cambiamos a un tag único y descriptivo para centralizar el módulo
router = APIRouter(tags=["Gestión de Postulaciones"])


def get_emprendimiento_service() -> EmprendimientoService:
    repository = EmprendimientoRepository()
    return EmprendimientoService(repository=repository)


@router.post(
    "",
    status_code=status.HTTP_200_OK,
    summary="Registrar Postulación Completa (Emprendedor y Emprendimiento)",
    response_model=None,
)
def registrar_postulacion_completa(
    payload: EmprendimientoCreate,
    db: Session = Depends(get_db),
    service: EmprendimientoService = Depends(get_emprendimiento_service),
) -> Union[Dict[str, Any], JSONResponse]:
    """
    Registra de forma unificada toda la información de una postulación,
    incluyendo los datos del emprendimiento y su emprendedor asociado.
    """
    try:
        postulacion = service.registrar_postulacion_completa(db=db, payload=payload)
        postulacion_dict = (
            postulacion.model_dump()
            if hasattr(postulacion, "model_dump")
            else dict(postulacion)
        )
        return {
            "success": True,
            "data": postulacion_dict,
            "message": "Postulación registrada correctamente",
        }
    except PostulacionIncompletedError as e:
        return JSONResponse(
            status_code=400, content={"success": False, "message": str(e)}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Internal server error: {str(e)}"},
        )


@router.post(
    "/emprendedores",
    status_code=status.HTTP_201_CREATED,
    summary="Crear solo cuenta de Emprendedor",
    response_model=None,
)
def crear_cuenta_emprendedor(
    payload: EmprendedorCreate,
    db: Session = Depends(get_db),
    service: EmprendimientoService = Depends(get_emprendimiento_service),
) -> Union[Dict[str, Any], JSONResponse]:
    """
    Registra únicamente la cuenta de un emprendedor en la base de datos (cédula, email, password, etc.),
    permitiendo que exista un usuario sin necesidad de vincularlo inmediatamente a un proyecto.
    """
    try:
        # Asegúrate de que este método exista en tu EmprendimientoService o adáptalo a su nombre real
        nuevo_emprendedor = service.crear_solo_emprendedor(db=db, payload=payload)
        
        emprendedor_dict = (
            nuevo_emprendedor.model_dump()
            if hasattr(nuevo_emprendedor, "model_dump")
            else dict(nuevo_emprendedor)
        )
        return {
            "success": True,
            "data": emprendedor_dict,
            "message": "Cuenta de emprendedor creada correctamente en el sistema.",
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Internal server error: {str(e)}"},
        )


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    summary="Obtener Detalle de una Postulación por ID",
    response_model=None,
)
def obtener_detalle_postulacion(
    id: UUID,
    db: Session = Depends(get_db),
    service: EmprendimientoService = Depends(get_emprendimiento_service),
) -> Union[Dict[str, Any], JSONResponse]:
    """
    Recupera la información detallada de una postulación específica utilizando su identificador único.
    """
    try:
        postulacion = service.obtener_detalle_postulacion(db=db, id=id)
        postulacion_dict = (
            postulacion.model_dump()
            if hasattr(postulacion, "model_dump")
            else dict(postulacion)
        )
        return {"success": True, "data": postulacion_dict}
    except EmpredimientoNotFoundError:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Postulación no encontrada"},
        )


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="Listar Resumen de Postulaciones",
    response_model=None,
)
def listar_resumen_postulaciones(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    service: EmprendimientoService = Depends(get_emprendimiento_service),
) -> Dict[str, Any]:
    """
    Retorna un listado paginado con el resumen de todas las postulaciones registradas en el sistema.
    """
    postulaciones = service.listar_resumen_postulaciones(db=db, skip=skip, limit=limit)
    lista_postulaciones = [
        p.model_dump() if hasattr(p, "model_dump") else dict(p) for p in postulaciones
    ]
    return {"success": True, "data": lista_postulaciones}


@router.put(
    "/{id}",
    status_code=status.HTTP_200_OK,
    summary="Actualizar Datos de una Postulación",
    response_model=None,
)
def actualizar_datos_postulacion(
    id: UUID,
    payload: EmprendimientoUpdate,
    db: Session = Depends(get_db),
    service: EmprendimientoService = Depends(get_emprendimiento_service),
) -> Union[Dict[str, Any], JSONResponse]:
    """
    Modifica los campos permitidos de una postulación existente (datos del proyecto o del equipo).
    """
    try:
        postulacion = service.actualizar_datos_postulacion(
            db=db, id=id, payload=payload
        )
        postulacion_dict = (
            postulacion.model_dump()
            if hasattr(postulacion, "model_dump")
            else dict(postulacion)
        )
        return {
            "success": True,
            "data": postulacion_dict,
            "message": "Postulación actualizada correctamente",
        }
    except EmpredimientoNotFoundError:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "No se puede actualizar. La Postulación solicitada no existe.",
            },
        )
    except PostulacionIncompletedError as e:
        return JSONResponse(
            status_code=400, content={"success": False, "message": str(e)}
        )


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    summary="Dar de Baja una Postulación",
    response_model=None,
)
def dar_de_baja_postulacion(
    id: UUID,
    db: Session = Depends(get_db),
    service: EmprendimientoService = Depends(get_emprendimiento_service),
) -> Union[Dict[str, Any], JSONResponse]:
    """
    Desactiva o da de baja del sistema una postulación específica por su ID.
    """
    try:
        service.dar_baja_postulacion(db=db, id=id)
        return {"success": True, "message": "Postulación dada de baja correctamente"}
    except EmpredimientoNotFoundError:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "No se pudo dar de baja. La Postulación solicitada no existe.",
            },
        )