from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.database import get_db, client
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup - test MongoDB connection
    try:
        await client.admin.command("ping")
        print("✅ MongoDB connected successfully!")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
    yield
    # Shutdown
    client.close()
    print("MongoDB connection closed.")

app = FastAPI(title="IntervieTA API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "IntervieTA API - Auth MVP"}