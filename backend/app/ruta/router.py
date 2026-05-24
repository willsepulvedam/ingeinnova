from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel import Session
from uuid import UUID
from typing import Dict, Any, Union

from backend.app.core.database import get_db
from backend.app.ruta.repository import RutaRepository
from backend.app.ruta.service import RutaService
from backend.app.ruta.schemas import RutaCreate, RutaUpdate
from backend.app.etapa.repository import EtapaRepository
from backend.app.etapa.service import EtapaService

from backend.app.ruta.exceptions.ruta_not_found import RutaNotFoundError
from backend.app.ruta.exceptions.ruta_contenido_invalidad import (
    RutaContenidoInvalidoError,
)
from backend.app.etapa.exceptions.etapa_not_found_error import EtapaNotFoundError

router = APIRouter(tags=["Rutas"])


def get_ruta_service() -> RutaService:
    repository = RutaRepository()
    etapa_repository = EtapaRepository()
    etapa_service = EtapaService(repository=etapa_repository)
    return RutaService(repository=repository, etapa_service=etapa_service)


@router.post(
    "/etapas/{etapa_id}/rutas", status_code=status.HTTP_200_OK, response_model=None
)
def crear_ruta_en_etapa(
    etapa_id: UUID,
    payload: RutaCreate,
    db: Session = Depends(get_db),
    service: RutaService = Depends(get_ruta_service),
) -> Union[Dict[str, Any], JSONResponse]:
    try:
        ruta = service.crear_ruta_en_etapa(db=db, etapa_id=etapa_id, ruta_in=payload)
        ruta_dict = ruta.model_dump() if hasattr(ruta, "model_dump") else dict(ruta)
        return {
            "success": True,
            "data": ruta_dict,
            "message": "Ruta creada correctamente",
        }
    except EtapaNotFoundError:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "No se pudo crear la ruta. La Etapa solicitada no existe.",
            },
        )
    except RutaContenidoInvalidoError as e:
        return JSONResponse(
            status_code=400, content={"success": False, "message": str(e)}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Internal server error: {str(e)}"},
        )


@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=None)
def obtener_ruta(
    id: UUID,
    db: Session = Depends(get_db),
    service: RutaService = Depends(get_ruta_service),
) -> Union[Dict[str, Any], JSONResponse]:
    try:
        ruta = service.obtener_ruta(db=db, id=id)
        ruta_dict = ruta.model_dump() if hasattr(ruta, "model_dump") else dict(ruta)
        return {"success": True, "data": ruta_dict}
    except RutaNotFoundError:
        return JSONResponse(
            status_code=404, content={"success": False, "message": "Ruta no encontrada"}
        )


@router.get(
    "/etapas/{etapa_id}/rutas", status_code=status.HTTP_200_OK, response_model=None
)
def listar_rutas_por_etapa(
    etapa_id: UUID,
    db: Session = Depends(get_db),
    service: RutaService = Depends(get_ruta_service),
) -> Union[Dict[str, Any], JSONResponse]:
    try:
        rutas = service.listar_rutas_por_etapa(db=db, etapa_id=etapa_id)
        lista_rutas = [
            r.model_dump() if hasattr(r, "model_dump") else dict(r) for r in rutas
        ]
        return {"success": True, "data": lista_rutas}
    except EtapaNotFoundError:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "La Etapa solicitada no existe."},
        )


@router.put("/{id}", status_code=status.HTTP_200_OK, response_model=None)
def actualizar_ruta(
    id: UUID,
    payload: RutaUpdate,
    db: Session = Depends(get_db),
    service: RutaService = Depends(get_ruta_service),
) -> Union[Dict[str, Any], JSONResponse]:
    try:
        ruta = service.actualizar_ruta(db=db, id=id, cambio_in=payload)
        ruta_dict = ruta.model_dump() if hasattr(ruta, "model_dump") else dict(ruta)
        return {
            "success": True,
            "data": ruta_dict,
            "message": "Ruta actualizada correctamente",
        }
    except RutaNotFoundError:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "No se puede actualizar. La Ruta solicitada no existe.",
            },
        )
    except RutaContenidoInvalidoError as e:
        return JSONResponse(
            status_code=400, content={"success": False, "message": str(e)}
        )


@router.delete("/{id}", status_code=status.HTTP_200_OK, response_model=None)
def eliminar_ruta(
    id: UUID,
    db: Session = Depends(get_db),
    service: RutaService = Depends(get_ruta_service),
) -> Union[Dict[str, Any], JSONResponse]:
    try:
        service.eliminar_ruta(db=db, id=id)
        return {"success": True, "message": "Ruta eliminada correctamente"}
    except RutaNotFoundError:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "No se pudo eliminar. La Ruta solicitada no existe.",
            },
        )
