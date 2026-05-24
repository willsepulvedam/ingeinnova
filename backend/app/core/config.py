from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuración de la aplicación."""
    
    APP_NAME: str = "Ingeinnova API"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"
    
    # Database settings - Pydantic mapeará automáticamente lo que encuentre en el .env
    POSTGRES_USER: str = "ingeinnova"
    POSTGRES_PASSWORD: str = "ingeinnova"
    POSTGRES_DB: str = "ingeinnova_db"
    POSTGRES_HOST: str = "db"
    POSTGRES_PORT: str = "5432"
    
    # Construye DATABASE_URL automáticamente desde las variables de entorno
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # CORS settings
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # Security settings
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Configuración actualizada a Pydantic v2
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"  
    )


settings = Settings()