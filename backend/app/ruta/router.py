from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import  Session, select
from uuid import UUID
from backend.app.database import get_session
from backend.app.ruta.model import Ruta

router = APIRouter(prefix="/ruta", tags=["Ruta"])

@router.get("/{emprendimiento_id}", response_model=Ruta)
async def obtener(emprendimiento_id: UUID, session: Session = Depends(get_session)):
    ruta: Optional[Ruta] = session.exec(select(Ruta).where(Ruta.emprendimiento_id == emprendimiento_id)).first()
    if not ruta:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    return ruta

@router.post("/{ruta_id}", response_model=Ruta)
async def crear_ruta(ruta: Ruta, session: Session = Depends(get_session)):
    session.add(ruta)
    session.commit()
    session.refresh(ruta)
    return ruta

@router.get("/{ruta_id}", response_model=Ruta)
async def obtener_ruta(ruta_id: UUID, session: Session = Depends(get_session)):
    ruta = session.get(Ruta, ruta_id)
    if not ruta:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    return ruta