import os 
from collections.abc import Generator
from sqlmodel import SQLModel, Session, create_engine
import logging


logger = logging.getLogger("ingeinnova.database")
logging.basicConfig(level=logging.INFO)

DATABASE_URL = os.getenv("DATABASE_URL")


if not DATABASE_URL: 
    logger.critical("[CONFIG ERROR] La variable de entorno 'DATABASE_URL' no está definida. Verifica tu archivo .env o la configuración de Dcoker")
    
engine = create_engine(DATABASE_URL, echo=True) if DATABASE_URL else None

def init_db() -> None: 
    if not engine: 
        logger.error("[DB ERROR] No se pueden crear las tablas porque el motor (engine) no fue inicializado.")
        return
    
    try: 
        SQLModel.metadata.create_all(engine)
        logger.info("[DB SUCCESS] Todas las tablas se crearon o verificaron exitosamente en PostgreSQL")
    except Exception as e: 
        logger.exception(f"[DB EXCEPTION] Ocurrió un error inesperado al crear las tablas: {e}")
        
        
def get_db() -> Generator[Session, None, None]: 
    if not engine: 
        logger.error("[DB ERROR] Intento de apertura de sesión sin un motor configurado")
        return 
    
    with Session(engine) as session: 
        yield session
