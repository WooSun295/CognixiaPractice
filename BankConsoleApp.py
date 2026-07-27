class Bank:
    def __init__(self, id, name):
        self.id = id
        self.name = name

class User:
    '''
        Defines a general User class that has a subclass Admin and Customer.
        This class should never be called, only call Admin or Customer
    '''
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

class Admin(User):
    def __init__(self, id, username, password):
        super().__init__(id, username, password)
        self.admin = True

class Customer(User):
    def __init__(self, id, username, password):
        super().__init__(id, username, password)
        self.admin = False

class Account:
    def __init__(self, id, userId, bankId, balance):
        self.id = id
        self.userId = userId
        self.bankId = bankId
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        print("                 RECEIPT")
        print(f"Amount Deposited:     ${amount:>10,.2f}")
        print(f"Current Balance:     ${self.balance:>10,.2f}")

    def withdraw(self, amount):
        self.balance -= amount
        print("                 RECEIPT")
        print(f"Amount Withdrawn:     ${amount:>10,.2f}")
        print(f"Current Balance:     ${self.balance:>10,.2f}")
        
     
class Checking(Account):
    def __init__(self, id, userId, bankId, balance):
        super().__init__(id, userId, bankId, balance)
        self.type = "Checking"

class Savings(Account):
    def __init__(self, id, userId, bankId, balance):
        super().__init__(id, userId, bankId, balance)
        self.type = "Savings"

# MOCK DATA
MOCK_BANKS = {
    1: Bank(1, "ABC World Bank"),
    2: Bank(2, "123 National Bank")
}

MOCK_USERS = {
    "admin":Admin(1, "admin", "admin123"),
    "user1":Customer(10001, "user1", "user123"),
    "user2":Customer(10002, "user2", "user123"),
    "user3":Customer(10003, "user3", "user123")
}


MOCK_ACCOUNTS = {
    10001:[Checking(100011, 10001, 1, 100000), Savings(100012, 10001, 1, 200000)],
    10002:[Checking(100021, 10002, 2, 300000), Savings(100022, 10002, 2, 400000)],
    10003:[Checking(100031, 10003, 1, 500000), Savings(100032, 10003, 2, 600000)]
}

print(MOCK_ACCOUNTS)

def validLogin(username, password):
    if username not in MOCK_USERS:
        return False
    else:
        return MOCK_USERS[username].password == password

def login():
    print("*----------Login----------*")
    while True:
        username = input("Enter Your Username: ")
        password = input("Enter Your Password: ")

        if validLogin(username, password):
            break
        else:
            print("INVALID: Login Failed")

    print(f"Welcome {username}")
    return username

def adminDashboard():
    print("*----------Admin Dashboard----------*")
    choice = 0
    while choice != -1:
        print("*----------Nav----------*")
        print("Associated Banks: 1")
        print("All Users:        2")
        print("All Accounts:     3")
        print("Exit:            -1")
        choice = int(input("choice: "))
        match choice:
            case 1:
                print("*----------Banks----------*")
                for bank in MOCK_BANKS.values():
                    print(f"Bank ID: {bank.id}")
                    print(f"Bank Name: {bank.name}")

                print("*----------Nav----------*")
                print("Go back: 0")
                print("Exit:   -1")
                choice = int(input("choice: "))
            case 2:
                print("*----------Users----------*")
                for user in MOCK_USERS.values():
                    print(f"User ID: {user.id}")
                    print(f"UserName: {user.username}")
                    print(f"Password: {user.password}")

                print("*----------Nav----------*")
                print("Go back: 0")
                print("Exit:   -1")
                choice = int(input("choice: "))
            case 3:
                print("*----------Accounts----------*")
                for acc in MOCK_ACCOUNTS.values():
                    print(f"Account ID: {acc.id}")
                    print(f"User ID: {acc.userId}")
                    print(f"Bank ID: {acc.bankId}")
                    print(f"Balance: {acc.balance}")

                print("*----------Nav----------*")
                print("Go back: 0")
                print("Exit:   -1")
                choice = int(input("choice: "))
            case -1:
                continue
            case _:
                print("INVALID: Not a valid option")

def customerDashboard(currUser):
    print("*----------Customer Dashboard----------*")
    currUserId = MOCK_USERS[currUser].id
    accounts = MOCK_ACCOUNTS[currUserId]

    choice1 = 0
    while choice1 != -1:

        print("*----------Nav----------*")
        n = len(accounts)
        for i in range(n):
            print(f"{accounts[i].type}: {i+1}")

        print("Exit: -1")
        choice1 = int(input("choice: "))
        if choice1 <= n and choice1 != -1:
            choice2 = 0
            while choice2 != -1:
                print(f"*----------{accounts[choice1-1].type} Account----------*")
                print("*----------Nav----------*")
                print("View Balance: 1")
                print("Deposit:      2")
                print("Withdraw:     3")
                print("Exit:        -1")
                choice2 = int(input("choice: "))

                match choice2:
                    case 1:
                        print(f"Current Balance: ${accounts[choice1-1].balance:,.2f}")

                        print("*----------Nav----------*")
                        print("Go back: 0")
                        print("Exit:   -1")
                        choice2 = int(input("choice: "))

                    case 2:
                        amount = int(input("Enter deposit amount: "))
                        accounts[choice1-1].deposit(amount)

                        print("*----------Nav----------*")
                        print("Go back: 0")
                        print("Exit:   -1")
                        choice2 = int(input("choice: "))

                    case 3:
                        amount = int(input("Enter withdraw amount: "))
                        if accounts[choice1-1].balance >= amount:
                            accounts[choice1-1].withdraw(amount)
                        else:
                            print("INVALID: Insufficient Balance")

                        print("*----------Nav----------*")
                        print("Go back: 0")
                        print("Exit:   -1")
                        choice2 = int(input("choice: "))

def main():
    currUser = login()

    if currUser == 'admin':
        adminDashboard()
    else:
        customerDashboard(currUser)


main()
