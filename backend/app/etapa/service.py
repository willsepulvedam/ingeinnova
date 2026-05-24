import uuid
from sqlmodel import Session

from backend.app.etapa.repository import EtapaRepository
from backend.app.etapa.schemas import EtapaCreate, EtapaUpdate, EtapaOut, EtapaDetail
from backend.app.etapa.exceptions.etapa_not_found_error import EtapaNotFoundError


class EtapaService:
    def __init__(self, repository: EtapaRepository) -> None:
        self.repository = repository

    def crear_etapa(self, db: Session, etapa_in: EtapaCreate) -> EtapaOut:
        db_obj = self.repository.create(db=db, obj_in=etapa_in)
        return EtapaOut.model_validate(db_obj)

    def obtener_etapa_con_rutas(self, db: Session, id: uuid.UUID) -> EtapaDetail:
        db_etapa = self.repository.get_by_id(db=db, id=id)
        if not db_etapa:
            raise EtapaNotFoundError()
        return EtapaDetail.model_validate(db_etapa)

    def listar_etapas(self, db: Session) -> list[EtapaOut]:
        lista_db = self.repository.get_all(db=db)
        return [EtapaOut.model_validate(item) for item in lista_db]

    def actualizar_etapa(self, db: Session, id: uuid.UUID, cambio_in: EtapaUpdate) -> EtapaOut:
        db_etapa = self.repository.get_by_id(db=db, id=id)
        if not db_etapa:
            raise EtapaNotFoundError(
                message="No se puede actualizar. La Etapa solicitada no existe."
            )
        db_actualizado = self.repository.update(db=db, db_obj=db_etapa, obj_in=cambio_in)
        return EtapaOut.model_validate(db_actualizado)

    def eliminar_etapa(self, db: Session, id: uuid.UUID) -> None:
        exito = self.repository.delete(db=db, id=id)
        if not exito:
            raise EtapaNotFoundError(
                message="No se pudo eliminar. La Etapa solicitada no existe."
            )
        return None