import uuid
from sqlmodel import Session, select
from backend.app.etapa.models.model import Etapa
from backend.app.etapa.schemas import EtapaCreate, EtapaUpdate


class EtapaRepository:
    def create(self, db: Session, obj_in: EtapaCreate) -> Etapa:
        db_obj = Etapa(
            nombre=obj_in.nombre,
            descripcion=obj_in.descripcion,
            estado=obj_in.estado,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_id(self, db: Session, id: uuid.UUID) -> Etapa | None:
        statement = select(Etapa).where(Etapa.id == id)
        return db.exec(statement).first()

    def get_all(self, db: Session) -> list[Etapa]:
        statement = select(Etapa)
        return list(db.exec(statement).all())

    def update(self, db: Session, db_obj: Etapa, obj_in: EtapaUpdate) -> Etapa:
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