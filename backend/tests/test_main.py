"""
Tests para el archivo main.py y endpoints generales de la API.
"""
import pytest  # noqa: F401
from fastapi.testclient import TestClient


class TestHealthEndpoints:
    """Tests para los endpoints de salud y estado de la API."""
    
    def test_root_endpoint(self, client: TestClient):
        """Test para el endpoint raíz (/)."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "API de Ingeinnova funcionando correctamente" in data["message"]
        assert "data" in data
        assert data["data"]["status"] == "active"
        assert data["data"]["version"] == "1.0.0"
    
    def test_health_check_endpoint(self, client: TestClient):
        """Test para el endpoint de health check (/health)."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["message"] == "Servicio saludable"
        assert data["data"]["status"] == "healthy"
    
    def test_api_documentation(self, client: TestClient):
        """Test para verificar que la documentación de la API esté disponible."""
        response = client.get("/docs")
        assert response.status_code == 200
        assert "Ingeinnova API - Sistema de Emprendimiento Universitario" in response.text
    
    def test_openapi_schema(self, client: TestClient):
        """Test para verificar que el esquema OpenAPI esté disponible."""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        data = response.json()
        assert data["info"]["title"] == "Ingeinnova API - Sistema de Emprendimiento Universitario"
        assert data["info"]["version"] == "1.0.0"
        assert "description" in data["info"]
    
    def test_api_version_in_paths(self, client: TestClient):
        """Test para verificar que los endpoints usen el prefijo /api/v1."""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        paths = response.json()["paths"]
        
        # Verificar que los paths principales tengan el prefijo /api/v1
        api_paths = [path for path in paths.keys() if path.startswith("/api/v1")]
        assert len(api_paths) > 0
        
        # Verificar que existan los routers principales
        assert any("/postulaciones" in path for path in api_paths)
        assert any("/etapas" in path for path in api_paths)
        assert any("/rutas" in path for path in api_paths)