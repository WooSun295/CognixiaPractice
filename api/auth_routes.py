from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

from models.auth import RegisterRequest, LoginRequest
from services.auth_services import loginDB, registerDB

authRouter = APIRouter(
    tags=["Authentication"]
)

@authRouter.post("/register")
def register(user: RegisterRequest):
    newUser = registerDB(
        user.name, user.email, user.password
    )

    if newUser == 409:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Duplicate Email"
        )

    if newUser.acknowledged:
        return JSONResponse(
            status_code=200,
            content="New User Registered"
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database Connection Error"
        )

@authRouter.post("/login")
def login(user: LoginRequest):

    token = loginDB(user.email, user.password)

    if not token:
        return JSONResponse(
            status_code=401,
            content="Invalid email or password"
        )

    return JSONResponse(
        status_code=200,
        content={
            "access_token": token,
            "token_type": "bearer"
        }
    )