from fastapi import APIRouter
from fastapi.responses import JSONResponse

from services.user_services import *
from models.user import User

userRouter = APIRouter(prefix="/api/v2/users", tags=["Users"])

@userRouter.get("/")
def get_users():

    users = getUsers()

    return JSONResponse(
        status_code=200,
        content=users
    )

@userRouter.get("/{user_id}")
def get_user(user_id: str):

    user = getUser(user_id)

    if not user:
        return JSONResponse(
            status_code=404,
            content={"message": "User not found"}
        )

    return JSONResponse(
        status_code=200,
        content=user
    )

@userRouter.post("/")
def create_user(user: User):
    new_user = createUser(
        user.name, user.password, user.email
    )

    return JSONResponse(
        status_code=201,
        content={
            "acknowledged": new_user.acknowledged,
            "insertedId": str(new_user.inserted_id)
        }
    )

@userRouter.put("/{user_id}")
def update_user(user_id: str, user: User):
    updated = updateUser(
        user_id, user.name, user.password, user.email
    )

    if updated.matched_count == 0:
        return JSONResponse(
            status_code=404,
            content={"message": "User not found"}
        )
    return JSONResponse(
        status_code=200,
        content={
            "acknowledged": updated.acknowledged,
            "updatedId": user_id,
        }
    )

@userRouter.delete("/{user_id}")
def delete_user(user_id: str):
    deleted = deleteUser(user_id)

    if deleted.deleted_count == 0:
        return JSONResponse(
            status_code=404,
            content={"message": "User not found"}
        )
    return JSONResponse(
        status_code=200,
        content={
            "acknowledged": deleted.acknowledged,
            "deleted_count": deleted.deleted_count
        }
    )
