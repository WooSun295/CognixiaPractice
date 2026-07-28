from pydantic import BaseModel

class Account(BaseModel):
    userId: int
    bankId: int
    balance: float
    type: str

class Order(BaseModel):
    amount: float