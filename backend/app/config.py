from pydantic_settings import BaseSettings
from typing import Literal

class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "intervieta"
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: Literal["HS256"] = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CLERK_SECRET_KEY: str = "sk_test_XRY2jaJLpuD2QuISfPahMfhdjy6ycq1DRRJkrG5iaS"
    CLERK_JWKS_URL: str = "https://pleasant-pony-56.clerk.accounts.dev/.well-known/jwks.json"
    N8N_WEBHOOK_URL : str = "http://localhost:5678/webhook/generate_interview_questions"
    IMAGEKIT_PRIVATE_KEY: str="private_1Wjshnr+a2Ibhv0267jJVK19HZ0="
    IMAGEKIT_URL_ENDPOINT: str="https://ik.imagekit.io/gmmgjvmkvh"
    ARCJET_KEY: str="ajkey_01kwk8rnz4e1ar0c1c0kmamebb"
    TAVUS_API_KEY: str = "13ec6a87cfe474f138ce5fb57d9fc28a3"
    TAVUS_PERSONA_ID: str = "p674bbaed214"
    TAVUS_REPLICA_ID: str = "r3f4182ef554"
    TAVUS_AVATAR_NAME: str = "Julian"
    class Config:
        env_file = ".env"

settings = Settings()