from fastapi import APIRouter, HTTPException, Depends
from app.utils.security import hash_password
from app.utils.auth import get_current_user
from sqlalchemy import select
from app.schemas.user import UserCreate
from app.database.connection import SessionLocal
from app.models import User
from app.schemas.login import LoginRequest
from app.utils.security import verify_password
from app.utils.jwt import create_access_token
from pwdlib.exceptions import UnknownHashError
router=APIRouter()

@router.post("/register")
def register_user(user:UserCreate):
    db= SessionLocal()
    existing_user = db.scalar(
        select(User).where(User.email == user.email))

    if existing_user:
        db.close()
        raise HTTPException(
            status_code=409,
            detail="Email already registered")

    hashed_password = hash_password(user.password)
    new_user=User(
    name=user.name,
    email= user.email,
    password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.close()
    return {"message": "User registered successfully"}


@router.post("/login")
def login_user(login: LoginRequest):
    db = SessionLocal()
    existing_user = db.scalar(
        select(User).where(User.email == login.email))
    
    if not existing_user:
        db.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    try:
        password_valid =verify_password(
            login.password,
            existing_user.password
        )
    except UnknownHashError:
        password_valid = False
    
    if not password_valid:
        db.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
        
#sub → identifies the logged-in employee using their user ID.

#role → tells us whether the logged-in user is an admin or employee.
    
    access_token = create_access_token(
        data={"sub": str(existing_user.id), "role": existing_user.role}
    )


    db.close()

    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": existing_user.role
    }

@router.post("/logout")
def logout(current_user: dict = Depends(get_current_user)):
    return {
        "message": "Logout successful. Please discard your access token."
    }
 