from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

def hashPassword(password: str):
    return password_hash.hash(password)

def verifyPassword(password: str, hashed_password: str):
    return password_hash.verify(password, hashed_password)