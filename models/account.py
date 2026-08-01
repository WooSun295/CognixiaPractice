from pydantic import BaseModel

class Account(BaseModel):
    accountType: str