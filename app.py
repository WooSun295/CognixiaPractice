from fastapi import FastAPI
from api.user_routes import userRouter
from api.transaction_routes import txnRouter
from api.account_routes import accountRouter

app = FastAPI()

app.include_router(userRouter)
app.include_router(accountRouter)
app.include_router(txnRouter)