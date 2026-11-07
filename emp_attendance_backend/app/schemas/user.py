from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    from pydantic import Field
    name:str 
    email: EmailStr
    password: str = Field(min_length=8)