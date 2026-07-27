from fastapi import APIRouter
from fastapi.responses import JSONResponse

from services.user_services import *
from models.user import User

router = APIRouter()
BASE_URL = "/api/v1"

@router.get(BASE_URL + "/users")
def get_users():

    users = getUsers()

    return JSONResponse(
        status_code=200,
        content=users
    )

@router.get(BASE_URL + "/users/{user_id}")
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

@router.post(BASE_URL + "/users")
def create_user(user: User):
    new_user = createUser(
        user.username, user.password
    )

    return JSONResponse(
        status_code=201,
        content=new_user
    )

@router.post(BASE_URL + "/users/{user_id}")
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

@router.delete(BASE_URL + "/users/{user_id}")
def delete_user(user_id: int):
    deleted = deleteUser(user_id)

    if not deleted:
        return JSONResponse(
            status_code=404,
            content={"message": "User not found"}
        )
    return JSONResponse(
        status_code=200,
        content={"message": "User deleted"}
    )
