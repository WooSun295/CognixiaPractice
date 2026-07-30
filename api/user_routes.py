from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from auth.dependencies import activeUserRequired
from helpers.helper import isAdmin, isAdminOrOwner

from services.user_services import *
from services.account_services import deleteAccountsDB
from models.user import User

userRouter = APIRouter(tags=["Users"])

@userRouter.get("/")
def get_all_users(currentUser=Depends(activeUserRequired)):

    if not isAdmin(currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"Not Authorized"}
        )

    users = getUsersDB()

    return JSONResponse(
        status_code=200,
        content=users
    )

@userRouter.get("/{userId}")
def get_user(userId: str, currentUser=Depends(activeUserRequired)):

    if not isAdminOrOwner(userId, currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"Not Authorized"}
        )

    user = getUserDB(userId)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"User not found"}
        )

    return JSONResponse(
        status_code=200,
        content=user
    )

@userRouter.get("/{userId}/accounts")
def get_user_accounts(userId: str, currentUser=Depends(activeUserRequired)):

    if not isAdminOrOwner(userId, currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"Not Authorized"}
        )

    acc = getUserAccDB(userId)

    if not acc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"User not found"}
        )

    return JSONResponse(
        status_code=200,
        content=acc
    )

@userRouter.post("/")
def create_user(user: User, currentUser=Depends(activeUserRequired)):

    if not isAdmin(currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"Not Authorized"}
        )

    newUser = createUserDB(
        user.name, user.password, user.email, user.status, user.auth
    )

    if newUser == 409:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"Duplicate Email"}
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"Database Connection Error"}
        )

@userRouter.put("/{userId}")
def update_user(userId: str, user: User, currentUser=Depends(activeUserRequired)):

    if not isAdminOrOwner(userId, currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"Not Authorized"}
        )

    updated = updateUserDB(
        userId, user.name, user.password, user.email, user.status, user.auth
    )

    if not updated or updated.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"User not found"}
        )

    if updated.acknowledged:
        return JSONResponse(
            status_code=200,
            content={
                "acknowledged": updated.acknowledged,
                "updatedId": userId,
            }
        )
    
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"Database Connection Error"}
        )

@userRouter.post("/{userId}/deactivate")
def deactivate_user(userId: str, currentUser=Depends(activeUserRequired)):

    if not isAdminOrOwner(userId, currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"Not Authorized"}
        )

    inactive = deleteUserDB(userId)
    closed = deleteAccountsDB(userId)

    if not inactive or inactive.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"User not found"}
        )

    if inactive.acknowledged:
        return JSONResponse(
            status_code=200,
            content={
                "acknowledged": "User has been deleted",
                "accountsClosed": closed.modified_count 
            }
        )

    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"Database Connection Error"}
        )
