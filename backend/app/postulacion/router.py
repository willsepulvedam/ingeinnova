from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from uuid import UUID

from backend.app.core.database import get_db

from backend.app.postulacion.repository import EmprendimientoRepository
from backend.app.postulacion.service import EmprendimientoService

from backend.app.postulacion.schemas.emprendimiento import (
    EmprendimientoCreate,
    EmprendimientoUpdate,
    EmprendimientoOut,
)

router = APIRouter(prefix="/postulaciones", tags=["Postulaciones"])


def get_emprendimiento_service() -> EmprendimientoService:
    """
    Inyecta el repositorio limpio dentro del servicio.
    No requiere la sesión 'db' aquí porque los métodos se encargan
    de recibirla individualmente a través de los endpoints de FastAPI.
    """
    repository = EmprendimientoRepository()
    return EmprendimientoService(repository=repository)


@router.post(
    "/",
    response_model=EmprendimientoOut,
    status_code=status.HTTP_201_CREATED,
    summary="registrar_postulacion_completa",
)
def registrar_postulacion_completa(
    payload: EmprendimientoCreate,
    db: Session = Depends(get_db),
    service: EmprendimientoService = Depends(get_emprendimiento_service),
):
    return service.registrar_postulacion_completa(db=db, payload=payload)


@router.get(
    "/{id}",
    response_model=EmprendimientoOut,
    status_code=status.HTTP_200_OK,
    summary="obtener_detalle_postulacion",
)
def obtener_detalle_postulacion(
    id: UUID,
    db: Session = Depends(get_db),
    service: EmprendimientoService = Depends(get_emprendimiento_service),
):
    return service.obtener_detalle_postulacion(db=db, id=id)


@router.get(
    "/",
    response_model=list[EmprendimientoOut],
    status_code=status.HTTP_200_OK,
    summary="listar_resumen_postulaciones",
)
def listar_resumen_postulaciones(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    service: EmprendimientoService = Depends(get_emprendimiento_service),
):
    return service.listar_resumen_postulaciones(db=db, skip=skip, limit=limit)


@router.patch(
    "/{id}",
    response_model=EmprendimientoOut,
    status_code=status.HTTP_200_OK,
    summary="actualizar_datos_postulacion",
)
def actualizar_datos_postulacion(
    id: UUID,
    payload: EmprendimientoUpdate,
    db: Session = Depends(get_db),
    service: EmprendimientoService = Depends(get_emprendimiento_service),
):
    return service.actualizar_datos_postulacion(db=db, id=id, payload=payload)


@router.delete(
    "/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="dar_de_baja_postulacion"
)
def dar_de_baja_postulacion(
    id: UUID,
    db: Session = Depends(get_db),
    service: EmprendimientoService = Depends(get_emprendimiento_service),
):
    service.dar_baja_postulacion(db=db, id=id)
    return None
