from app.database.connection import SessionLocal
from app.models import User
from app.utils.security import hash_password
from sqlalchemy import select

db = SessionLocal()

emails = [
    "rahuldas@gmail.com.com",
    "sandra@gmail.com",
    "andrew@gmail.com",
    "testemployee@example.com"
]

try:
    for email in emails:
        user = db.scalar(select(User).where(User.email == email))

        if user:
            user.password = hash_password(user.password)
            print(f"Password hashed: {email}")

    db.commit()
    print("All employee password hashes updated!")

except Exception:
    db.rollback()
    raise

finally:
    db.close()