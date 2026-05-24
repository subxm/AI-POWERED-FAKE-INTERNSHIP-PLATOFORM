from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import get_settings
from database.mongodb import connect_db, close_db
from database.schema import init_indexes
from routes import auth, analyze, upload, reports

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    print("Starting up...")
    await connect_db()
    await init_indexes()
    print(f"{settings.APP_NAME} is ready.")
    yield
    # --- Shutdown ---
    print("Shutting down...")
    await close_db()

app = FastAPI(
    title       = settings.APP_NAME,
    description = "AI-powered fake internship detection API",
    version     = "1.0.0",
    lifespan    = lifespan
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["http://localhost:5173"],  # Vite default port
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"]
)

app.include_router(auth.router,     prefix="/api/auth",     tags=["Auth"])
app.include_router(analyze.router,  prefix="/api/analyze",  tags=["Analyze"])
app.include_router(upload.router,   prefix="/api/upload",   tags=["Upload"])
app.include_router(reports.router,  prefix="/api/reports",  tags=["Reports"])

@app.get("/")
async def root():
    return {"message": f"{settings.APP_NAME} API is running."}

@app.get("/health")
async def health():
    return {"status": "ok"}