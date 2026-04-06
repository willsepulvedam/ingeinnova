from typing import Optional
from uuid import UUID
from sqlmodel import Session, select
from backend.app.emprendimiento.model import Emprendimiento
from backend.app.emprendimiento.schema import EmprendimientoCreate, EmprendimientoUpdate
from backend.app.etapa.enums import EstadoEtapa
from backend.app.etapa.model import Etapa
from backend.app.ruta.model import Ruta

class EmpredimientoService:
    
    #TODO: Implementar métodos para crear, obtener, listar, actualizar y eliminar emprendimientos
    
    def crear(self, data: EmprendimientoCreate, session: Session) -> Emprendimiento: 
        nuevo_emprendimiento = Emprendimiento(
            nombre=data.nombre,
            descripcion=data.descripcion,
            propietario_id=data.propietario_id
        )
        session.add(nuevo_emprendimiento)
        session.flush()
        
        etapas = self._crear_etapas(self._crear_ruta(nuevo_emprendimiento.id, session).id, session)
        self._iniciar_primera_etapa(etapas, session)
        
        session.commit()
        session.refresh(nuevo_emprendimiento)
        return nuevo_emprendimiento
    
    def obtener(self, id: UUID, session: Session) -> Optional[Emprendimiento]: 
        emprendimiento = session.get(Emprendimiento, id)
        return emprendimiento

    def listar(self, session: Session) -> list[Emprendimiento]:
        return list(session.exec(select(Emprendimiento)).all())
    
    def actualizar(self, id: UUID, data: EmprendimientoUpdate, session: Session) -> Optional[Emprendimiento]:
        emprendimiento = self._validar_existe(id, session)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(emprendimiento, key, value)
        session.add(emprendimiento)
        session.commit()
        session.refresh(emprendimiento)
        return emprendimiento
    
    def eliminar(self, id: UUID, session: Session) -> bool:
        emprendimiento = session.get(Emprendimiento, id)
        if not emprendimiento:
            return False
        session.delete(emprendimiento)
        session.commit()
        return True
    
    
    #TODO: metodos _validar_existe, _crear_ruta, _crear_etapas, _iniciar_primera_etapa privados para manejar la lógica de negocio al crear un nuevo emprendimiento
    
    def _validar_existe(self, id: UUID, session: Session) -> Emprendimiento:
        emprendimiento = session.get(Emprendimiento, id)
        if not emprendimiento:
            raise ValueError("Emprendimiento no encontrado")
        return emprendimiento
    
    def _crear_ruta(self, emp_id: UUID, session: Session) -> Ruta:
        nueva_ruta = Ruta(emprendimiento_id=emp_id)
        session.add(nueva_ruta)
        session.flush()
        return nueva_ruta
    
    def _crear_etapas(self, ruta_id: UUID, session: Session) -> list[Etapa]:
        etapas = [
            Etapa(ruta_id=ruta_id, nombre="Exploración", orden=1, descripcion="Fase de exploración del mercado y validación de la idea"),
            Etapa(ruta_id=ruta_id, nombre="Ideacion", orden=2, descripcion="Fase de ideación y prototipo"),
            Etapa(ruta_id=ruta_id, nombre="Traccion", orden=3, descripcion="Fase de tracción y ventas"),
            Etapa(ruta_id=ruta_id, nombre="Único", orden=4, descripcion="Fase de consolidación y crecimiento del emprendimiento"),
        ]
        session.add_all(etapas)
        return etapas
    
    def _iniciar_primera_etapa(self, etapas: list[Etapa], session: Session):
        primera_etapa = min(etapas, key=lambda e: e.orden)
        primera_etapa.estado = EstadoEtapa.EN_PROGRESO
        session.add(primera_etapa)