from motor.motor_asyncio import AsyncIOMotorClient
from config import get_settings

settings = get_settings()

client = None
db = None

async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]
    print(f"Connected to MongoDB Atlas — database: {settings.DB_NAME}")

async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed.")

def get_db():
    return db