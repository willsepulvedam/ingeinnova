from typing import TYPE_CHECKING
import uuid

from sqlmodel import Field, Relationship

from backend.app.etapa.schemas.base import EtapaBase

if TYPE_CHECKING:
    from backend.app.ruta.models.model import Ruta  # type: ignore


class Etapa(EtapaBase, table=True):
    __tablename__ = "etapas"  # type: ignore

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
        description="ID único de la etapa",
    )

    rutas: list["Ruta"] = Relationship(
        back_populates="etapa",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
