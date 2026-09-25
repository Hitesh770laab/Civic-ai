from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from app.models import ReportModel, WardModel
from app.services.spatial_service import CITY_WARDS
from app.services.ai_classifier import analyze_issue

SAMPLE_REPORTS_SEED = [
    {
        "issue_type": "traffic_signal",
        "title": "Malfunctioning Signal Head at Grand Ave & 5th St",
        "description": "Traffic lights are stuck flashing red in all directions right next to Lincoln Elementary School. Cars almost had an accident during morning drop-off, very dangerous situation.",
        "latitude": 37.7842,
        "longitude": -122.4071,
        "address_hint": "500 Grand Ave, Downtown Central",
        "status": "NEW",
        "hours_ago": 1.5,
        "target_sla_remaining_hours": 3.2 # Amber SLA risk! (<4h)
    },
    {
        "issue_type": "infrastructure_damage",
        "title": "Damaged Storm Drain Grate & Cavity on Sidewalk",
        "description": "Pedestrian sidewalk grate has cracked and caved in. Massive collapse hazard for pedestrians and seniors with walkers.",
        "latitude": 37.7865,
        "longitude": -122.4110,
        "address_hint": "320 Market Street, Downtown",
        "status": "IN_PROGRESS",
        "hours_ago": 22.0,
        "target_sla_remaining_hours": 2.0 # Amber SLA (<4h)
    },
    {
        "issue_type": "pothole",
        "title": "Deep Pothole with Exposed Rebar on 4th St",
        "description": "Deep asphalt crater expanding rapidly. Multiple vehicles hit it causing tire blowouts. Located right outside City Hospital emergency ambulance corridor.",
        "latitude": 37.7712,
        "longitude": -122.3985,
        "address_hint": "820 4th Street, Tech Corridor",
        "status": "NEW",
        "hours_ago": 0.8,
        "target_sla_remaining_hours": 23.2 # Plenty of time (>4h green)
    },
    {
        "issue_type": "water_leakage",
        "title": "Burst Underground Water Main Gushing onto Road",
        "description": "High pressure water pipe leaking heavily. Torrents of water flooding bicycle lane and spreading toward shop doorways.",
        "latitude": 37.8015,
        "longitude": -122.4342,
        "address_hint": "1420 Marina Blvd, Harbor District",
        "status": "IN_PROGRESS",
        "hours_ago": 18.0,
        "target_sla_remaining_hours": 54.0 # Plenty of time (green)
    },
    {
        "issue_type": "streetlight_outage",
        "title": "Three Consecutive Streetlights Dark Along Park Path",
        "description": "Dark stretch of urban walking path near playground. Creates a hazardous blind spot for night commuters.",
        "latitude": 37.7661,
        "longitude": -122.4468,
        "address_hint": "Park Heights Walkway, Green Valley",
        "status": "NEW",
        "hours_ago": 73.0,
        "target_sla_remaining_hours": -1.0 # Overdue SLA! (Red)
    },
    {
        "issue_type": "garbage_overflow",
        "title": "Public Waste Receptacle Overflowing with Commercial Bags",
        "description": "Recycling and general garbage cans spilling onto transit platform. Strong odors and plastic debris scattered.",
        "latitude": 37.7795,
        "longitude": -122.4490,
        "address_hint": "University Ave Transit Stop",
        "status": "NEW",
        "hours_ago": 12.0,
        "target_sla_remaining_hours": 156.0 # Low priority, 7-day SLA (green)
    },
    {
        "issue_type": "pothole",
        "title": "Sunken Pavement Seam Near Freight Loading Bay",
        "description": "Asphalt depression near industrial warehouse gate. Heavy trucks bounce aggressively.",
        "latitude": 37.7460,
        "longitude": -122.4085,
        "address_hint": "90 Cargo Way, Industrial Hub",
        "status": "RESOLVED",
        "hours_ago": 36.0,
        "target_sla_remaining_hours": 36.0
    },
    {
        "issue_type": "traffic_signal",
        "title": "Pedestrian Countdown Timer Blank at Crossing",
        "description": "Walk sign countdown display is non-functional, causing pedestrian confusion at high-volume crossing.",
        "latitude": 37.7830,
        "longitude": -122.4050,
        "address_hint": "Mission & 3rd St, Downtown",
        "status": "VERIFIED_CLOSED",
        "hours_ago": 48.0,
        "target_sla_remaining_hours": 24.0
    }
]

def seed_database(db: Session):
    # 1. Seed Wards if not present
    existing_wards = db.query(WardModel).count()
    if existing_wards == 0:
        for w in CITY_WARDS:
            ward_obj = WardModel(
                id=w["id"],
                name=w["name"],
                code=w["code"],
                zone=w["zone"],
                center_lat=w["center_lat"],
                center_lng=w["center_lng"],
                polygon_geojson=w["polygon_geojson"],
                officer_in_charge=w["officer_in_charge"],
                contact_phone=w["contact_phone"]
            )
            db.add(ward_obj)
        db.commit()

    # 2. Seed Reports if not present
    existing_reports = db.query(ReportModel).count()
    if existing_reports == 0:
        from app.services.spatial_service import find_ward_for_coordinate
        
        now = datetime.utcnow()
        ticket_seq = 1001

        for data in SAMPLE_REPORTS_SEED:
            ai_res = analyze_issue(data["issue_type"], data["description"])
            ward_id, ward_name = find_ward_for_coordinate(data["latitude"], data["longitude"])
            
            created_at = now - timedelta(hours=data["hours_ago"])
            
            # Compute SLA deadline based on target remaining hours
            if "target_sla_remaining_hours" in data:
                sla_deadline = now + timedelta(hours=data["target_sla_remaining_hours"])
            else:
                sla_deadline = created_at + timedelta(hours=ai_res["sla_hours"])

            resolved_at = created_at + timedelta(hours=14) if data["status"] in ["RESOLVED", "VERIFIED_CLOSED"] else None
            verified_at = resolved_at + timedelta(hours=2) if data["status"] == "VERIFIED_CLOSED" else None

            report = ReportModel(
                ticket_number=f"CIVIC-{now.year}-{ticket_seq}",
                issue_type=data["issue_type"],
                title=data["title"],
                description=data["description"],
                status=data["status"],
                latitude=data["latitude"],
                longitude=data["longitude"],
                address_hint=data["address_hint"],
                ward_id=ward_id,
                ward_name=ward_name,
                priority_score=ai_res["final_score"],
                priority_level=ai_res["priority_level"],
                confidence_score=ai_res["confidence_score"],
                assigned_department=ai_res["assigned_department"],
                urgency_keywords=ai_res["flagged_keywords"],
                ai_explanation=ai_res,
                sla_hours=ai_res["sla_hours"],
                created_at=created_at,
                updated_at=created_at,
                sla_deadline=sla_deadline,
                resolved_at=resolved_at,
                verified_at=verified_at,
                yolo_detections=[{
                    "label": data["issue_type"].replace("_", " ").title(),
                    "confidence": round(random.uniform(0.88, 0.96), 2),
                    "box": [100, 120, 480, 390]
                }]
            )
            db.add(report)
            ticket_seq += 1

        db.commit()
