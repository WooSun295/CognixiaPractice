from pydantic import BaseModel

class Transaction(BaseModel):
    account_id: int
    txn_type: str
    amount: float