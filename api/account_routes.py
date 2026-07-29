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

@accountRouter.get("/{account_id}")
def get_account(account_id: str):

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
def create_account(account: Account):
    new_account = createAccount(
        account.userId, account.balance, account.type
    )

    return JSONResponse(
        status_code=200,
        content={
            "acknowledged": new_account.acknowledged,
            "insertedId": str(new_account.inserted_id)
        }
    )

@accountRouter.put("/{account_id}")
def update_account(account_id: str, account: Account):
    updated = updateAccount(
        account_id, account.balance, account.type
    )

    if updated.matched_count == 0:
            return JSONResponse(
                status_code=404,
                content={"message": "Account not found"}
            )
    return JSONResponse(
        status_code=200,
        content={
            "acknowledged": updated.acknowledged,
            "updatedId": account_id,
        }
    )

@accountRouter.delete("/{account_id}")
def delete_account(account_id: str):
    deleted = deleteAccount(account_id)

    if deleted.deleted_count == 0:
            return JSONResponse(
                status_code=404,
                content={"message": "Account not found"}
            )
    return JSONResponse(
        status_code=200,
        content={
            "acknowledged": deleted.acknowledged,
            "deleted_count": deleted.deleted_count
        }
    )
