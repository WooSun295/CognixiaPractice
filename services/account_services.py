from api.dummy_data import MOCK_ACCOUNTS
from helpers.helper import created_at

def getAccounts(category: str = "", category_id: int = 0):
    if not category:
        return MOCK_ACCOUNTS
    else:
        if category == "user":
            res = []
            for account in MOCK_ACCOUNTS:
                if account["userId"] == category_id:
                    res.append(account)
            return res
        
    return None

def getAccount(account_id: int):
    for account in MOCK_ACCOUNTS:
        if account["id"] == account_id:
            return account
    return None

def createAccount(userId: int, balance: float, type: str):
    new_account = {
        "userId": userId,
        "balance": balance,
        "type": type,
        "createdAt": created_at()
    }

    MOCK_ACCOUNTS.append(new_account)

    return new_account

def updateAccount(account_id: int, balance: int, type: str):
    account = getAccount(account_id)

    if account is None:
        return None

    account["balance"] = balance
    account["type"] = type

    return account

def deleteAccount(account_id: int):
    account = getAccount(account_id)

    if account is None:
        return None

    MOCK_ACCOUNTS.remove(account)

    return True