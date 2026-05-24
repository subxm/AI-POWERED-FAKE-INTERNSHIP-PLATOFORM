from database.mongodb import get_db

COLLECTIONS = {
    "users": "users",
    "analyses": "analyses",
    "reports": "reports"
}

async def init_indexes():
    db = get_db()

    # Users — unique email
    await db[COLLECTIONS["users"]].create_index("email", unique=True)

    # Analyses — quick lookup by user
    await db[COLLECTIONS["analyses"]].create_index("user_id")

    # Reports — quick lookup by user and date
    await db[COLLECTIONS["reports"]].create_index("user_id")
    await db[COLLECTIONS["reports"]].create_index("created_at")

    print("Database indexes initialized.")