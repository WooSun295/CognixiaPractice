from abc import ABC, abstractclassmethod

class Bank:
    def __init__(self, id, name):
        self.id = id
        self.name = name

    def getId(self):
        return self.id

    def setId(self, id):
        self.id = id

    def getName(self):
        return self.name

    def setId(self, name):
        self.name = name

class Account(Bank):
    def __init__(self, username, password):
        super().__init__(username)

b1 = Bank(1, "ABC Digital Bank")

print(b1.id)
print(b1.name)