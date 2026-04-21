from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from pathlib import Path

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "Phishing URL Detector"
    DEBUG: bool = True
    
    # MySQL Database Settings
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = ""
    MYSQL_DATABASE: str = "phishing_db"

    @property
    def DATABASE_URL(self) -> str:
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent.parent / ".env",
        env_file_encoding='utf-8',
        extra='ignore'
    )

settings = Settings()
