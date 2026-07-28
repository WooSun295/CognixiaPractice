from fastapi import APIRouter
from fastapi.responses import JSONResponse

from services.account_services import *
from models.account import Account

accountRouter = APIRouter(prefix="/api/v2/accounts", tags=["Accounts"])

@accountRouter.get("/")
def get_accounts():

    accounts = getAccounts()

    return JSONResponse(
        status_code=200,
        content=accounts
    )

@accountRouter.get("/users/{user_id}")
def get_user_accounts(user_id: int):

    accounts = getAccounts("user", user_id)

    if accounts is None:
        return JSONResponse(
            status_code=404,
            content={"message": "Accounts not found"}
        )

    return JSONResponse(
        status_code=200,
        content=accounts
    )

@accountRouter.get("/{account_id}")
def get_account(account_id: int):

    account = getAccount(account_id)

    if account is None:
        return JSONResponse(
            status_code=404,
            content={"message": "Account not found"}
        )

    return JSONResponse(
        status_code=200,
        content=account
    )

@accountRouter.post("/")
def create_bank(account: Account):
    new_account = createAccount(
        account.userId, account.bankId, account.balance, account.type
    )

    return JSONResponse(
        status_code=201,
        content=new_account
    )

@accountRouter.put("/{account_id}")
def update_account(account_id: int, account: Account):
    updated = updateAccount(
        account_id, account.balance, account.type
    )

    if updated is None:
        return JSONResponse(
            status_code=404,
            content={"message": "Account not found"}
        )
    
    return JSONResponse(
        status_code=200,
        content=updated
    )

@accountRouter.delete("/{account_id}")
def delete_account(account_id: int):
    deleted = deleteAccount(account_id)

    if deleted is None:
        return JSONResponse(
            status_code=404,
            content={"message": "Account not found"}
        )
    return JSONResponse(
        status_code=200,
        content={"message": "Account Deleted"}
    )
