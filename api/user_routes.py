from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from auth.dependencies import activeUserRequired
from helpers.helper import isAdmin, isAdminOrOwner

from services.user_services import *
from services.account_services import deleteAccountsDB
from models.user import User

userRouter = APIRouter(tags=["Users"])

@userRouter.get("/me")
def get_user(currentUser=Depends(activeUserRequired)):

    user = getUserDB(str(currentUser["_id"]))

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return JSONResponse(
        status_code=200,
        content=user
    )

@userRouter.get("/me/accounts")
def get_user_accounts(currentUser=Depends(activeUserRequired)):

    acc = getUserAccDB(str(currentUser["_id"]))

    if not acc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return JSONResponse(
        status_code=200,
        content=acc
    )

@userRouter.put("/me")
def update_user(user: User, currentUser=Depends(activeUserRequired)):

    updated = updateUserDB(
        str(currentUser["_id"]), user.name, user.password, user.email, currentUser["status"], currentUser["auth"]
    )

    if not updated or updated.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if updated.acknowledged:
        return JSONResponse(
            status_code=200,
            content={
                "acknowledged": updated.acknowledged,
                "updatedId": str(currentUser["_id"]),
            }
        )
    
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database Connection Error"
        )

@userRouter.post("/me/deactivate")
def deactivate_user(currentUser=Depends(activeUserRequired)):

    inactive = deleteUserDB(str(currentUser["_id"]))
    closed = deleteAccountsDB(str(currentUser["_id"]))

    if not inactive or inactive.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
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
            detail="Database Connection Error"
        )