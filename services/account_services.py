from api.dummy_data import MOCK_ACCOUNTS

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
        elif category == "bank":
            res = []
            for account in MOCK_ACCOUNTS:
                if account["bankId"] == category_id:
                    res.append(account)
            return res
    return None

def getAccount(account_id: int):
    for account in MOCK_ACCOUNTS:
        if account["id"] == account_id:
            return account
    return None

def createAccount(userId: int, bankId: int, balance: int, type: str):
    new_account = {
        "id": int(str(userId) + str(bankId)),
        "userId": userId,
        "bankId": bankId,
        "balance": balance,
        "type": type
    }

    MOCK_ACCOUNTS.append(new_account)

    return new_account

def updateAccount(account_id: int, amount: int, type: str):
    account = getAccount(account_id)

    if account is None:
        return None

    if type == "deposit":
        account["balance"] += amount
    elif type == "withdraw":
        if account["balance"] >= amount:
            account["balance"] -= amount
        else:
            return -1
    else:
        return False

    return account

def deleteAccount(account_id: int):
    account = getAccount(account_id)

    if account is None:
        return None

    MOCK_ACCOUNTS.remove(account)

    return True