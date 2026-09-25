import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Layers, 
  LocateFixed, 
  Info,
  CheckCircle2
} from 'lucide-react';

export default function MapPicker({ 
  latitude, 
  longitude, 
  onChangeLocation, 
  wardName,
  readOnly = false,
  hotspots = [] 
}) {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [gpsSuccess, setGpsSuccess] = useState(false);

  // SVG coordinate system mapping:
  // City grid covers:
  // Lat: 37.730 to 37.820 (height ~ 0.09)
  // Lng: -122.470 to -122.370 (width ~ 0.10)
  const minLat = 37.730;
  const maxLat = 37.820;
  const minLng = -122.470;
  const maxLng = -122.370;

  const width = 600;
  const height = 360;

  // Convert lat/lng to SVG X/Y
  const getX = (lng) => Math.max(20, Math.min(width - 20, ((lng - minLng) / (maxLng - minLng)) * width));
  const getY = (lat) => Math.max(20, Math.min(height - 20, (1 - (lat - minLat) / (maxLat - minLat)) * height));

  // Convert SVG X/Y back to lat/lng on click
  const handleMapClick = (e) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedLng = minLng + (x / rect.width) * (maxLng - minLng);
    const clickedLat = minLat + (1 - (y / rect.height)) * (maxLat - minLat);

    onChangeLocation(
      Number(clickedLat.toFixed(5)),
      Number(clickedLng.toFixed(5))
    );
    setGpsSuccess(false);
  };

  // Browser Geolocation API
  const handleUseRealGps = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const { latitude: lat, longitude: lng } = pos.coords;
        onChangeLocation(
          Number(lat.toFixed(5)),
          Number(lng.toFixed(5))
        );
        setGpsSuccess(true);
        setTimeout(() => setGpsSuccess(false), 4000);
      },
      (err) => {
        setGpsLoading(false);
        setGpsError(err.message || "Failed to acquire GPS location. Using default city pin.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const currentX = getX(longitude);
  const currentY = getY(latitude);

  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      border: '1.5px solid var(--border-light)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Top Map Action Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        background: '#F8FAFC',
        borderBottom: '1px solid var(--border-light)',
        flexWrap: 'wrap',
        gap: '0.65rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: '#EFF6FF',
            padding: '0.35rem',
            borderRadius: '8px',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center'
          }}>
            <MapPin size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Interactive Stylized City Map
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {readOnly ? 'Click dots to view issues' : 'Click anywhere on grid to drop pin or use device GPS'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {!readOnly && (
            <button
              type="button"
              onClick={handleUseRealGps}
              disabled={gpsLoading}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              <Navigation size={14} className={gpsLoading ? "animate-spin" : ""} color="#2563EB" />
              {gpsLoading ? 'Acquiring GPS...' : 'Use My Real Location'}
            </button>
          )}

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: '#EFF6FF',
              color: '#1D4ED8',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid #BFDBFE'
            }}
            title="Open exact coordinate in external Google Maps"
          >
            <ExternalLink size={14} />
            Open in Google Maps
          </a>
        </div>
      </div>

      {/* GPS Status feedback message */}
      {gpsSuccess && (
        <div style={{
          background: '#ECFDF5',
          borderBottom: '1px solid #A7F3D0',
          padding: '0.4rem 1rem',
          fontSize: '0.75rem',
          color: '#059669',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={14} />
          Real device GPS coordinates locked successfully!
        </div>
      )}

      {gpsError && (
        <div style={{
          background: '#FEF2F2',
          borderBottom: '1px solid #FECACA',
          padding: '0.4rem 1rem',
          fontSize: '0.75rem',
          color: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <Info size={14} />
          {gpsError}
        </div>
      )}

      {/* Stylized SVG Interactive City Map */}
      <div 
        onClick={handleMapClick}
        style={{
          position: 'relative',
          width: '100%',
          height: '280px',
          background: '#F1F5F9',
          cursor: readOnly ? 'default' : 'crosshair',
          overflow: 'hidden'
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Base Urban Background */}
          <rect width={width} height={height} fill="#F8FAFC" />

          {/* Bay & Waterway */}
          <path
            d="M 0 0 L 600 0 L 600 70 C 450 65, 360 85, 240 70 C 120 55, 60 90, 0 80 Z"
            fill="#E0F2FE"
            stroke="#BAE6FD"
            strokeWidth="1.5"
          />
          <text x="320" y="45" fill="#0284C7" fontSize="11" fontWeight="700" opacity="0.6">
            NORTH MARINA BAY
          </text>

          {/* Urban Parks */}
          <rect x="50" y="160" width="130" height="90" rx="10" fill="#DCFCE7" stroke="#BBF7D0" strokeWidth="1" />
          <text x="75" y="210" fill="#15803D" fontSize="10" fontWeight="700" opacity="0.7">
            GREEN VALLEY PARK
          </text>

          <rect x="380" y="190" width="120" height="70" rx="8" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
          <text x="400" y="230" fill="#64748B" fontSize="10" fontWeight="700" opacity="0.6">
            TECH CORRIDOR
          </text>

          {/* City Grid Roads & Boulevards */}
          <g stroke="#E2E8F0" strokeWidth="3">
            <line x1="0" y1="120" x2="600" y2="120" />
            <line x1="0" y1="180" x2="600" y2="180" />
            <line x1="0" y1="260" x2="600" y2="260" />
            <line x1="0" y1="310" x2="600" y2="310" />

            <line x1="120" y1="0" x2="120" y2="360" />
            <line x1="220" y1="0" x2="220" y2="360" />
            <line x1="340" y1="0" x2="340" y2="360" />
            <line x1="460" y1="0" x2="460" y2="360" />
          </g>

          {/* Highway Artery */}
          <path
            d="M 0 290 Q 250 240, 600 300"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="5"
            strokeDasharray="8 4"
          />
          <text x="250" y="280" fill="#64748B" fontSize="9" fontWeight="600">
            METRO EXPRESSWAY 101
          </text>

          {/* Ward Boundary Labels */}
          <text x="240" y="150" fill="#475569" fontSize="11" fontWeight="800" opacity="0.45">
            DOWNTOWN CENTRAL
          </text>
          <text x="70" y="110" fill="#475569" fontSize="10" fontWeight="700" opacity="0.4">
            HARBOR & MARINA
          </text>
          <text x="240" y="340" fill="#475569" fontSize="10" fontWeight="700" opacity="0.4">
            INDUSTRIAL HUB
          </text>

          {/* Hotspot Points (Admin or Officer Mode) */}
          {hotspots.map((pt, idx) => {
            const hx = getX(pt.longitude);
            const hy = getY(pt.latitude);
            
            let dotColor = '#10B981'; // green
            if (pt.color === 'red' || pt.priority_level === 'HIGH') dotColor = '#EF4444';
            else if (pt.color === 'amber' || pt.priority_level === 'MEDIUM') dotColor = '#F59E0B';

            return (
              <g key={pt.id || idx} style={{ cursor: 'pointer' }}>
                <circle cx={hx} cy={hy} r="7" fill={dotColor} opacity="0.25" className="pulse-badge" />
                <circle cx={hx} cy={hy} r="4" fill={dotColor} stroke="#FFFFFF" strokeWidth="1.5" />
              </g>
            );
          })}

          {/* Active Reporter Dropped Pin */}
          <g transform={`translate(${currentX}, ${currentY})`}>
            {/* Animated Ripple */}
            <circle cx="0" cy="0" r="16" fill="#3B82F6" opacity="0.2" className="pulse-badge" />
            
            {/* Pin body */}
            <path
              d="M 0 0 C -9 -14 -9 -28 0 -28 C 9 -28 9 -14 0 0 Z"
              fill="#2563EB"
              stroke="#FFFFFF"
              strokeWidth="2"
              filter="drop-shadow(0px 3px 4px rgba(0,0,0,0.25))"
            />
            {/* Pin center white dot */}
            <circle cx="0" cy="-18" r="4" fill="#FFFFFF" />
          </g>
        </svg>

        {/* Floating Coordinates Tooltip */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '12px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '0.35rem 0.65rem',
          borderRadius: '8px',
          border: '1px solid var(--border-light)',
          fontSize: '0.72rem',
          boxShadow: 'var(--shadow-sm)',
          pointerEvents: 'none',
          display: 'flex',
          gap: '0.75rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Lat: </span>
            <strong>{latitude.toFixed(5)}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Lng: </span>
            <strong>{longitude.toFixed(5)}</strong>
          </div>
          {wardName && (
            <div style={{ color: '#2563EB', fontWeight: 700 }}>
              📍 {wardName}
            </div>
          )}
        </div>

        {!readOnly && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.92)',
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid var(--border-light)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            pointerEvents: 'none'
          }}>
            📍 Click map to reposition pin
          </div>
        )}
      </div>
    </div>
  );
}
