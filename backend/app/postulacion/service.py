import uuid

from sqlmodel import Session

from backend.app.postulacion.exceptions.emprendimiento_exception import EmpredimientoNotFoundError
from backend.app.postulacion.exceptions.postulacion_incompleted import (
    PostulacionIncompletedError,
)
from backend.app.postulacion.repository import EmprendimientoRepository
from backend.app.postulacion.schemas.emprendimiento.create import EmprendimientoCreate
from backend.app.postulacion.schemas.emprendimiento.out import EmprendimientoOut
from backend.app.postulacion.schemas.emprendimiento.update import EmprendimientoUpdate


class EmprendimientoService:
    def __init__(self, repository: EmprendimientoRepository) -> None:
        self.repository = repository

    def registrar_postulacion_completa(
        self, db: Session, payload: EmprendimientoCreate
    ) -> EmprendimientoOut:

        if not hasattr(payload, "emprendedor") or not hasattr(payload, "detalles"):
            raise PostulacionIncompletedError()

        db_emprendimiento = self.repository.create_postulacion_integral(
            db=db,
            emp_in=payload,
            empdor_in=payload.emprendedor,
            det_in=payload.detalles,
        )

        return EmprendimientoOut.model_validate(db_emprendimiento)
    
    def obtener_detalle_postulacion(self, db: Session, id: uuid.UUID) -> EmprendimientoOut: 
        db_emprendimiento = self.repository.get_complete_by_id(db=db, id=id)
        
        if not db_emprendimiento: 
            raise EmpredimientoNotFoundError()
        
        return EmprendimientoOut.model_validate(db_emprendimiento)
    
    def listar_resumen_postulaciones(self,db: Session, skip: int = 0, limit: int = 100) -> list[EmprendimientoOut]: 
        lista_db = self.repository.get_all_summary(db, skip=skip, limit=limit)
        return [EmprendimientoOut.model_validate(item) for item in lista_db]
    
    def actualizar_datos_postulacion(
        self, db: Session, id: uuid.UUID, payload: EmprendimientoUpdate
    ) -> EmprendimientoOut: 
        
        db_actualizado = self.repository.update_all_flow(
            db=db,
            id=id,
            emp_up=payload,
            empdor_up=payload.emprendedor if hasattr(payload, "emprendedor") else None
        )
        
        if not db_actualizado: 
            raise  EmpredimientoNotFoundError(
                message="No se puede actualizar. El emprendimiento / Postulación no existe"
            )
            
        return EmprendimientoOut.model_validate(db_actualizado)
    
    
    def dar_baja_postulacion(self, db: Session, id: uuid.UUID) -> None: 
        exito = self.repository.delete_full_postulacion(db, id=id)
        
        if not exito: 
            raise EmpredimientoNotFoundError(
                message="No se pudo eliminar. El emprendimiento / Postulacíon no existe"
            )
            return None