from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException
from app.utils.jwt import verify_access_token

security=HTTPBearer()

#credentials → receives the extracted authentication credentials.
#HTTPAuthorizationCredentials → specifies the expected credential type.
#Depends(security) → tells FastAPI to extract the Bearer token first.

def get_current_user(
      credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials
    payload = verify_access_token(token)
    return payload

def get_current_admin(current_user:dict = Depends(get_current_user)):
    if current_user["role"]!="admin":
        raise HTTPException(
            status_code = 403,
            detail ="Admin access required"
        )
    return current_user

    

