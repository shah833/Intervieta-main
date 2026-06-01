from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
database = client[settings.DATABASE_NAME]

async def get_db():
    yield database