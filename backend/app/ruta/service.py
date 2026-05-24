import uuid
from sqlmodel import Session

from backend.app.ruta.repository import RutaRepository
from backend.app.ruta.schemas import RutaCreate, RutaUpdate, RutaOut
from backend.app.etapa.service import EtapaService  # type: ignore
from backend.app.ruta.exceptions.ruta_not_found import RutaNotFoundError


class RutaService:
    def __init__(self, repository: RutaRepository, etapa_service: EtapaService) -> None:
        self.repository = repository
        self.etapa_service = etapa_service

    def crear_ruta_en_etapa(
        self, db: Session, etapa_id: uuid.UUID, ruta_in: RutaCreate
    ) -> RutaOut:
        db_obj = self.repository.create(db=db, obj_in=ruta_in, etapa_id=etapa_id)
        return RutaOut.model_validate(db_obj)

    def obtener_ruta(self, db: Session, id: uuid.UUID) -> RutaOut:
        db_ruta = self.repository.get_by_id(db=db, id=id)
        if not db_ruta:
            raise RutaNotFoundError()
        return RutaOut.model_validate(db_ruta)

    def listar_rutas_por_etapa(self, db: Session, etapa_id: uuid.UUID) -> list[RutaOut]:
        lista_db = self.repository.get_by_etapa_id(db=db, etapa_id=etapa_id)
        return [RutaOut.model_validate(item) for item in lista_db]

    def actualizar_ruta(
        self, db: Session, id: uuid.UUID, cambio_in: RutaUpdate
    ) -> RutaOut:
        db_ruta = self.repository.get_by_id(db=db, id=id)
        if not db_ruta:
            raise RutaNotFoundError(
                message="No se puede actualizar. La Ruta solicitada no existe."
            )
        db_actualizado = self.repository.update(db=db, db_obj=db_ruta, obj_in=cambio_in)
        return RutaOut.model_validate(db_actualizado)

    def eliminar_ruta(self, db: Session, id: uuid.UUID) -> None:
        exito = self.repository.delete(db=db, id=id)
        if not exito:
            raise RutaNotFoundError(
                message="No se pudo eliminar. La Ruta solicitada no existe."
            )
        return None
