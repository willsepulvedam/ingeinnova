import uuid
from sqlmodel import Session, select
from backend.app.ruta.models.model import Ruta
from backend.app.ruta.schemas import RutaCreate, RutaUpdate


class RutaRepository:
    def create(self, db: Session, obj_in: RutaCreate, etapa_id: uuid.UUID) -> Ruta:

        db_obj = Ruta(
            entrega=obj_in.entrega,
            etapa_id=etapa_id,
            estado=obj_in.estado,
            fecha_inicio=obj_in.fecha_inicio,
            fecha_final=obj_in.fecha_final,
            tipo=obj_in.tipo,
            contenido=obj_in.contenido,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_id(self, db: Session, id: uuid.UUID) -> Ruta | None:

        statement = select(Ruta).where(Ruta.id == id)
        return db.exec(statement).first()

    def get_by_etapa_id(self, db: Session, etapa_id: uuid.UUID) -> list[Ruta]:
        statement = select(Ruta).where(Ruta.etapa_id == etapa_id)
        return list(db.exec(statement).all())

    def update(self, db: Session, db_obj: Ruta, obj_in: RutaUpdate) -> Ruta:

        update_data = obj_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_obj, key, value)

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: uuid.UUID) -> bool:

        db_obj = self.get_by_id(db=db, id=id)
        if not db_obj:
            return False

        db.delete(db_obj)
        db.commit()
        return True
