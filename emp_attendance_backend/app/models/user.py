from app.database.connection import Base
from sqlalchemy import Column, Integer, String, DateTime, func
class User(Base):
    __tablename__ ="users"
    id= Column(Integer, primary_key=True)
    name=Column(String(50), nullable=False)
    email=Column(String(50), unique= True, nullable=False)
    password=Column(String(255),nullable=False)
    role= Column(String(50), nullable=False, default ='employee')
    created_at=Column(DateTime, server_default=func.now())