from fastapi import APIRouter
from fastapi.responses import JSONResponse

from services.transaction_services import *

txnRouter = APIRouter(tags=["Transactions"])

@txnRouter.get("/")
def get_all_transaction_history():

    txns = getTxnsDB()

    return JSONResponse(
        status_code=200,
        content=txns
    )

@txnRouter.get("/{txnId}")
def get_transaction(txnId: str):

    txn = getTxnDB(txnId)

    if not txn:
        return JSONResponse(
            status_code=404,
            content={"message": "Transaction not found"}
        )

    return JSONResponse(
        status_code=200,
        content=txn
    )
