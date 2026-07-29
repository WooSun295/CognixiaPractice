from bson import ObjectId
from helpers.helper import created_at
from database.database import client

db = client["simple_bank_db"]

acc_col = db["Accounts"]

def getAccounts():
    res = list(acc_col.find())
    for r in res:
        r["_id"] = str(r["_id"])
        r["userId"] = str(r["userId"])

    return res
    
def getAccount(account_id: str):
    res = acc_col.find_one({"_id": ObjectId(account_id)})
    if res:
        res["_id"] = str(res["_id"])
        res["userId"] = str(res["userId"])

    return res

def createAccount(userId: str, balance: float, type: str):
    return acc_col.insert_one({
            "userId": ObjectId(userId),
            "balance": balance,
            "accountType": type,
            "createdAt": created_at()
        })

def updateAccount(account_id: str, balance: int, type: str):
    return acc_col.update_one(
        {"_id": ObjectId(account_id)},
        { "$set": {"balance": balance, "accountType": type}}
    )

def deleteAccount(account_id: str):
    return acc_col.delete_one({"_id": ObjectId(account_id)})