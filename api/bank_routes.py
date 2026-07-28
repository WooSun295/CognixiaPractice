from fastapi import APIRouter
from fastapi.responses import JSONResponse

from services.bank_services import *
from models.bank import Bank

bankRouter = APIRouter(prefix="/api/v1/banks", tags=["Banks"])

@bankRouter.get("/")
def get_banks():

    banks = getBanks()

    return JSONResponse(
        status_code=200,
        content=banks
    )

@bankRouter.get("/{bank_id}")
def get_bank(bank_id: int):

    bank = getBank(bank_id)

    if bank is None:
        return JSONResponse(
            status_code=404,
            content={"message": "Bank not found"}
        )

    return JSONResponse(
        status_code=200,
        content=bank
    )

@bankRouter.post("/")
def create_bank(bank: Bank):
    new_bank = createBank(
        bank.username, bank.password
    )

    return JSONResponse(
        status_code=201,
        content=new_bank
    )

@bankRouter.put("/{bank_id}")
def update_bank(bank_id: int, bank: Bank):
    updated = updateBank(
        bank_id, bank.username, bank.password
    )

    if updated is None:
        return JSONResponse(
            status_code=404,
            content={"message": "Bank not found"}
        )
    return JSONResponse(
        status_code=200,
        content=updated
    )

@bankRouter.delete("/{bank_id}")
def delete_bank(bank_id: int):
    deleted = deleteBank(bank_id)

    if deleted is None:
        return JSONResponse(
            status_code=404,
            content={"message": "Bank not found"}
        )
    return JSONResponse(
        status_code=204
    )
