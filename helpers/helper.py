from datetime import datetime

def currTime():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def isAdmin(admin):
    return admin["auth"] == "admin"

def isOwner(userId, user):
    return userId == str(user["_id"])

def isAdminOrOwner(userId, user):
    return (isAdmin(user) or isOwner(userId, user))
