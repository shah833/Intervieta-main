from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId
from app.database import database
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import get_password_hash

users_collection = database["users"]

async def get_user_by_email(email: str) -> User | None:
    user_data = await users_collection.find_one({"email": email})
    if user_data:
        user_data["_id"] = str(user_data["_id"])
        return User(**user_data)
    return None

async def create_user(user_create: UserCreate) -> User:
    existing_user = await get_user_by_email(user_create.email)
    if existing_user:
        raise ValueError("Email already registered")
    
    user_dict = user_create.model_dump(exclude={"password"})
    user_dict["hashed_password"] = get_password_hash(user_create.password)
    user_dict["_id"] = str(ObjectId())
    
    await users_collection.insert_one(user_dict)
    return User(**user_dict)

