from pwdlib import PasswordHash
from pwdlib.exceptions import UnknownHashError

password_hash = PasswordHash.recommended()

def hashPassword(password: str):
    return password_hash.hash(password)

def verifyPassword(password: str, hashed_password: str):
    return password_hash.verify(password, hashed_password)

def isHashed(password: str):
    try:
        password_hash.verify("NOT-A-REAL-PASSWORD", password)
    except UnknownHashError:
        return False
    else:
        return True