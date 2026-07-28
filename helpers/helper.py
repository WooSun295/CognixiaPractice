from datetime import datetime

def created_at():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

print(created_at())