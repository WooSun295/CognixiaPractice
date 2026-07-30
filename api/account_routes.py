from fastapi import APIRouter
from fastapi.responses import JSONResponse

from services.account_services import *
from models.account import Account
from models.transaction import Transaction

accountRouter = APIRouter(tags=["Accounts"])

@accountRouter.get("/")
def get_all_accounts():

    accounts = getAccountsDB()

    return JSONResponse(
        status_code=200,
        content=accounts
    )

@accountRouter.get("/{accountId}")
def get_account(accountId: str):

    account = getAccountDB(accountId)

    if not account:
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
    createAccountDB(
        account.userId, account.balance, account.accountType, account.status
    )

    return JSONResponse(
        status_code=201,
        content={"Message": "Account Created"}
    )

@accountRouter.get("/{accountId}/transactions")
def get_account_transaction_history(accountId: str):

    account = getAccountTxnDB(accountId)

    if not account:
        return JSONResponse(
            status_code=404,
            content={"message": "Account not found"}
        )

    return JSONResponse(
        status_code=200,
        content=account
    )

@accountRouter.post("/{accountId}/transactions")
def account_transactions(accountId: str, txn: Transaction):
    if txn.amount <= 0:
         return JSONResponse(
                status_code=422,
                content={"message": "Insufficient Amount"}
            )
    updated = accountTxnDB(
        accountId, txn.txnType, txn.amount, txn.description, txn.toAccountId
    )

    if updated == 404:
        return JSONResponse(
            status_code=404,
            content={"message": "Account not found"}
        )

    if updated == 403:
        return JSONResponse(
            status_code=403,
            content={"message": "Account is closed"}
        )

    if updated == 422:
        return JSONResponse(
            status_code=422,
            content={"message": "Insufficient Funds"}
        )

    if txn.txnType == "transfer":
        return JSONResponse(
            status_code=200,
            content={
                "acknowledged": updated["from"].acknowledged and updated["to"].acknowledged,
                "updatedId": accountId,
            }
        )
    
    return JSONResponse(
        status_code=200,
        content={
            "acknowledged": updated.acknowledged,
            "updatedId": accountId,
        }
    )

@accountRouter.put("/{accountId}")
def update_account(accountId: str, account: Account):
    updated = updateAccountDB(
        accountId, account.balance, account.accountType, account.status
    )

    if not updated or updated.matched_count == 0:
            return JSONResponse(
                status_code=404,
                content={"message": "Account not found"}
            )
    return JSONResponse(
        status_code=200,
        content={
            "acknowledged": updated.acknowledged,
            "updatedId": accountId,
        }
    )

@accountRouter.post("/{accountId}/close")
def close_account(accountId: str):
    closed = deleteAccountDB(accountId)

    if not closed or closed.matched_count == 0:
            return JSONResponse(
                status_code=404,
                content={"message": "Account not found"}
            )
    return JSONResponse(
        status_code=200,
        content={
            "acknowledged": "Account was closed"
        }
    )
