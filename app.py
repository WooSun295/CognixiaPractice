from fastapi import FastAPI
from api.user_routes import userRouter
from api.bank_routes import bankRouter
from api.account_routes import accountRouter

app = FastAPI()

app.include_router(userRouter)
app.include_router(bankRouter)
app.include_router(accountRouter)