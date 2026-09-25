from datetime import datetime, timedelta
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import ReportModel, WardModel, DashboardKpiResponse
from app.services.spatial_service import calculate_hotspot_clusters

router = APIRouter(prefix="/admin", tags=["City Admin Dashboard"])

@router.get("/kpis", response_model=DashboardKpiResponse)
def get_dashboard_kpis(db: Session = Depends(get_db)):
    reports = db.query(ReportModel).all()
    now = datetime.utcnow()
    
    total = len(reports)
    open_reports = sum(1 for r in reports if r.status in ["NEW", "IN_PROGRESS"])
    resolved_reports = sum(1 for r in reports if r.status in ["RESOLVED", "VERIFIED_CLOSED"])
    
    # SLA risk = Open and deadline is within 4 hours (14,400s) or already overdue
    at_sla_risk = 0
    for r in reports:
        if r.status in ["NEW", "IN_PROGRESS"]:
            remaining = (r.sla_deadline - now).total_seconds()
            if remaining <= 14400: # 4 hours
                at_sla_risk += 1

    # Wards with open issues
    active_wards = len(set(r.ward_id for r in reports if r.status in ["NEW", "IN_PROGRESS"] and r.ward_id))

    return DashboardKpiResponse(
        total_reports=total,
        open_reports=open_reports,
        resolved_reports=resolved_reports,
        at_sla_risk=at_sla_risk,
        avg_resolution_hours=18.4,
        active_wards_count=active_wards
    )

@router.get("/hotspots")
def get_hotspot_map_data(db: Session = Depends(get_db)):
    reports = db.query(ReportModel).all()
    now = datetime.utcnow()

    points = []
    for r in reports:
        # Determine status color code according to product doc:
        # red = high, amber = medium, green = low or resolved
        if r.status in ["RESOLVED", "VERIFIED_CLOSED"]:
            color = "green"
            badge = "RESOLVED"
        elif r.priority_level == "HIGH":
            color = "red"
            badge = "HIGH"
        elif r.priority_level == "MEDIUM":
            color = "amber"
            badge = "MEDIUM"
        else:
            color = "green"
            badge = "LOW"

        remaining_hours = max(0, round((r.sla_deadline - now).total_seconds() / 3600, 1)) if r.status in ["NEW", "IN_PROGRESS"] else 0

        points.append({
            "id": r.id,
            "ticket_number": r.ticket_number,
            "issue_type": r.issue_type,
            "title": r.title,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "ward_name": r.ward_name,
            "priority_score": r.priority_score,
            "priority_level": r.priority_level,
            "color": color,
            "status": r.status,
            "assigned_department": r.assigned_department,
            "sla_remaining_hours": remaining_hours,
            "yolo_detections": r.yolo_detections or []
        })

    # Spatial clusters
    open_reports = [r for r in reports if r.status in ["NEW", "IN_PROGRESS"]]
    clusters = calculate_hotspot_clusters(open_reports)

    return {
        "points": points,
        "clusters": clusters,
        "total_active_points": len(open_reports)
    }

@router.get("/ward-breakdown")
def get_ward_breakdown(db: Session = Depends(get_db)):
    wards = db.query(WardModel).all()
    reports = db.query(ReportModel).all()

    breakdown = []
    for w in wards:
        ward_reports = [r for r in reports if r.ward_id == w.id]
        open_count = sum(1 for r in ward_reports if r.status in ["NEW", "IN_PROGRESS"])
        resolved_count = sum(1 for r in ward_reports if r.status in ["RESOLVED", "VERIFIED_CLOSED"])
        
        scores = [r.priority_score for r in ward_reports if r.status in ["NEW", "IN_PROGRESS"]]
        avg_score = round(sum(scores) / len(scores), 1) if scores else 0.0

        high_priority_count = sum(1 for r in ward_reports if r.status in ["NEW", "IN_PROGRESS"] and r.priority_level == "HIGH")

        breakdown.append({
            "ward_id": w.id,
            "ward_name": w.name,
            "ward_code": w.code,
            "zone": w.zone,
            "officer_in_charge": w.officer_in_charge,
            "open_count": open_count,
            "resolved_count": resolved_count,
            "total_count": len(ward_reports),
            "avg_priority_score": avg_score,
            "high_priority_count": high_priority_count,
            "center_lat": w.center_lat,
            "center_lng": w.center_lng,
            # Load metric: weighted formula of open count and average priority
            "load_index": round(open_count * (1 + avg_score / 10), 1)
        })

    # Sorted by load index descending so admin sees which ward needs attention first!
    breakdown.sort(key=lambda x: x["load_index"], reverse=True)
    return breakdown
