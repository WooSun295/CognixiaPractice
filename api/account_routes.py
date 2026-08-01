from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from auth.dependencies import activeUserRequired
from helpers.helper import isAdmin, isOwner, isAdminOrOwner

from services.account_services import *
from models.account import Account
from models.transaction import Transaction

accountRouter = APIRouter(tags=["Accounts"])

@accountRouter.get("/")
def admin_get_all_accounts(currentUser=Depends(activeUserRequired)):

    if not isAdmin(currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not Authorized"
        )

    accounts = getAccountsDB()

    return JSONResponse(
        status_code=200,
        content=accounts
    )

@accountRouter.get("/{accountId}")
def get_account(accountId: str, currentUser=Depends(activeUserRequired)):

    account = getAccountDB(accountId)

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

    if not isAdminOrOwner(account.userId, currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not Authorized"
        )

    return JSONResponse(
        status_code=200,
        content=account
    )

@accountRouter.post("/")
def create_account(account: Account, currentUser=Depends(activeUserRequired)):

    newAccount = createAccountDB(
        str(currentUser["_id"]), 0, account.accountType, "open"
    )

    if newAccount.acknowledged:
        return JSONResponse(
            status_code=201,
            content="Account Created"
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database Connection Error"
        )

@accountRouter.get("/{accountId}/transactions")
def get_account_transaction_history(accountId: str, currentUser=Depends(activeUserRequired)):

    account = getAccountTxnDB(accountId)

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account Not Found"
        )

    if not isAdminOrOwner(account["userId"], currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not Authorized"
        )

    return JSONResponse(
        status_code=200,
        content=account
    )

@accountRouter.post("/{accountId}/transactions")
def account_transactions(accountId: str, txn: Transaction, currentUser=Depends(activeUserRequired)):

    account = getAccountDB(accountId)

    if not isOwner(account["userId"], currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not Authorized"
        )

    if txn.amount <= 0:
        raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Insufficient Amount"
            )
    updated = accountTxnDB(
        accountId, txn.txnType, txn.amount, txn.description, txn.toAccountId
    )

    if updated == 404:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

    if updated == 403:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is closed"
        )

    if updated == 422:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Insufficient Funds"
        )

    if txn.txnType == "transfer":
        return JSONResponse(
            status_code=200,
            content={
                "acknowledged": updated["from"].acknowledged and updated["to"].acknowledged,
                "updatedId": accountId,
            }
        )

    if updated.acknowledged:
        return JSONResponse(
            status_code=200,
            content={
                "acknowledged": updated.acknowledged,
                "updatedId": accountId,
            }
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database Connection Error"
        )

@accountRouter.put("/{accountId}")
def admin_update_account(accountId: str, account: Account, currentUser=Depends(activeUserRequired)):

    oldAccount = getAccountDB(accountId)

    if not oldAccount:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

    if not isAdmin(currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not Authorized"
        )

    updated = updateAccountDB(
        accountId, account.balance, account.accountType, account.status
    )

    if updated.acknowledged:
        return JSONResponse(
            status_code=200,
            content={
                "acknowledged": updated.acknowledged,
                "updatedId": accountId,
            }
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database Connection Error"
        )

@accountRouter.post("/{accountId}/close")
def close_account(accountId: str, currentUser=Depends(activeUserRequired)):

    account = getAccountDB(accountId)

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

    if not isAdminOrOwner(account["userId"], currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not Authorized"
        )

    closed = deleteAccountDB(accountId)

    if closed.acknowledged:
        return JSONResponse(
            status_code=200,
            content={
                "acknowledged": "Account was closed"
            }
        )

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Database Connection Error"
    )
