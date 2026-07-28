from api.dummy_data import MOCK_BANKS

def getBanks():
    return MOCK_BANKS

def getBank(bank_id: int):
    for bank in MOCK_BANKS:
        if bank["id"] == bank_id:
            return bank
    return None

def createBank(name: str):
    new_bank = {
        "id": len(MOCK_BANKS),
        "name": name
    }

    MOCK_BANKS.append(new_bank)

    return new_bank

def updateBank(bank_id: int, name: str):
    bank = getBank(bank_id)

    if bank is None:
        return None

    bank["name"] = name

    return bank

def deleteBank(bank_id: int):
    bank = getBank(bank_id)

    if bank is None:
        return None

    MOCK_BANKS.remove(bank)

    return True