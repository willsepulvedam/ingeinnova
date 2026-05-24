from typing import TYPE_CHECKING, Optional


from backend.app.ruta.schemas.base import RutaBase
import uuid
from sqlmodel import Field, Relationship

if TYPE_CHECKING:
    from backend.app.etapa.models.model import Etapa


class Ruta(RutaBase, table=True):
    __tablename__ = "rutas"  # type: ignore

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
        description="ID único de la ruta",
    )

    entrega: str = Field(
        nullable=False,
        max_length=2000,
        description="Descripción de la entrega o resultado esperado al completar esta ruta",
    )

    etapa_id: uuid.UUID = Field(
        foreign_key="etapas.id",
        nullable=False,
        ondelete="CASCADE",
        description="ID de la etapa a la que pertenece esta ruta",
    )

    etapa: Optional["Etapa"] = Relationship(back_populates="rutas")
