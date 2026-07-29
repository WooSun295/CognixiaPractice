from pydantic import BaseModel

class Transaction(BaseModel):
    account_id: str
    txn_type: str
    amount: float