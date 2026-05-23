import uuid

from sqlmodel import Session, select

from backend.app.postulacion.models.detalles_emprendimiento import (
    Tabla_DetallesEmprendimiento,
)
from backend.app.postulacion.models.emprendedor import Tabla_Emprendedor
from backend.app.postulacion.models.emprendimiento import Tabla_Emprendimiento
from backend.app.postulacion.schemas.detalles_emprendimiento.create import (
    DetallesEmpCreate,
)
from backend.app.postulacion.schemas.emprendedor.create import EmprendedorCreate
from backend.app.postulacion.schemas.emprendedor.update import EmprendedorUpdate
from backend.app.postulacion.schemas.emprendimiento.create import EmprendimientoCreate
from backend.app.postulacion.schemas.emprendimiento.update import EmprendimientoUpdate


class EmprendimientoRepository:
    def create_postulacion_integral(
        self,
        db: Session,
        emp_in: EmprendimientoCreate,
        empdor_in: EmprendedorCreate,
        det_in: DetallesEmpCreate,
    ) -> Tabla_Emprendimiento:

        try:
            db_emprendimiento = Tabla_Emprendimiento(**emp_in.model_dump())
            db.add(db_emprendimiento)
            db.flush()

            datos_emprendedor = empdor_in.model_dump()
            db_emprendedor = Tabla_Emprendedor(
                **datos_emprendedor,
                emprendimiento_id=db_emprendimiento.emprendimiento_id,
            )
            db.add(db_emprendedor)

            datos_detalles = det_in.model_dump()
            db_detalles = Tabla_DetallesEmprendimiento(
                **datos_detalles, emprendimiento_id=db_emprendimiento.emprendimiento_id
            )
            db.add(db_detalles)
            db.flush()

            db_emprendimiento.detalles_id = db_detalles.emprendimiento_id
            db.add(db_emprendimiento)

            db.commit()
            db.refresh(db_emprendimiento)
            return db_emprendimiento
        except Exception as e:
            db.rollback()
            raise e

    def get_complete_by_id(
        self, id: uuid.UUID, db: Session
    ) -> Tabla_Emprendimiento | None:
        statement = select(Tabla_Emprendimiento).where(
            Tabla_Emprendimiento.emprendimiento_id == id
        )
        return db.exec(statement).first()

    def get_all_summary(
        self, db: Session, skip: int = 0, limit: int = 100
    ) -> list[Tabla_Emprendimiento]:
        statement = select(Tabla_Emprendimiento).offset(skip).limit(limit)
        return list(db.exec(statement).all())

    def update_all_flow(
        self,
        db: Session,
        id: uuid.UUID,
        emp_up: EmprendimientoUpdate,
        empdor_up: EmprendedorUpdate | None = None,
    ) -> Tabla_Emprendimiento | None:

        try:
            statement = select(Tabla_Emprendimiento).where(
                Tabla_Emprendimiento.emprendimiento_id == id
            )
            db_emprendimiento = db.exec(statement=statement).first()

            if not db_emprendimiento:
                return None

            datos_emp = emp_up.model_dump(exclude_unset=True)
            db_emprendimiento.sqlmodel_update(datos_emp)
            db.add(db_emprendimiento)

            if empdor_up is not None:
                statement_empdor = select(Tabla_Emprendedor).where(
                    Tabla_Emprendedor.emprendimiento_id == id
                )
                db_emprendedor = db.exec(statement_empdor).first()

                if not db_emprendedor:
                    db.rollback()
                    return None

                datos_empdor = empdor_up.model_dump(exclude_unset=True)
                db_emprendedor.sqlmodel_update(datos_empdor)
                db.add(db_emprendedor)

            db.commit()
            db.refresh(db_emprendimiento)
            return db_emprendimiento

        except Exception as e:
            db.rollback()
            raise e

    def delete_full_postulacion(self, db: Session, id: uuid.UUID) -> bool:
        try:
            statement = select(Tabla_Emprendimiento).where(
                Tabla_Emprendimiento.emprendimiento_id == id
            )
            db_emprendimiento = db.exec(statement=statement).first()

            if not db_emprendimiento:
                return False

            statement_empdor = select(Tabla_Emprendedor).where(
                Tabla_Emprendedor.emprendimiento_id == id
            )
            db_emprendedor = db.exec(statement=statement_empdor).first()
            if db_emprendedor:
                db.delete(db_emprendedor)

            statement_detalles = select(Tabla_DetallesEmprendimiento).where(
                Tabla_DetallesEmprendimiento.emprendimiento_id == id
            )
            db_detalles = db.exec(statement=statement_detalles).first()
            if db_detalles:
                db.delete(db_detalles)

            db.delete(db_emprendimiento)

            db.commit()
            return True
        except Exception as e:
            db.rollback()
            raise e
