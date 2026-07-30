from bson import ObjectId
from helpers.helper import currTime
from database.database import client

db = client["simple_bank_db"]

txnCol = db["Transactions"]

def getTxnsDB():
    res = list(txnCol.find())
    for r in res:
        r["_id"] = str(r["_id"])
        r["accountId"] = str(r["accountId"])

    return res

def getTxnDB(txnId: str):
    if not ObjectId.is_valid(txnId):
        return False
    res = txnCol.find_one({"_id": ObjectId(txnId)})
    if res:
        res["_id"] = str(res["_id"])
        res["accountId"] = str(res["accountId"])

    return res

def createTxnDB(accountId: str, txnType: str, amount: float, balanceAfter: float, description: str):
    return txnCol.insert_one({
        "accountId": ObjectId(accountId),
        "txnType": txnType,
        "amount": amount,
        "balanceAfter": balanceAfter,
        "description": description,
        "createdAt": currTime()
    })