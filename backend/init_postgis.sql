-- Enable PostGIS spatial extension in PostgreSQL
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Confirm PostGIS version
SELECT PostGIS_Full_Version();

-- Spatial Ward table with PostGIS geometry
CREATE TABLE IF NOT EXISTS spatial_wards (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    code VARCHAR(16) NOT NULL,
    zone VARCHAR(64) DEFAULT 'Central',
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    geom geometry(Polygon, 4326),
    officer_in_charge VARCHAR(128),
    contact_phone VARCHAR(32)
);

CREATE INDEX IF NOT EXISTS idx_spatial_wards_geom ON spatial_wards USING GIST (geom);

-- Spatial Reports table with point geometry
CREATE TABLE IF NOT EXISTS spatial_reports (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(32) UNIQUE NOT NULL,
    issue_type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(32) DEFAULT 'NEW',
    geom geometry(Point, 4326),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address_hint VARCHAR(255),
    ward_id VARCHAR(64),
    ward_name VARCHAR(128),
    priority_score DOUBLE PRECISION DEFAULT 5.0,
    priority_level VARCHAR(16) DEFAULT 'MEDIUM',
    confidence_score DOUBLE PRECISION DEFAULT 0.85,
    assigned_department VARCHAR(128) NOT NULL,
    urgency_keywords JSONB DEFAULT '[]'::jsonb,
    ai_explanation JSONB DEFAULT '{}'::jsonb,
    yolo_detections JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    sla_hours INTEGER DEFAULT 72,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    sla_deadline TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    resolved_at TIMESTAMP WITHOUT TIME ZONE,
    verified_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_spatial_reports_geom ON spatial_reports USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_spatial_reports_priority ON spatial_reports (priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_spatial_reports_status ON spatial_reports (status);
