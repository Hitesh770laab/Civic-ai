import os
from typing import List

class Settings:
    PROJECT_NAME: str = "CivicAI Urban Issue Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database Configuration
    # Uses SQLite by default for instant zero-dependency execution,
    # or PostgreSQL / PostGIS if DATABASE_URL is set (e.g. postgresql://postgres:postgres@localhost:5432/civicai)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./civicai.db"
    )
    
    # YOLO & Vision Model settings
    YOLO_MODEL_PATH: str = os.getenv("YOLO_MODEL_PATH", "yolov8n.pt")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    
    # Server configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
