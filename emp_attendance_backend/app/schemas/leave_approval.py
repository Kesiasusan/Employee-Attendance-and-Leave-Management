from pydantic import BaseModel
from typing import Literal

class Leave_Approval(BaseModel):
    status: Literal["Approved","Rejected"] #With Literal Pydantic accepts only approved or rejected
    admin_comment: str
