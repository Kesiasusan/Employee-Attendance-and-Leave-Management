from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from app.database.connection import SessionLocal
from app.models.leave import Leave_Request
from app.models.user import User
from app.schemas.leave import Leave_Create
from app.utils.auth import get_current_user

router=APIRouter()

@router.post("/request")
def submit_leave(
    request: Leave_Create,
    current_user:dict=Depends(get_current_user)):
    user_id = int(current_user["sub"])
    
    db=SessionLocal()
    try:
        user = db.scalar(
        select(User).where(User.id == user_id)
        )   
        if not user:
            raise HTTPException(
                status_code=404,
                detail="Employee not found"
            )
        if request.end_date < request.start_date:
            raise HTTPException(
                status_code=400,
                detail="Invalid leave dates"
            )
        new_leave = Leave_Request(
            user_id=user_id,
            leave_type=request.leave_type,
            start_date=request.start_date,
            end_date=request.end_date,
            reason= request.reason
        )
        db.add(new_leave)
        db.commit()
        db.refresh(new_leave)
        return {
            "message": "Leave request submitted successfully",
            "leave_id" : new_leave.id,
            "status" : new_leave.status
        }
    finally:
        db.close()
@router.get("/history")
def leave_history(
    current_user: dict = Depends(get_current_user)
):
    
    db = SessionLocal()
    try:
        user_id = int(current_user["sub"])
        query = select(Leave_Request).where(
            Leave_Request.user_id == user_id
        ).order_by(Leave_Request.start_date.desc())

        records = db.scalars(query).all()
        return [{
                "leave_id": record.id,
                "leave_type": record.leave_type,
                "start_date": record.start_date,
                "end_date": record.end_date,
                "reason": record.reason,
                "status": record.status,
                "admin_comment": record.admin_comment
            }
            for record in records
        ]
    finally:
        db.close()