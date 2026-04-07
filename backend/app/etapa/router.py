from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import  Session, select
from uuid import UUID
from backend.app.database import get_session
from backend.app.etapa.enums import EstadoEtapa
from backend.app.etapa.model import Etapa

router = APIRouter(prefix="/etapas", tags=["Etapa"])


@router.get("/{emprendimiento_id}", response_model=list[Etapa])
async def obtener_por_ruta(emprendimiento_id: UUID, session: Session = Depends(get_session)):
    etapas = session.exec(select(Etapa).where(Etapa.id == emprendimiento_id)).all()
    return etapas

@router.get("/{etapa_id}/detalle", response_model=Etapa)
async def obtener(etapa_id: UUID, session: Session = Depends(get_session)):
    etapa = session.get(Etapa, etapa_id)
    if not etapa:
        raise HTTPException(status_code=404, detail="Etapa no encontrada")
    return etapa

@router.post("/{etapa_id}/completar", response_model=Etapa)
async def completar(etapa_id: UUID, session: Session = Depends(get_session)):
    etapa = session.get(Etapa, etapa_id)
    if not etapa:
        raise HTTPException(status_code=404, detail="Etapa no encontrada")
    etapa.estado = EstadoEtapa.COMPLETADA
    session.add(etapa)
    session.commit()
    session.refresh(etapa)
    return etapa
