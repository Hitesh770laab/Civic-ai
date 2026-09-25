from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal, is_sqlite
from app.seed_data import seed_database
from app.api import reports, ai, admin, wards

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("civicai")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB schema & seed sample data
    logger.info(f"Initializing CivicAI Database Engine (SQLite: {is_sqlite})...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        seed_database(db)
        logger.info("CivicAI seed data verified successfully.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()
        
    yield
    logger.info("CivicAI service shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Interactive AI-Powered Urban Issue Reporting, PostGIS Spatial Routing, and YOLO Defect Detection Platform.",
    lifespan=lifespan
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(wards.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "spatial_engine": "PostGIS (Spatial Polygon / Shapely Core)",
        "vision_engine": "Ultralytics YOLOv8 Municipal Defect Detector",
        "roles_supported": ["citizen", "officer", "admin"]
    }
