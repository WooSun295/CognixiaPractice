from pydantic import BaseModel

class Transaction(BaseModel):
    txnType: str
    amount: float
    description: str
    toAccountId: str