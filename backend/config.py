from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Gemini
    GEMINI_API_KEY: str

    # MongoDB
    MONGO_URI: str
    DB_NAME: str = "internship_detector"

    # JWT Auth
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # App
    APP_NAME: str = "Fake Internship Detector"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    return Settings()










