from typing import Optional
from uuid import UUID

from sqlmodel import Session, select

from backend.app.etapa.enums import EstadoEtapa
from backend.app.etapa.model import Etapa
from backend.app.ruta.model import Ruta


class RutaService:
    # TODO: metodos obtener, avanzar, obtener_progreso

    def obtener(self, emp_id: UUID, session: Session) -> Optional[Ruta]:
        ruta = session.exec(
            select(Ruta).where(Ruta.emprendimiento_id == emp_id)
        ).first()
        return ruta

    def avanzar_etapa(self, ruta_id: UUID, session: Session) -> Optional[Ruta]:
        ruta = session.get(Ruta, ruta_id)
        etapa_actual = session.exec(
            select(Etapa).where(
                Etapa.ruta_id == ruta_id, Etapa.estado == EstadoEtapa.EN_PROGRESO
            )
        ).first()
        if etapa_actual:
            self._validar_orden(etapa_actual, session)
            self._completar_etapa(etapa_actual, session)
            siguiente = self._obtener_siguiente(etapa_actual.orden, ruta_id, session)
            if siguiente:
                siguiente.estado = EstadoEtapa.EN_PROGRESO
                session.add(siguiente)
        session.commit()
        if ruta:
            session.refresh(ruta)
        return ruta

    def obtener_progreso(self, ruta_id: UUID, session: Session) -> dict:
        etapas = list(session.exec(select(Etapa).where(Etapa.ruta_id == ruta_id)).all())
        total_etapas = len(etapas)
        etapas_completadas = sum(
            1 for e in etapas if e.estado == EstadoEtapa.COMPLETADA
        )
        progreso = (etapas_completadas / total_etapas) * 100 if total_etapas > 0 else 0
        return {
            "total_etapas": total_etapas,
            "etapas_completadas": etapas_completadas,
            "progreso": progreso,
        }

    # TODO: metodos privados _validar_orden, _completar_etapa, _obtener_siguiente

    def _validar_orden(self, etapa: Etapa, session: Session) -> None:
        if etapa.estado != EstadoEtapa.EN_PROGRESO:
            raise ValueError("La etapa no está en progreso")
        
        etapas_anteriores = session.exec(
            select(Etapa).where(
                Etapa.ruta_id == etapa.ruta_id, Etapa.orden < etapa.orden
            )
        ).all()
        
        if not all(e.estado == EstadoEtapa.COMPLETADA for e in etapas_anteriores):
            raise ValueError("No se pueden avanzar etapas anteriores no completadas")

    def _completar_etapa(self, etapa: Etapa, session: Session) -> None:
        etapa.estado = EstadoEtapa.COMPLETADA
        session.add(etapa)

    def _obtener_siguiente(
        self, orden: int, ruta_id: UUID, session: Session
    ) -> Optional[Etapa]:
        siguiente_etapa = session.exec(
            select(Etapa).where(Etapa.ruta_id == ruta_id, Etapa.orden == orden + 1)
        ).first()
        return siguiente_etapa
