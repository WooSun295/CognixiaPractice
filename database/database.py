import os
from dotenv import load_dotenv

from pymongo import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"), server_api=ServerApi('1'))

try:
    client.admin.command("ping")
    print("Successfully connected to MongoDB!")
except Exception as e:
    print(e)
