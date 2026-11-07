from app.database.connection import Base
from sqlalchemy import Column, Integer, Date, Time, String, Float
from sqlalchemy import ForeignKey

class Attendance(Base):
    __tablename__ = "attendance"
    id=Column(Integer, primary_key = True)
    user_id=Column(Integer, ForeignKey("users.id"), nullable=False)
    attendance_date=Column(Date, nullable=False)
    check_in_time=Column(Time,nullable=False)
    check_out_time = Column(Time, nullable=True)
    working_hours = Column(Float, nullable=True)
    status= Column(String(20), nullable = False)