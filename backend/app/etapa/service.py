from typing import Optional
from uuid import UUID
from datetime import datetime

from sqlmodel import Session, select

from backend.app.etapa.enums import EstadoEtapa
from backend.app.etapa.model import Etapa


class EtapaService:
    
    #TODO; metodos obtener_por_ruta, obtener, completar 
    
    def obtener_por_ruta(self, ruta_id: UUID, session: Session) -> list[Etapa]:
        etapas = list(session.exec(select(Etapa).where(Etapa.ruta_id == ruta_id)).all())
        return etapas
    
    def obtener(self, id: UUID, session: Session) -> Optional[Etapa]:
        etapa = session.get(Etapa, id)
        return etapa
    
    def completar(self, id: UUID, session: Session) -> Optional[Etapa]:
        etapa = session.get(Etapa, id)
        if not etapa:
            raise ValueError("Etapa no encontrada")
        self._validar_en_progreso(etapa)
        self._set_fecha_completada(etapa)
        etapa.estado = EstadoEtapa.COMPLETADA
        session.add(etapa)
        session.commit()
        session.refresh(etapa)
        return etapa
    
    
    #TODO: metodo privados _validar_en_progreso, _set_fecha_completada
    
    def _validar_en_progreso(self, etapa: Etapa) -> None:
        if etapa.estado != EstadoEtapa.EN_PROGRESO:
            raise ValueError("La etapa no está en progreso")
        
    def _set_fecha_completada(self, etapa: Etapa) -> None:
        etapa.fecha_completada = datetime.now()
        