from api.dummy_data import MOCK_TXNS
from helpers.helper import created_at

def getTxns():
    return MOCK_BANKS

def getTxn(txn_id: int):
    for txn in MOCK_BANKS:
        if txn["id"] == txn_id:
            return txn
    return None

def createTxn(account_id: int, txn_type: str, amount: float):
    new_txn = {
        "account_id": account_id,
        "txn_type": txn_type,
        "amount": amount,
        "createdAt": created_at()
    }

    MOCK_BANKS.append(new_txn)

    return new_txn

def updateBank(txn_id: int, account_id: int, txn_type: str, amount: float):
    txn = getTxn(txn_id)

    if txn is None:
        return None

    txn["account_id"] = account_id
    txn["txn_type"] = txn_type
    txn["amount"] = amount

    return txn

def deleteBank(txn_id: int):
    txn = getTxn(txn_id)

    if txn is None:
        return None

    MOCK_BANKS.remove(txn)

    return True