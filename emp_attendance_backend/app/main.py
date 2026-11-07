from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import Base, engine
from app.models import User, Attendance, Leave_Request
from app.routes.attendance import router as attendance_router
from app.routes.user import router
from app.routes.leave import router as leave_router
from app.routes.admin import router as admin_router

Base.metadata.create_all(bind=engine)
app =FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def welcome():
    return {"message" : "Welcome"}

app.include_router(router, prefix="/users", tags=["Users"])
app.include_router(attendance_router, prefix="/attendance", tags=["Attendance"])
app.include_router(leave_router, prefix="/leave", tags=["Leave"])
app.include_router(admin_router, tags=["Admin"])