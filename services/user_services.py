from api.dummy_data import MOCK_USERS

def getUsers():
    return MOCK_USERS

def getUser(user_id: int):
    for user in MOCK_USERS:
        if user["id"] == user_id:
            return user
    return None

def createUser(username: str, password: str):
    new_user = {
        "id": len(MOCK_USERS) + 10000,
        "username": username,
        "password": password
    }

    MOCK_USERS.append(new_user)

    return new_user

def updateUser(user_id: int, username: str, password: str):
    user = getUser(user_id)

    if user is None:
        return None

    user["username"] = username
    user["password"] = password

    return user

def deleteUser(user_id: int):
    user = getUser(user_id)

    if user is None:
        return None

    MOCK_USERS.remove(user)

    return True