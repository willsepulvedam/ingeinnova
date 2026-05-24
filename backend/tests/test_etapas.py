"""
Tests para el módulo de Etapas.
"""

import pytest  # noqa: F401
from fastapi.testclient import TestClient
from sqlmodel import Session
import uuid

from backend.app.etapa.models.model import Etapa


class TestEtapasEndpoints:
    """Tests para los endpoints de etapas."""

    def test_crear_etapa(self, client: TestClient, sample_etapa_data):
        """Test para crear una nueva etapa."""
        response = client.post("/api/v1/etapas", json=sample_etapa_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_listar_etapas(self, client: TestClient, sample_etapa_data):
        """Test para listar todas las etapas."""
        client.post("/api/v1/etapas", json=sample_etapa_data)

        response = client.get("/api/v1/etapas")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)

    def test_obtener_etapa_por_id(
        self, client: TestClient, sample_etapa_data, db_session: Session
    ):
        """Test para obtener una etapa por su ID."""
        etapa = Etapa(**sample_etapa_data)
        db_session.add(etapa)
        db_session.commit()
        db_session.refresh(etapa)

        response = client.get(f"/api/v1/etapas/{etapa.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_obtener_etapa_no_existente(self, client: TestClient):
        """Test para obtener una etapa que no existe."""
        fake_id = uuid.uuid4()
        response = client.get(f"/api/v1/etapas/{fake_id}")
        assert response.status_code == 404

    def test_actualizar_etapa(
        self, client: TestClient, sample_etapa_data, db_session: Session
    ):
        """Test para actualizar una etapa."""
        etapa = Etapa(**sample_etapa_data)
        db_session.add(etapa)
        db_session.commit()
        db_session.refresh(etapa)

        update_data = {
            "nombre": "Etapas Actualizada",
            "descripcion": "Nueva descripción",
        }
        response = client.put(f"/api/v1/etapas/{etapa.id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_eliminar_etapa(
        self, client: TestClient, sample_etapa_data, db_session: Session
    ):
        """Test para eliminar una etapa."""
        etapa = Etapa(**sample_etapa_data)
        db_session.add(etapa)
        db_session.commit()
        db_session.refresh(etapa)

        response = client.delete(f"/api/v1/etapas/{etapa.id}")
        assert response.status_code == 200

        get_response = client.get(f"/api/v1/etapas/{etapa.id}")
        assert get_response.status_code == 404

    def test_actualizar_etapa_no_existente(self, client: TestClient):
        """Test para actualizar una etapa que no existe."""
        fake_id = uuid.uuid4()
        update_data = {"nombre": "Test"}
        response = client.put(f"/api/v1/etapas/{fake_id}", json=update_data)
        assert response.status_code == 404

    def test_eliminar_etapa_no_existente(self, client: TestClient):
        """Test para eliminar una etapa que no existe."""
        fake_id = uuid.uuid4()
        response = client.delete(f"/api/v1/etapas/{fake_id}")
        assert response.status_code == 404


class TestEtapasModel:
    """Tests para el modelo Etapa."""

    def test_etapa_creation(self, sample_etapa_data):
        """Test para verificar la creación de una etapa."""
        etapa = Etapa(**sample_etapa_data)
        assert isinstance(etapa.id, uuid.UUID)

    def test_etapa_tablename(self):
        """Test para verificar el nombre de la tabla."""
        assert Etapa.__tablename__ == "etapas"  # type: ignore

    def test_etapa_relationships(self, sample_etapa_data):
        """Test para verificar las relaciones del modelo."""
        etapa = Etapa(**sample_etapa_data)
        assert hasattr(etapa, "rutas")
