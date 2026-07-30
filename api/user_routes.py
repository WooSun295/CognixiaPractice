from fastapi import APIRouter
from fastapi.responses import JSONResponse

from services.user_services import *
from services.account_services import deleteAccountsDB
from models.user import User

userRouter = APIRouter(tags=["Users"])

@userRouter.get("/")
def get_all_users():

    users = getUsersDB()

    return JSONResponse(
        status_code=200,
        content=users
    )

@userRouter.get("/{userId}")
def get_user(userId: str):
    user = getUserDB(userId)

    if not user:
        return JSONResponse(
            status_code=404,
            content={"message": "User not found"}
        )

    return JSONResponse(
        status_code=200,
        content=user
    )

@userRouter.get("/{userId}/accounts")
def get_user_accounts(userId: str):
    acc = getUserAccDB(userId)

    if not acc:
        return JSONResponse(
            status_code=404,
            content={"message": "User not found"}
        )

    return JSONResponse(
        status_code=200,
        content=acc
    )

@userRouter.post("/")
def create_user(user: User):
    newUser = createUserDB(
        user.name, user.password, user.email, user.status
    )

    if newUser.acknowledged:
        return JSONResponse(
            status_code=200,
            content={
                "acknowledged": newUser.acknowledged,
                "insertedId": str(newUser.inserted_id)
            }
        )
    else:
        return JSONResponse(
            status_code=500,
            content={"message": "Server Error"}
        )

@userRouter.put("/{userId}")
def update_user(userId: str, user: User):
    updated = updateUserDB(
        userId, user.name, user.password, user.email, user.status
    )

    if not updated or updated.matched_count == 0:
        return JSONResponse(
            status_code=404,
            content={"message": "User not found"}
        )
    return JSONResponse(
        status_code=200,
        content={
            "acknowledged": updated.acknowledged,
            "updatedId": userId,
        }
    )

@userRouter.post("/{userId}/deactivate")
def deactivate_user(userId: str):
    inactive = deleteUserDB(userId)
    closed = deleteAccountsDB(userId)

    if not inactive or inactive.matched_count == 0:
        return JSONResponse(
            status_code=404,
            content={"message": "User not found"}
        )
    return JSONResponse(
        status_code=200,
        content={
            "acknowledged": "User has been deleted",
            "accountsClosed": closed.modified_count 
        }
    )
