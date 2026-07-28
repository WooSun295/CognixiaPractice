from fastapi import APIRouter
from fastapi.responses import JSONResponse

from services.transaction_services import *
from models.transaction import Transaction

txnRouter = APIRouter(prefix="/api/v2/transactions", tags=["Transactions"])

@txnRouter.get("/")
def get_txns():

    txns = getTxns()

    return JSONResponse(
        status_code=200,
        content=txns
    )

@txnRouter.get("/{txn_id}")
def get_txn(txn_id: int):

    txn = getTxn(txn_id)

    if txn is None:
        return JSONResponse(
            status_code=404,
            content={"message": "Txn not found"}
        )

    return JSONResponse(
        status_code=200,
        content=txn
    )

@txnRouter.post("/")
def create_txn(txn: Transaction):
    new_txn = createTxn(
        txn.username, txn.password
    )

    return JSONResponse(
        status_code=201,
        content=new_txn
    )

@txnRouter.put("/{bank_id}")
def update_txn(txn_id: int, txn: Transaction):
    updated = updateTxn(
        txn_id, txn.username, txn.password
    )

    if updated is None:
        return JSONResponse(
            status_code=404,
            content={"message": "Transaction not found"}
        )
    return JSONResponse(
        status_code=200,
        content=updated
    )

@txnRouter.delete("/{txn_id}")
def delete_bank(txn_id: int):
    deleted = deleteBank(txn_id)

    if deleted is None:
        return JSONResponse(
            status_code=404,
            content={"message": "Transaction not found"}
        )
    return JSONResponse(
        status_code=204
    )
