import re
import random
from typing import Dict, Any, List, Tuple
from app.models import AiExplanation, UrgencyKeywordMatch

# Base severity scores per issue type
ISSUE_BASE_SCORES: Dict[str, float] = {
    "traffic_signal": 6.8,       # High base: direct vehicular risk
    "infrastructure_damage": 6.2,# High base: structural instability
    "water_leakage": 5.4,        # Medium-high: resource loss / road subgrade damage
    "pothole": 4.8,              # Medium base: road safety hazard
    "streetlight_outage": 4.0,   # Medium base: nocturnal pedestrian risk
    "garbage_overflow": 3.2,     # Baseline sanitary concern
}

# Department routing by issue type
DEPARTMENT_ROUTING: Dict[str, str] = {
    "traffic_signal": "Department of Traffic Engineering & Signals",
    "infrastructure_damage": "Bureau of Civil & Structural Infrastructure",
    "water_leakage": "Municipal Water Supply & Drainage Authority",
    "pothole": "Department of Highways & Pavement Maintenance",
    "streetlight_outage": "Bureau of Public Lighting & Urban Grid",
    "garbage_overflow": "Department of Solid Waste Management & Sanitation",
}

# Urgency keywords with severity increments and contextual reasons
URGENCY_KEYWORDS: List[Dict[str, Any]] = [
    {
        "pattern": r"\b(school|preschool|kindergarten|campus|students?|children|kids?)\b",
        "keyword": "school zone / children presence",
        "weight": 2.2,
        "reason": "Vulnerable pedestrian population present in school perimeter."
    },
    {
        "pattern": r"\b(accident|collision|crash|injured|injury|ambulance|casualty)\b",
        "keyword": "accident / casualty risk",
        "weight": 2.8,
        "reason": "Direct active crash incident or immediate casualty reported."
    },
    {
        "pattern": r"\b(danger|hazardous|deadly|critical|fatal|peril)\b",
        "keyword": "hazard warning",
        "weight": 1.9,
        "reason": "Severe physical safety peril flagged by reporter."
    },
    {
        "pattern": r"\b(exposed wire|live wire|electric shock|sparking|short circuit)\b",
        "keyword": "live electrical wire",
        "weight": 3.2,
        "reason": "High-voltage electrocution hazard requiring emergency isolation."
    },
    {
        "pattern": r"\b(collapse|collapsed|falling|sinkhole|cracking bridge|cave-in)\b",
        "keyword": "structural collapse / sinkhole",
        "weight": 3.0,
        "reason": "Catastrophic structural failure risk to roadway or buildings."
    },
    {
        "pattern": r"\b(hospital|emergency room|er|clinic|ambulance route)\b",
        "keyword": "hospital corridor / emergency route",
        "weight": 2.0,
        "reason": "Impediment to emergency medical response path."
    },
    {
        "pattern": r"\b(flood|flooding|overflow|submerged|gushing|torrent)\b",
        "keyword": "flooding / rapid overflow",
        "weight": 1.7,
        "reason": "Rapid inundation causing urban disruption or property damage."
    },
    {
        "pattern": r"\b(deep|huge|massive|giant|blind spot)\b",
        "keyword": "extreme dimension / blind spot",
        "weight": 1.2,
        "reason": "Unusual scale aggravating normal baseline damage."
    },
    {
        "pattern": r"\b(elderly|senior|wheelchair|disability|blind)\b",
        "keyword": "accessibility barrier",
        "weight": 1.5,
        "reason": "Obstruction impairing disabled or senior mobility."
    }
]

def analyze_issue(
    issue_type: str, 
    description: str = "", 
    yolo_confidence: float = None
) -> Dict[str, Any]:
    """
    Simulated explainable AI classification engine:
    1. Base score by issue type
    2. NLP scan for urgency keywords
    3. Small model variance
    4. Deterministic score to priority (Low/Medium/High)
    5. SLA deadline calculation (7 days / 3 days / 24 hours)
    6. Department routing
    """
    clean_type = issue_type.lower().strip()
    base_score = ISSUE_BASE_SCORES.get(clean_type, 4.5)
    
    text = (description or "").lower()
    matched_keywords: List[Dict[str, Any]] = []
    keyword_boost = 0.0

    for item in URGENCY_KEYWORDS:
        if re.search(item["pattern"], text, re.IGNORECASE):
            matched_keywords.append({
                "keyword": item["keyword"],
                "weight": item["weight"],
                "reason": item["reason"]
            })
            keyword_boost += item["weight"]
    
    # Cap total keyword boost at +4.5 to keep range balanced
    keyword_boost = min(keyword_boost, 4.5)

    # Simulated model variance (+/- 0.2)
    # Using a deterministic hash based on text length and letters for reproducible score
    seed_val = sum(ord(c) for c in text) if text else 42
    rnd = random.Random(seed_val)
    variance = round(rnd.uniform(-0.15, 0.25), 2)

    raw_score = base_score + keyword_boost + variance
    final_score = max(1.0, min(10.0, round(raw_score, 1)))

    # Simulated model confidence (78% to 96%)
    if yolo_confidence is not None:
        confidence = round(max(0.75, min(0.98, (yolo_confidence + 0.85) / 2)), 2)
    else:
        confidence = round(rnd.uniform(0.82, 0.94), 2)

    # Map score to Priority badge and SLA
    if final_score >= 7.0:
        priority_level = "HIGH"
        sla_hours = 24  # 24 hours
        urgency_label = "Emergency / Critical"
    elif final_score >= 4.0:
        priority_level = "MEDIUM"
        sla_hours = 72  # 3 days
        urgency_label = "Elevated Municipal Attention"
    else:
        priority_level = "LOW"
        sla_hours = 168 # 7 days
        urgency_label = "Routine Maintenance Queue"

    # Department routing
    assigned_dept = DEPARTMENT_ROUTING.get(clean_type, "General Municipal Works Division")
    
    # Build rationale statement for explainable AI
    matched_names = [m["keyword"] for m in matched_keywords]
    if matched_names:
        rationale = (
            f"Assigned {priority_level} Priority ({final_score}/10). "
            f"Base severity {base_score} escalated by +{round(keyword_boost, 1)} "
            f"due to detected urgency signals: {', '.join(matched_names)}. "
            f"Auto-routed to {assigned_dept} under {sla_hours}h SLA."
        )
    else:
        rationale = (
            f"Assigned {priority_level} Priority ({final_score}/10). "
            f"Standard baseline for {clean_type.replace('_', ' ')} with no critical hazard words found. "
            f"Auto-routed to {assigned_dept} under {sla_hours}h SLA."
        )

    return {
        "issue_type": clean_type,
        "base_score": base_score,
        "keyword_boost": round(keyword_boost, 2),
        "matched_keywords": matched_keywords,
        "variance": variance,
        "final_score": final_score,
        "priority_level": priority_level,
        "confidence_score": confidence,
        "assigned_department": assigned_dept,
        "sla_hours": sla_hours,
        "urgency_label": urgency_label,
        "rationale": rationale,
        "flagged_keywords": [m["keyword"] for m in matched_keywords]
    }
