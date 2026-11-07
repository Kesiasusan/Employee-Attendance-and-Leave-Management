
from fastapi import APIRouter, HTTPException
from sqlalchemy import select, or_, func
from app.database.connection import SessionLocal
from app.models.leave import Leave_Request
from app.schemas.leave_approval import Leave_Approval
from fastapi import Depends
from app.utils.auth import get_current_admin
from datetime import date
from app.models.user import User
from app.models.attendance import Attendance


router= APIRouter()

@router.put("/admin/leave/{id}")
def approved_leave(
    id: int,
    request: Leave_Approval,
    current_admin: dict = Depends(get_current_admin)
):
    db= SessionLocal()
    try:
        leave=db.scalar(
            select(Leave_Request).where(
                Leave_Request.id== id
            )
        )
        if not leave:
            raise HTTPException(
                status_code=404,
                detail="Leave request not found"
            )
        if leave.status!="Pending":
            raise HTTPException(
                status_code=409,
                detail="This leave rquest had already been processed"
            )
        leave.status=request.status
        leave.admin_comment= request.admin_comment
        db.commit()
        db.refresh(leave)
        return {
            "message": "Leave request updated successfully",
            "leave_id" :leave.id,
            "status" : leave.status,
            "admin_comment" :leave.admin_comment
        }
    finally:
        db.close()   
@router.get("/admin/dashboard")
def admin_dashboard(current_admin: dict= Depends(get_current_admin)):
    db = SessionLocal()
    try: 
        total_employees= db.scalar(
            select(func.count()).select_from(User).where(
                User.role == "employee"
            )
        )  
        
        present_today= db.scalar(
            select(func.count(func.distinct(Attendance.user_id))).where(
                Attendance.attendance_date == date.today()
            )
        )
        absent_today = total_employees - present_today

        pending_leaves = db.scalar(
            select(func.count()).select_from(Leave_Request).where(
                Leave_Request.status == "Pending"
            
            )
        )
        return {
            "total_employees": total_employees,
            "present_today": present_today,
            "absent_today": absent_today,
            "pending_leaves": pending_leaves
        }
    finally:
        db.close()
@router.get("/admin/employees")
def employee_list_search(
    search: str | None = None,
    current_admin: dict = Depends(get_current_admin)
):
    db =SessionLocal()
    try:
        
        query= select(User).where(
            User.role == "employee"
        )
        if search:
            query=query.where(
                or_(
                    User.name.ilike(f"%{search}%"),
                    User.email.ilike(f"%{search}%")     

                )
            )
        employees= db.scalars(query).all()
        return[
            {
                "id": employee.id,
                "name": employee.name,
                "email":employee.email,
                "role" : employee.role
            }
        for employee in employees]
    finally:
        db.close()


@router.get("/admin/employees/{user_id}/attendance")
def employee_attendance(
    user_id: int,
    current_admin: dict = Depends(get_current_admin)
):
    db = SessionLocal()
    try:
        employee = db.scalar(
            select(User).where(User.id == user_id)
        )

        if not employee or employee.role != "employee":
            raise HTTPException(
                status_code=404,
                detail="Employee not found"
            )

        query = (
            select(Attendance).where(Attendance.user_id == user_id)
            .order_by(Attendance.attendance_date.desc())
        )

        records = db.scalars(query).all()

        return [
            {
                "attendance_date": record.attendance_date,
                "check_in_time": record.check_in_time,
                "status": record.status
            }
            for record in records
        ]

    finally:
        db.close()

@router.get("/admin/leaves")
def admin_leave_list(
    current_admin: dict = Depends(get_current_admin)
):
    db = SessionLocal()
    try:
        query = (
            select(Leave_Request, User.name)
            .join(User, Leave_Request.user_id == User.id)
            .order_by(Leave_Request.start_date.desc())
        )

        records = db.execute(query).all()

        return [
            {
                "leave_id": record.Leave_Request.id,
                "employee_name": record.name,
                "leave_type": record.Leave_Request.leave_type,
                "start_date": record.Leave_Request.start_date,
                "end_date": record.Leave_Request.end_date,
                "reason": record.Leave_Request.reason,
                "status": record.Leave_Request.status,
                "admin_comment": record.Leave_Request.admin_comment
            }
            for record in records
        ]
    finally:
        db.close()

@router.get("/admin/attendance/today")
def admin_today_attendance(
    current_admin: dict = Depends(get_current_admin)
):
    db = SessionLocal()
    try:
        query = (
            select(Attendance, User.name)
            .join(User, Attendance.user_id == User.id)
            .where(Attendance.attendance_date == date.today())
            .order_by(Attendance.check_in_time)
        )

        records = db.execute(query).all()

        return [
            {
                "employee_name": record.name,
                "attendance_date": record.Attendance.attendance_date,
                "check_in_time": record.Attendance.check_in_time,
                "check_out_time": record.Attendance.check_out_time,
                "working_hours": record.Attendance.working_hours,
                "status": record.Attendance.status
            }
            for record in records
        ]
    finally:
        db.close()