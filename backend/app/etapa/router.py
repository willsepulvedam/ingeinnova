from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import  Session, select
from uuid import UUID
from backend.app.database import get_session
from backend.app.etapa.model import Etapa
from backend.app.ruta.model import Ruta
from backend.app.etapa.service import EtapaService

router = APIRouter(prefix="/etapas", tags=["Etapa"])
service = EtapaService()

@router.get("/{emprendimiento_id}", response_model=list[Etapa])
async def obtener_por_ruta(emprendimiento_id: UUID, session: Session = Depends(get_session)):
    ruta = session.exec(select(Ruta).where(Ruta.emprendimiento_id == emprendimiento_id)).first()
    if not ruta:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    etapas = list(session.exec(select(Etapa).where(Etapa.ruta_id == ruta.id)).all())
    return etapas

@router.get("/{etapa_id}/detalle", response_model=Etapa)
async def obtener(etapa_id: UUID, session: Session = Depends(get_session)):
    etapa = session.get(Etapa, etapa_id)
    if not etapa:
        raise HTTPException(status_code=404, detail="Etapa no encontrada")
    return etapa

@router.post("/{etapa_id}/completar", response_model=Etapa)
async def completar(etapa_id: UUID, session: Session = Depends(get_session)):
    try:
        return service.completar(etapa_id, session)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))