import math
from typing import Dict, Any, List, Optional, Tuple
from shapely.geometry import Point, Polygon
from app.models import WardModel

# Realistic city boundaries with GeoJSON polygons
# Center around a modern metropolitan coordinate system (e.g., Lat: 37.7749, Lng: -122.4194)
CITY_WARDS = [
    {
        "id": "WARD-01",
        "name": "Downtown Central",
        "code": "DTC-01",
        "zone": "Commercial / Core",
        "center_lat": 37.7850,
        "center_lng": -122.4080,
        "officer_in_charge": "Capt. Marcus Vance",
        "contact_phone": "+1 (555) 234-9001",
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [-122.420, 37.780],
                [-122.400, 37.780],
                [-122.400, 37.795],
                [-122.420, 37.795],
                [-122.420, 37.780]
            ]]
        }
    },
    {
        "id": "WARD-02",
        "name": "Harbor & Marina District",
        "code": "HMD-02",
        "zone": "North Waterfront",
        "center_lat": 37.8020,
        "center_lng": -122.4350,
        "officer_in_charge": "Insp. Elena Rostova",
        "contact_phone": "+1 (555) 234-9002",
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [-122.450, 37.795],
                [-122.420, 37.795],
                [-122.420, 37.810],
                [-122.450, 37.810],
                [-122.450, 37.795]
            ]]
        }
    },
    {
        "id": "WARD-03",
        "name": "Tech Innovation Corridor",
        "code": "TIC-03",
        "zone": "South Urban",
        "center_lat": 37.7680,
        "center_lng": -122.3950,
        "officer_in_charge": "Eng. Tariq Al-Mansoor",
        "contact_phone": "+1 (555) 234-9003",
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [-122.410, 37.755],
                [-122.380, 37.755],
                [-122.380, 37.780],
                [-122.410, 37.780],
                [-122.410, 37.755]
            ]]
        }
    },
    {
        "id": "WARD-04",
        "name": "Green Valley & Park Heights",
        "code": "GVP-04",
        "zone": "West Residential",
        "center_lat": 37.7650,
        "center_lng": -122.4450,
        "officer_in_charge": "Sup. Sarah Jenkins",
        "contact_phone": "+1 (555) 234-9004",
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [-122.465, 37.750],
                [-122.430, 37.750],
                [-122.430, 37.780],
                [-122.465, 37.780],
                [-122.465, 37.750]
            ]]
        }
    },
    {
        "id": "WARD-05",
        "name": "University Campus & Arts",
        "code": "UCA-05",
        "zone": "East Cultural",
        "center_lat": 37.7780,
        "center_lng": -122.4500,
        "officer_in_charge": "Dir. Liam O'Connor",
        "contact_phone": "+1 (555) 234-9005",
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [-122.465, 37.780],
                [-122.435, 37.780],
                [-122.435, 37.795],
                [-122.465, 37.795],
                [-122.465, 37.780]
            ]]
        }
    },
    {
        "id": "WARD-06",
        "name": "Industrial Logistics Hub",
        "code": "ILH-06",
        "zone": "South-East Industrial",
        "center_lat": 37.7450,
        "center_lng": -122.4100,
        "officer_in_charge": "Cmdr. David Chen",
        "contact_phone": "+1 (555) 234-9006",
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [-122.430, 37.730],
                [-122.390, 37.730],
                [-122.390, 37.755],
                [-122.430, 37.755],
                [-122.430, 37.730]
            ]]
        }
    }
]

def find_ward_for_coordinate(lat: float, lng: float) -> Tuple[str, str]:
    """
    Performs Point-In-Polygon spatial lookup using Shapely (identical to PostGIS ST_Contains).
    Falls back to closest ward center by Euclidean distance if outside predefined polygons.
    """
    pt = Point(lng, lat)
    
    # 1. Exact containment check
    for w in CITY_WARDS:
        poly_coords = w["polygon_geojson"]["coordinates"][0]
        poly = Polygon(poly_coords)
        if poly.contains(pt):
            return w["id"], w["name"]

    # 2. Nearest ward center fallback
    def dist(w):
        return math.hypot(w["center_lat"] - lat, w["center_lng"] - lng)

    closest_ward = min(CITY_WARDS, key=dist)
    return closest_ward["id"], closest_ward["name"]

def calculate_hotspot_clusters(reports: List[Any], grid_size: float = 0.005) -> List[Dict[str, Any]]:
    """
    Clusters reports into spatial grid cells to visualize high-density problem zones.
    """
    clusters = {}
    for r in reports:
        # Snap lat/lng to grid
        grid_lat = round(r.latitude / grid_size) * grid_size
        grid_lng = round(r.longitude / grid_size) * grid_size
        key = (grid_lat, grid_lng)

        if key not in clusters:
            clusters[key] = {
                "center_lat": grid_lat,
                "center_lng": grid_lng,
                "count": 0,
                "high_priority_count": 0,
                "avg_priority": 0.0,
                "total_score": 0.0,
                "reports": []
            }
        
        c = clusters[key]
        c["count"] += 1
        c["total_score"] += r.priority_score
        if r.priority_score >= 7.0:
            c["high_priority_count"] += 1
        c["reports"].append({
            "id": r.id,
            "ticket_number": r.ticket_number,
            "issue_type": r.issue_type,
            "score": r.priority_score,
            "status": r.status
        })

    result = []
    for (lat, lng), data in clusters.items():
        data["avg_priority"] = round(data["total_score"] / data["count"], 1)
        del data["total_score"]
        result.append(data)

    return sorted(result, key=lambda x: (x["high_priority_count"], x["count"]), reverse=True)
