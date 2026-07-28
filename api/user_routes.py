from fastapi import APIRouter
from fastapi.responses import JSONResponse

from services.user_services import *
from models.user import User

userRouter = APIRouter(prefix="/api/v1/users", tags=["Users"])

@userRouter.get("/")
def get_users():

    users = getUsers()

    return JSONResponse(
        status_code=200,
        content=users
    )

@userRouter.get("/{user_id}")
def get_user(user_id: int):

    user = getUser(user_id)

    if user is None:
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
        user.username, user.password
    )

    return JSONResponse(
        status_code=201,
        content=new_user
    )

@userRouter.put("/{user_id}")
def update_user(user_id: int, user: User):
    updated = updateUser(
        user_id, user.username, user.password
    )

    if updated is None:
        return JSONResponse(
            status_code=404,
            content={"message": "User not found"}
        )
    return JSONResponse(
        status_code=200,
        content=updated
    )

@userRouter.delete("/{user_id}")
def delete_user(user_id: int):
    deleted = deleteUser(user_id)

    if deleted is None:
        return JSONResponse(
            status_code=404,
            content={"message": "User not found"}
        )
    return JSONResponse(
        status_code=204
    )
