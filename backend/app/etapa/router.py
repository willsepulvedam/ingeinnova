from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel import Session
from uuid import UUID
from typing import Dict, Any, Union

from backend.app.core.database import get_db
from backend.app.etapa.repository import EtapaRepository
from backend.app.etapa.service import EtapaService
from backend.app.etapa.schemas import EtapaCreate, EtapaUpdate

from backend.app.etapa.exceptions.etapa_not_found_error import EtapaNotFoundError
from backend.app.etapa.exceptions.etapa_fecha_invalida import EtapaFechasInvalidasError

router = APIRouter(tags=["Etapas"])


def get_etapa_service() -> EtapaService:
    repository = EtapaRepository()
    return EtapaService(repository=repository)


@router.post("", status_code=status.HTTP_200_OK, response_model=None)
def crear_etapa(
    payload: EtapaCreate,
    db: Session = Depends(get_db),
    service: EtapaService = Depends(get_etapa_service),
) -> Union[Dict[str, Any], JSONResponse]:
    try:
        etapa = service.crear_etapa(db=db, etapa_in=payload)
        etapa_dict = etapa.model_dump() if hasattr(etapa, "model_dump") else dict(etapa)
        return {
            "success": True,
            "data": etapa_dict,
            "message": "Etapa creada correctamente",
        }
    except EtapaFechasInvalidasError as e:
        return JSONResponse(
            status_code=400, content={"success": False, "message": str(e)}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Internal server error: {str(e)}"},
        )


@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=None)
def obtener_etapa_con_rutas(
    id: UUID,
    db: Session = Depends(get_db),
    service: EtapaService = Depends(get_etapa_service),
) -> Union[Dict[str, Any], JSONResponse]:
    try:
        etapa = service.obtener_etapa_con_rutas(db=db, id=id)
        etapa_dict = etapa.model_dump() if hasattr(etapa, "model_dump") else dict(etapa)
        if "rutas" not in etapa_dict and hasattr(etapa, "rutas"):
            etapa_dict["rutas"] = [
                r.model_dump() if hasattr(r, "model_dump") else dict(r)
                for r in etapa.rutas
            ]
        return {"success": True, "data": etapa_dict}
    except EtapaNotFoundError:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Etapa no encontrada"},
        )


@router.get("", status_code=status.HTTP_200_OK, response_model=None)
def listar_etapas(
    db: Session = Depends(get_db),
    service: EtapaService = Depends(get_etapa_service),
) -> Dict[str, Any]:
    etapas = service.listar_etapas(db=db)
    lista_etapas = [
        e.model_dump() if hasattr(e, "model_dump") else dict(e) for e in etapas
    ]
    return {"success": True, "data": lista_etapas}


@router.put("/{id}", status_code=status.HTTP_200_OK, response_model=None)
def actualizar_etapa(
    id: UUID,
    payload: EtapaUpdate,
    db: Session = Depends(get_db),
    service: EtapaService = Depends(get_etapa_service),
) -> Union[Dict[str, Any], JSONResponse]:
    try:
        etapa = service.actualizar_etapa(db=db, id=id, cambio_in=payload)
        etapa_dict = etapa.model_dump() if hasattr(etapa, "model_dump") else dict(etapa)
        return {
            "success": True,
            "data": etapa_dict,
            "message": "Etapa actualizada correctamente",
        }
    except EtapaNotFoundError:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "No se puede actualizar. La Etapa solicitada no existe.",
            },
        )
    except EtapaFechasInvalidasError as e:
        return JSONResponse(
            status_code=400, content={"success": False, "message": str(e)}
        )


@router.delete("/{id}", status_code=status.HTTP_200_OK, response_model=None)
def eliminar_etapa(
    id: UUID,
    db: Session = Depends(get_db),
    service: EtapaService = Depends(get_etapa_service),
) -> Union[Dict[str, Any], JSONResponse]:
    try:
        service.eliminar_etapa(db=db, id=id)
        return {"success": True, "message": "Etapa eliminada correctamente"}
    except EtapaNotFoundError:
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "No se pudo eliminar. La Etapa solicitada no existe.",
            },
        )
