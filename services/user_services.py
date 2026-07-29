from bson import ObjectId
from helpers.helper import created_at
from database.database import client

db = client["simple_bank_db"]

users_col = db["Users"]

def getUsers():
    res = list(users_col.find())
    for r in res:
        r["_id"] = str(r["_id"])

    return res

def getUser(user_id: str):
    res = users_col.find_one({"_id": ObjectId(user_id)})
    if res:
        res["_id"] = str(res["_id"])

    return res

def getUserAcc(user_id: str):
    res = next(users_col.aggregate([
        {
            "$match": {
                "_id": ObjectId(user_id)
            },
        },
        {
            "$lookup": {
                "from": "Accounts",
                "localField": "_id",
                "foreignField": "userId",
                "as": "accounts"
            }
        },
        {
            "$project": {
                "password": 0
            }
        }
    ]), None)

    if res:
        res["_id"] = str(res["_id"])
        for a in res["accounts"]:
            a["_id"] = str(a["_id"])
            a["userId"] = str(a["userId"])

    return res

def createUser(name: str, password: str, email: str):
    return users_col.insert_one({
        "name": name,
        "password": password,
        "email": email,
        "createdAt": created_at()
    })

def updateUser(user_id: str, name: str, password: str, email: str):
    return users_col.update_one(
        {"_id": ObjectId(user_id)},
        { "$set": {"name": name, "password": password, "email": email}}
    )

def deleteUser(user_id: str):
    return users_col.delete_one({"_id": ObjectId(user_id)})