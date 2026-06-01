from pydantic import BaseModel, Field
from typing import Literal
from bson import ObjectId

class User(BaseModel):
    id: str = Field(default_factory=str, alias="_id")
    full_name: str
    email: str
    hashed_password: str
    role: Literal["recruiter", "employee"]
    is_active: bool = True

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

