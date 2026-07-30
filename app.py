from fastapi import FastAPI
from api.user_routes import userRouter
from api.transaction_routes import txnRouter
from api.account_routes import accountRouter

app = FastAPI()

api_prefix = "/api/v3"
app.include_router(userRouter, prefix=f"{api_prefix}/users")
app.include_router(accountRouter, prefix=f"{api_prefix}/accounts")
app.include_router(txnRouter, prefix=f"{api_prefix}/transactions")