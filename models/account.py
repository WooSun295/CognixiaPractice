from pydantic import BaseModel

class Account(BaseModel):
    userId: str
    balance: float
    type: str