from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import  Session
from uuid import UUID
from backend.app.database import get_session
from backend.app.ruta.model import Ruta
from backend.app.ruta.service import RutaService

router = APIRouter(prefix="/ruta", tags=["Ruta"])
service = RutaService()

@router.get("/{emprendimiento_id}", response_model=Ruta)
async def obtener(emprendimiento_id: UUID, session: Session = Depends(get_session)):
    return service.obtener(emprendimiento_id, session)

@router.post("/{ruta_id}/avanzar", response_model=Ruta)
async def crear_ruta(ruta_id: UUID,ruta: Ruta, session: Session = Depends(get_session)):
    try:
        return service.avanzar_etapa(ruta_id, session)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/{ruta_id}/progreso", response_model=Ruta)
async def obtener_ruta(ruta_id: UUID, session: Session = Depends(get_session)):
    try:
        return service.obtener_progreso(ruta_id, session)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))