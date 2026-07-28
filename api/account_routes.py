from fastapi import APIRouter
from fastapi.responses import JSONResponse

from services.account_services import *
from models.account import Account, Order

accountRouter = APIRouter(prefix="/api/v1/accounts", tags=["Accounts"])

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

@accountRouter.get("/banks/{bank_id}")
def get_bank_accounts(bank_id: int):

    accounts = getAccounts("bank", bank_id)

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

@accountRouter.patch("/{account_id}/deposit")
def deposit_account(account_id: int, order: Order):
    updated = updateAccount(
        account_id, order.amount, "deposit"
    )

    if updated is None:
        return JSONResponse(
            status_code=404,
            content={"message": "Account not found"}
        )
    elif updated == -1:
        return JSONResponse(
            status_code=400,
            content={"message": "Insufficient amount"}
        )
    elif not updated:
        return JSONResponse(
            status_code=400,
            content={"message": "Bad Request"}
        )
    return JSONResponse(
        status_code=200,
        content=updated
    )

@accountRouter.patch("/{account_id}/withdraw")
def withdraw_account(account_id: int, order: Order):
    updated = updateAccount(
        account_id, order.amount, "withdraw"
    )

    if updated is None:
        return JSONResponse(
            status_code=404,
            content={"message": "Account not found"}
        )
    elif updated == -1:
        return JSONResponse(
            status_code=400,
            content={"message": "Insufficient amount"}
        )
    elif not updated:
        return JSONResponse(
            status_code=400,
            content={"message": "Bad Request"}
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
