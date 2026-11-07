from app.database.connection import SessionLocal
from app.models import User, Attendance
from app.database.connection import Base, engine
from datetime import date , time
Base.metadata.create_all(bind=engine)
print(Base.metadata.tables.keys())
session= SessionLocal()
print("The session was created")

att1= Attendance(
    user_id=1,
    attendance_date=date(2026,11,2),
    check_in_time=time(9,0),
    status="Present"
)

att2= Attendance(
    user_id=2,
    attendance_date=date(2026,11,2),
    check_in_time=time(9,30),
    status="Late"
)

att3= Attendance(
    user_id=3,
    attendance_date=date(2026,11,2),
    check_in_time=time(8,55),
    status="Present"
)
session.add_all([att1,att2,att3])
session.commit()
session.close()
