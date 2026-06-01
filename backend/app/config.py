from pydantic_settings import BaseSettings
from typing import Literal

class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "intervieta"
    SECRET_KEY: str = "sk_test_XRY2jaJLpuD2QuISfPahMfhdjy6ycq1DRRJkrG5iaS"
    ALGORITHM: Literal["HS256"] = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CLERK_SECRET_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()