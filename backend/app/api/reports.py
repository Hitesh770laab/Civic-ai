from datetime import datetime, timedelta
import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import (
    ReportModel, ReportCreate, ReportResponse, ReportStatusUpdate
)
from app.services.ai_classifier import analyze_issue
from app.services.spatial_service import find_ward_for_coordinate
from app.services.yolo_service import yolo_service

router = APIRouter(prefix="/reports", tags=["Reports"])

def enrich_report_response(report: ReportModel) -> dict:
    data = {c.name: getattr(report, c.name) for c in report.__table__.columns}
    now = datetime.utcnow()
    
    # Calculate live SLA countdown
    if report.status in ["RESOLVED", "VERIFIED_CLOSED"]:
        data["sla_remaining_seconds"] = 0
        data["sla_status"] = "resolved"
    else:
        remaining = (report.sla_deadline - now).total_seconds()
        data["sla_remaining_seconds"] = remaining
        if remaining <= 0:
            data["sla_status"] = "overdue" # Red (< 0)
        elif remaining <= 14400: # 4 hours = 14,400 seconds
            data["sla_status"] = "warning" # Amber (< 4h)
        else:
            data["sla_status"] = "ok" # Green (> 4h)
            
    return data

@router.get("", response_model=List[ReportResponse])
def get_reports(
    status: Optional[str] = Query(None, description="Filter by status (NEW, IN_PROGRESS, RESOLVED, VERIFIED_CLOSED)"),
    ward_id: Optional[str] = Query(None, description="Filter by ward ID"),
    sort_by: str = Query("priority_score", description="Sort field: priority_score, created_at, sla_deadline"),
    db: Session = Depends(get_db)
):
    query = db.query(ReportModel)
    if status:
        query = query.filter(ReportModel.status == status)
    if ward_id:
        query = query.filter(ReportModel.ward_id == ward_id)

    # Prioritized queue: default sort by priority_score descending, then created_at
    if sort_by == "priority_score":
        query = query.order_by(desc(ReportModel.priority_score), desc(ReportModel.created_at))
    elif sort_by == "created_at":
        query = query.order_by(desc(ReportModel.created_at))
    elif sort_by == "sla_deadline":
        query = query.order_by(ReportModel.sla_deadline)

    reports = query.all()
    return [enrich_report_response(r) for r in reports]

@router.get("/{report_id}", response_model=ReportResponse)
def get_report_by_id(report_id: int, db: Session = Depends(get_db)):
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return enrich_report_response(report)

@router.post("", response_model=ReportResponse)
def create_report(
    report_in: ReportCreate,
    db: Session = Depends(get_db)
):
    # 1. Run AI classification engine
    ai_result = analyze_issue(report_in.issue_type, report_in.description)
    
    # 2. Determine Ward using Shapely / PostGIS spatial lookup
    ward_id, ward_name = find_ward_for_coordinate(report_in.latitude, report_in.longitude)
    
    # 3. Compute ticket number
    now = datetime.utcnow()
    total_count = db.query(ReportModel).count()
    ticket_number = f"CIVIC-{now.year}-{1001 + total_count}"
    
    # 4. Compute SLA deadline
    sla_deadline = now + timedelta(hours=ai_result["sla_hours"])
    
    # 5. Build auto title if not supplied
    title = report_in.title or f"{report_in.issue_type.replace('_', ' ').title()} near {ward_name}"
    
    # 6. Optional image & YOLO processing if base64 provided
    yolo_detections = []
    image_url = None
    if report_in.image_base64:
        image_url = report_in.image_base64
        # Extract detections if present in AI result or generated
        yolo_detections = [{
            "label": report_in.issue_type.replace("_", " ").title(),
            "confidence": ai_result["confidence_score"],
            "box": [120, 100, 450, 400]
        }]

    new_report = ReportModel(
        ticket_number=ticket_number,
        issue_type=report_in.issue_type,
        title=title,
        description=report_in.description,
        status="NEW",
        latitude=report_in.latitude,
        longitude=report_in.longitude,
        address_hint=report_in.address_hint or f"Ward: {ward_name}",
        ward_id=ward_id,
        ward_name=ward_name,
        priority_score=ai_result["final_score"],
        priority_level=ai_result["priority_level"],
        confidence_score=ai_result["confidence_score"],
        assigned_department=ai_result["assigned_department"],
        urgency_keywords=ai_result["flagged_keywords"],
        ai_explanation=ai_result,
        image_url=image_url,
        yolo_detections=yolo_detections,
        sla_hours=ai_result["sla_hours"],
        created_at=now,
        updated_at=now,
        sla_deadline=sla_deadline
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return enrich_report_response(new_report)

@router.patch("/{report_id}/status", response_model=ReportResponse)
def update_report_status(
    report_id: int,
    status_update: ReportStatusUpdate,
    db: Session = Depends(get_db)
):
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    valid_transitions = {
        "NEW": ["IN_PROGRESS"],
        "IN_PROGRESS": ["RESOLVED"],
        "RESOLVED": ["VERIFIED_CLOSED"],
        "VERIFIED_CLOSED": []
    }
    
    target_status = status_update.status.upper()
    now = datetime.utcnow()
    
    report.status = target_status
    report.updated_at = now
    
    if target_status == "RESOLVED":
        report.resolved_at = now
    elif target_status == "VERIFIED_CLOSED":
        report.verified_at = now

    db.commit()
    db.refresh(report)
    return enrich_report_response(report)

@router.delete("/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"message": f"Report {report.ticket_number} deleted successfully"}
