from fastapi import APIRouter, HTTPException
from sqlalchemy import select
from datetime import date, datetime,time
from app.database.connection import SessionLocal
from app.models.attendance import Attendance
from fastapi import Depends
from app.utils.auth import get_current_user

router=APIRouter()

@router.post("/check-in")
def check_in(current_user: dict = Depends(get_current_user)):
    db=SessionLocal()
    user_id = int(current_user["sub"])
    today=date.today()
    current_time= datetime.now().time()
    existing_attendance = db.scalar(
    select(Attendance).where(
        Attendance.user_id == user_id,
        Attendance.attendance_date == today
    )
    )
    if existing_attendance:
        db.close()
        raise HTTPException(
        status_code=409,
        detail="Attendance already marked today"
        )
    cutoff_time = time(9, 30)

    if current_time <= cutoff_time:
        status = "Present"
    else:
        status = "Late"
    
    new_attendance= Attendance(
        user_id =user_id,
        attendance_date=today,
        check_in_time=current_time,
        status=status
    )
    db.add(new_attendance)
    db.commit()
    db.close()
    return {
        "message": "Attendance marked successfully",
        "status": status
    }

@router.post("/check-out")
def check_out(current_user: dict = Depends(get_current_user)):
    db = SessionLocal()

    user_id = int(current_user["sub"])
    today = date.today()
    current_datetime = datetime.now()
    current_time = current_datetime.time()

    # Find today's attendance record
    existing_attendance = db.scalar(
        select(Attendance).where(
            Attendance.user_id == user_id,
            Attendance.attendance_date == today
        )
    )

    
    if not existing_attendance:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Check-in record not found"
        )

    if existing_attendance.check_out_time:
        db.close()
        raise HTTPException(
            status_code=409,
            detail="Already checked out today"
        )

    check_in_datetime = datetime.combine(
        existing_attendance.attendance_date,
        existing_attendance.check_in_time
    )

    time_difference = current_datetime - check_in_datetime

    working_hours = round(
        time_difference.total_seconds() / 3600,
        2
    )
    existing_attendance.check_out_time = current_time
    existing_attendance.working_hours = working_hours

    db.commit()
    db.close()

    return {
        "message": "Check-out successful",
        "check_out_time": current_time.strftime("%H:%M:%S"),
        "working_hours": working_hours
    }

@router.get("/history")
def attendance_history(current_user: dict = Depends(get_current_user)):
    db = SessionLocal()
    user_id = int(current_user["sub"])

    query = select(Attendance).where(
        Attendance.user_id == user_id
    ).order_by(Attendance.attendance_date.desc())

    records = db.scalars(query).all()

    db.close()

    return [{
        "attendance_date": record.attendance_date,
        "check_in_time": record.check_in_time,
        "check_out_time": record.check_out_time,
        "working_hours": record.working_hours,
        "status": record.status
    }
    for record in records
    ]