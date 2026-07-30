from datetime import datetime

def currTime():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

print(currTime())