import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Assistente Solara API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # POSTGRES
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "solara_db"
    SQLALCHEMY_DATABASE_URL: Optional[str] = None

    # REDIS
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # SECURITY
    SECRET_KEY: str = "SECRET_KEY_ALTAMENTE_SEGURA_AQUI_DEVE_SER_ENV"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 dias

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

    def get_database_url(self):
        if self.SQLALCHEMY_DATABASE_URL:
            return self.SQLALCHEMY_DATABASE_URL
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"

settings = Settings()
