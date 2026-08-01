from bson import ObjectId
from database.database import client

from helpers.helper import currTime
from auth.password import hashPassword

db = client["simple_bank_db"]

usersCol = db["Users"]

def getUsersDB():
    res = list(usersCol.find())
    for r in res:
        r["_id"] = str(r["_id"])
        r["password"] = "**********"

    return res

def getUserDB(userId: str):
    if not ObjectId.is_valid(userId):
        return False
    res = usersCol.find_one({"_id": ObjectId(userId)})
    if res:
        res["_id"] = str(res["_id"])
        r["password"] = "**********"

    return res

def getUserAccDB(userId: str):
    if not ObjectId.is_valid(userId):
        return False
    res = next(usersCol.aggregate([
        {
            "$match": {
                "_id": ObjectId(userId)
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

def createUserDB(name: str, password: str, email: str, status: str, auth: str):
    exists = usersCol.find_one({ "email": email })

    if exists:
        return 409

    return usersCol.insert_one({
        "name": name,
        "email": email,
        "password": hashPassword(password),
        "status": status,
        "auth": auth,
        "createdAt": currTime()

    })

def updateUserDB(userId: str, name: str, password: str, email: str, status: str, auth: str):
    if not ObjectId.is_valid(userId):
        return False
    
    if password != "":
        return usersCol.update_one(
            {"_id": ObjectId(userId)},
            { "$set": {"name": name, "password": hashPassword(password), "email": email, "status": status, "auth": auth}}
        )
    
    return usersCol.update_one(
        {"_id": ObjectId(userId)},
        { "$set": {"name": name, "email": email, "status": status, "auth": auth}}
    )

def deleteUserDB(userId: str):
    if not ObjectId.is_valid(userId):
        return False
    return usersCol.update_one(
        {"_id": ObjectId(userId)},
        {"$set": {"status": "inactive", "deletedAt": currTime()}}
    )