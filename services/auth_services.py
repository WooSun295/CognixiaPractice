from database.database import client

from helpers.helper import currTime
from auth.password import hashPassword, verifyPassword
from auth.jwt_handler import createAccessToken

db = client["simple_bank_db"]

usersCol = db["Users"]

def loginDB(email: str, password: str):
    user = usersCol.find_one({
        "email": email
    })

    if not user or not verifyPassword(password, user["password"]):
        return False

    token = createAccessToken({
        "sub": str(user["_id"]),
        "auth": user["auth"]
    })

    return token

def registerDB(name: str, email:str, password: str):
    exists = usersCol.find_one({ "email": email })
    
    if exists:
        return 409

    return usersCol.insert_one({
        "name": name,
        "email": email,
        "password": hashPassword(password),
        "status": "active",
        "auth": "customer",
        "createdAt": currTime()

    })