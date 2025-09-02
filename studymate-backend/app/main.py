from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes.health import router as health_router
from app.config import settings
from app.database import init_db

app = FastAPI(title=settings.api_title, version=settings.api_version)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static storage mount
app.mount("/storage", StaticFiles(directory="app/storage"), name="storage")

# Routers
app.include_router(health_router, prefix="/api/health", tags=["health"]) 

@app.on_event("startup")
def on_startup():
    init_db()

