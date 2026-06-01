from pydantic import BaseModel, EmailStr
from typing import Literal
from ..models.user import User

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: Literal["recruiter", "employee"]

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(User):
    pass

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

