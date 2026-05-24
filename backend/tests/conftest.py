import os
import uuid
from datetime import date, datetime  # noqa: F401
from typing import Generator

import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event, text # noqa: F401
from sqlalchemy.engine import Engine
from sqlmodel import Session, SQLModel

from backend.app.core.database import get_db
from backend.app.main import app

# Load environment variables
load_dotenv()


def _create_test_database() -> tuple[str, Engine]:
    """
    Creates a temporary test database with a unique name to avoid conflicts.
    Returns the database URL and engine.
    """
    # Get base database URL from environment
    base_db_url = os.getenv("DATABASE_URL", "postgresql+psycopg://ingeinnova:ingeinnova@db:5432/ingeinnova")
    
    # Parse the base URL to extract connection details
    # Expected format: postgresql+psycopg://user:password@host:port/database
    if "@" not in base_db_url:
        raise ValueError(f"Invalid DATABASE_URL format: {base_db_url}")
    
    # Extract the protocol part
    protocol = base_db_url.split("://")[0] + "://"
    rest = base_db_url.split("://", 1)[1]
    
    # Split credentials from host/database
    creds, host_and_db = rest.split("@", 1)
    
    # Split host from database name
    host_part = host_and_db.split("/", 1)[0]
    base_db_name = host_and_db.split("/", 1)[1]
    
    # Generate unique test database name
    test_db_name = f"test_{base_db_name}_{uuid.uuid4().hex[:8]}"
    
    # Create URL for connecting to postgres database (to create new database)
    # Use 'postgres' as the default database for maintenance connection
    postgres_url = f"{protocol}{creds}@{host_part}/postgres"
    
    # Create engine to connect to postgres (maintenance database)
    postgres_engine = create_engine(postgres_url, echo=False)
    
    try:
        # Create test database
        with postgres_engine.connect() as conn:
            conn.execution_options(isolation_level="AUTOCOMMIT").execute(
                text(f"CREATE DATABASE {test_db_name}")
            )
    except Exception as e:
        postgres_engine.dispose()
        # If the host is 'db' (Docker container name), try with localhost as fallback
        if host_part.startswith("db"):
            print(f"\nWarning: Could not connect to PostgreSQL at '{host_part}'.")
            print("This usually happens when running tests outside Docker.")
            print("Please ensure PostgreSQL is running locally or use Docker Compose.\n")
        raise RuntimeError(
            f"Failed to create test database. Make sure PostgreSQL is running and accessible. "
            f"Connection URL: {postgres_url}. Error: {str(e)}"
        ) from e
    
    postgres_engine.dispose()
    
    # Create test database URL
    test_db_url = f"{protocol}{creds}@{host_part}/{test_db_name}"
    
    # Create engine for test database
    test_engine = create_engine(test_db_url, echo=False)
    
    return test_db_url, test_engine


def _drop_test_database(db_url: str) -> None:
    """
    Drops the test database.
    """
    if not db_url:
        return
    
    # Extract database name from URL
    db_name = db_url.rsplit("/", 1)[1]
    postgres_url = db_url.rsplit("/", 1)[0] + "/postgres"
    
    # Connect to postgres and drop the database
    postgres_engine = create_engine(postgres_url, echo=False)
    with postgres_engine.connect() as conn:
        conn.execution_options(isolation_level="AUTOCOMMIT").execute(
            text(f"DROP DATABASE IF EXISTS {db_name}")
        )
    postgres_engine.dispose()


@pytest.fixture(scope="session")
def test_engine() -> Generator[Engine, None, None]:
    """
    Creates a test engine with a temporary PostgreSQL database.
    The database is created at the start of the test session and dropped at the end.
    """
    # Import all models to ensure they are registered with SQLModel.metadata
    from backend.app.etapa.models.model import Etapa # noqa: F401
    from backend.app.postulacion.models.detalles_emprendimiento import Tabla_DetallesEmprendimiento # noqa: F401
    from backend.app.postulacion.models.emprendedor import Tabla_Emprendedor # noqa: F401
    from backend.app.postulacion.models.emprendimiento import Tabla_Emprendimiento # noqa: F401
    from backend.app.ruta.models.model import Ruta # noqa: F401
    
    # Create temporary test database
    test_db_url, engine = _create_test_database()
    
    try:
        # Create all tables
        SQLModel.metadata.create_all(engine)
        
        yield engine
    finally:
        # Cleanup: drop the test database
        engine.dispose()
        _drop_test_database(test_db_url)


@pytest.fixture
def db_session(test_engine: Engine) -> Generator[Session, None, None]:
    """
    Creates a database session for testing.
    Uses a transaction that is rolled back after each test to ensure test isolation.
    """
    connection = test_engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    
    yield session
    
    # Cleanup: rollback transaction and close connection
    session.close()
    if transaction.is_active:
        transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """
    Creates a test client with overridden database dependency.
    """
    def override_get_db() -> Generator[Session, None, None]:
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_etapa_data():
    return {
        "nombre": "Inscripción",
        "descripcion": "Fase de inscripción de emprendimientos",
        "fecha_inicio": "2026-01-01",
        "fecha_fin": "2026-01-31",
        "estado": "En Progreso",  # EstadoEtapaEnum.EN_PROGRESO
    }


@pytest.fixture
def sample_ruta_data():
    return {
        "entrega": "Formulario de inscripción completado",
        "descripcion": "Completar el formulario con todos los datos requeridos",
    }


@pytest.fixture
def sample_emprendimiento_data():
    return {
        "nom_proyecto": "Tech Solutions",
        "descripcion": "Soluciones tecnológicas innovadoras",
        "sector": "Tecnología / Software",  # SectorEmprendimiento.TECNOLOGIA
        "estado_madurez": "En marcha",  # EstadoEmprendimiento.EN_MARCHA
        "tipo_cliente_aspirado": "B2B - Empresas / Corporativos",  # TipoClienteEmprendimiento.B2B
    }


@pytest.fixture
def sample_emprendedor_data():
    return {
        "nom_completo": "Juan Pérez",
        "email": "juan.perez@unicolombo.edu.co",
        "telefono": "3001234567",
        "cedula": "123456789",
        "categoria": "Estudiante",  # CategoriaEmprendedor.ESTUDIANTE
        "sexo": "Masculino",  # GeneroEmprendedor.MASCULINO
        "edad": 25,
        "barrio": "Centro",
        "localidad": "1 Localidad Histórica y del Caribe Norte",  # LocalidadEmprendedor.LOCALIDAD_1
        "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36X",
        "inf_academica": {
            "programa": "Ingeniería de Sistemas",  # ProgramaAcademicoEmprendedor.SISTEMAS
            "semestre": "8",  # SemestreAcademicoEmprendedor.SEM_8
            "jornada": "Diurna",  # JordanAcademicaEmprendedor.DIURNA
        },
        "tipo_vinculo": "Estudiante",  # TipoVinculoEmprendedor.ESTUDIANTE
        "es_emprendedor": True,
    }


@pytest.fixture
def sample_detalles_emprendimiento_data():
    return {
        "tiempo_existente": "Menos de 1 año",  # TiempoEmprendimiento.MENOS_1_ANO
        "tipo_negocio": "Plataforma digital / Tecnológico",  # TipoEspecificoNegocio.TECNOLOGICO
        "estado_rut": "No tiene",  # EstadoRut.NO_TIENE
        "descripcion_actividad": "Desarrollo de software a medida",
    }
