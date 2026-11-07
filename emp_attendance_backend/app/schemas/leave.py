from pydantic import BaseModel
from datetime import date

class Leave_Create(BaseModel):
    
    leave_type: str
    start_date: date
    end_date: date
    reason: str
    