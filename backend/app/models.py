from datetime import datetime
from typing import List, Optional, Any, Dict
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, Boolean
from pydantic import BaseModel, Field
from app.database import Base

# ================= SQLAlchemy ORM Models =================

class ReportModel(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ticket_number = Column(String(32), unique=True, index=True)
    issue_type = Column(String(64), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(32), default="NEW", index=True) # NEW, IN_PROGRESS, RESOLVED, VERIFIED_CLOSED
    
    # Spatial data (WGS84 Lat/Lng + Ward ID)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    address_hint = Column(String(255), nullable=True)
    ward_id = Column(String(64), index=True, nullable=True)
    ward_name = Column(String(128), nullable=True)
    
    # AI Classification & Urgency Engine
    priority_score = Column(Float, default=5.0)  # 0.0 to 10.0
    priority_level = Column(String(16), default="MEDIUM") # LOW, MEDIUM, HIGH
    confidence_score = Column(Float, default=0.85) # 0.00 to 1.00
    assigned_department = Column(String(128), nullable=False)
    urgency_keywords = Column(JSON, default=list) # e.g. ["school", "accident"]
    ai_explanation = Column(JSON, default=dict) # detailed math breakdown
    
    # YOLO Vision detection results
    image_url = Column(Text, nullable=True)
    yolo_detections = Column(JSON, default=list) # [{label, confidence, box}]
    
    # SLA Tracking
    sla_hours = Column(Integer, default=72)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    sla_deadline = Column(DateTime, nullable=False)
    resolved_at = Column(DateTime, nullable=True)
    verified_at = Column(DateTime, nullable=True)


class WardModel(Base):
    __tablename__ = "wards"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    code = Column(String(16), nullable=False)
    zone = Column(String(64), default="Central")
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    polygon_geojson = Column(JSON, nullable=False)
    officer_in_charge = Column(String(128), default="Zone Director")
    contact_phone = Column(String(32), default="+1-555-CIVIC-01")


# ================= Pydantic Validation Schemas =================

class UrgencyKeywordMatch(BaseModel):
    keyword: str
    weight: float
    reason: str

class AiExplanation(BaseModel):
    base_score: float
    issue_type: str
    keyword_boost: float
    matched_keywords: List[UrgencyKeywordMatch] = []
    variance: float
    final_score: float
    confidence: float
    assigned_department: str
    sla_hours: int
    rationale: str

class YoloDetectionBox(BaseModel):
    label: str
    confidence: float
    box: List[float] = [] # [ymin, xmin, ymax, xmax] or [x1, y1, x2, y2]
    defect_type: Optional[str] = None

class ReportCreate(BaseModel):
    issue_type: str = Field(..., description="pothole, garbage_overflow, water_leakage, streetlight_outage, traffic_signal, infrastructure_damage")
    title: Optional[str] = None
    description: Optional[str] = ""
    latitude: float
    longitude: float
    address_hint: Optional[str] = None
    image_base64: Optional[str] = None

class ReportStatusUpdate(BaseModel):
    status: str = Field(..., description="NEW, IN_PROGRESS, RESOLVED, VERIFIED_CLOSED")
    officer_notes: Optional[str] = None

class ReportResponse(BaseModel):
    id: int
    ticket_number: str
    issue_type: str
    title: str
    description: Optional[str] = None
    status: str
    latitude: float
    longitude: float
    address_hint: Optional[str] = None
    ward_id: Optional[str] = None
    ward_name: Optional[str] = None
    priority_score: float
    priority_level: str
    confidence_score: float
    assigned_department: str
    urgency_keywords: List[str] = []
    ai_explanation: Optional[Dict[str, Any]] = None
    image_url: Optional[str] = None
    yolo_detections: List[Dict[str, Any]] = []
    sla_hours: int
    created_at: datetime
    updated_at: datetime
    sla_deadline: datetime
    resolved_at: Optional[datetime] = None
    verified_at: Optional[datetime] = None
    sla_remaining_seconds: Optional[float] = None
    sla_status: Optional[str] = None # ok, warning, overdue

    class Config:
        from_attributes = True

class WardResponse(BaseModel):
    id: str
    name: str
    code: str
    zone: str
    center_lat: float
    center_lng: float
    polygon_geojson: Dict[str, Any]
    officer_in_charge: str
    contact_phone: str
    open_reports_count: int = 0
    resolved_reports_count: int = 0
    avg_priority_score: float = 0.0

    class Config:
        from_attributes = True

class DashboardKpiResponse(BaseModel):
    total_reports: int
    open_reports: int
    resolved_reports: int
    at_sla_risk: int
    avg_resolution_hours: float
    active_wards_count: int

class HotspotItem(BaseModel):
    id: int
    ticket_number: str
    issue_type: str
    latitude: float
    longitude: float
    priority_score: float
    priority_level: str
    status: str
    ward_name: Optional[str] = None
    created_at: datetime
