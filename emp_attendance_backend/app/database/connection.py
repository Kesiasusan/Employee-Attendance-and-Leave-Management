import os
from sqlalchemy.engine import URL
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv
load_dotenv()
host= os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
name=os.getenv("DB_NAME")
username= os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
database_url= URL.create(
    drivername = "postgresql+psycopg2",
    username   = username,
    password   = password,
    host       = host,
    port       = int(port), 
    database   = name
)
engine= create_engine(database_url)
SessionLocal= sessionmaker(engine)
class Base(DeclarativeBase):
    pass

