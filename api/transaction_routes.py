from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from auth.dependencies import activeUserRequired
from helpers.helper import isAdmin, isOwner, isAdminOrOwner

from services.transaction_services import *
from services.account_services import getAccountDB

txnRouter = APIRouter(tags=["Transactions"])

@txnRouter.get("/")
def get_all_transaction_history(currentUser=Depends(activeUserRequired)):

    if not isAdmin(currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"Not Authorized"}
        )

    txns = getTxnsDB()

    return JSONResponse(
        status_code=200,
        content=txns
    )

@txnRouter.get("/{txnId}")
def get_transaction(txnId: str, currentUser=Depends(activeUserRequired)):

    txn = getTxnDB(txnId)

    if not txn:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"Transaction not found"}
        )

    account = getAccountDB(txnId.accountId)
    
    if not isAdminOrOwner(account.userId, currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"Not Authorized"}
        )

    return JSONResponse(
        status_code=200,
        content=txn
    )
