from pydantic import BaseModel

class Account(BaseModel):
    userId: int
    balance: float
    type: str