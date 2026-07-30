from pydantic import BaseModel

class Account(BaseModel):
    userId: str
    balance: float
    accountType: str
    status: str