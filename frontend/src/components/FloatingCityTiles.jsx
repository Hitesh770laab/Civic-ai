import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertTriangle, MapPin, Clock, TrendingUp, Zap } from 'lucide-react';

const CITY_DATA = [
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.076,
    lng: 72.877,
    potholes: '65,000+',
    severity: 'critical',
    color: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.3)',
    emoji: '🕳️',
    delay: '45 days',
    civicAi: '2–8h',
    fact: 'Coastal rainfall tarmac erosion',
    posX: 22,
    posY: 58,
  },
  {
    city: 'Delhi-NCR',
    state: 'Delhi',
    lat: 28.704,
    lng: 77.102,
    potholes: '52,000+',
    severity: 'high',
    color: '#F97316',
    glow: 'rgba(249, 115, 22, 0.3)',
    emoji: '🚧',
    delay: '42 days',
    civicAi: '3–10h',
    fact: 'Dense arterial flyover intersections',
    posX: 38,
    posY: 18,
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.971,
    lng: 77.594,
    potholes: '48,000+',
    severity: 'high',
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.3)',
    emoji: '⚠️',
    delay: '38 days',
    civicAi: '4–12h',
    fact: 'Monsoon outer-ring road hotspot',
    posX: 40,
    posY: 75,
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.385,
    lng: 78.486,
    potholes: '34,000+',
    severity: 'medium',
    color: '#22D3EE',
    glow: 'rgba(34, 211, 238, 0.3)',
    emoji: '🛠️',
    delay: '30 days',
    civicAi: '4–8h',
    fact: 'IT corridor utility trenches',
    posX: 42,
    posY: 55,
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.082,
    lng: 80.270,
    potholes: '38,000+',
    severity: 'medium',
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.3)',
    emoji: '🌊',
    delay: '35 days',
    civicAi: '3–10h',
    fact: 'Flood-prone storm surge zones',
    posX: 52,
    posY: 80,
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    lat: 22.572,
    lng: 88.363,
    potholes: '41,000+',
    severity: 'high',
    color: '#F43F5E',
    glow: 'rgba(244, 63, 94, 0.3)',
    emoji: '🚗',
    delay: '48 days',
    civicAi: '6–14h',
    fact: 'Aging colonial road infrastructure',
    posX: 68,
    posY: 38,
  },
];

const FLOAT_DELAYS = [0, 0.5, 1.2, 1.8, 0.3, 0.9];
const FLOAT_DURATIONS = [6, 7.5, 5.5, 8, 6.5, 7];

export default function FloatingCityTiles({ onCityClick }) {
  const [activeTile, setActiveTile] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '520px',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Ambient glow spots */}
      {CITY_DATA.map((c, i) => (
        <div
          key={`glow-${i}`}
          style={{
            position: 'absolute',
            left: `${c.posX}%`,
            top: `${c.posY}%`,
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            opacity: activeTile === i ? 0.8 : 0.3,
            transition: 'opacity 0.5s ease',
          }}
        />
      ))}

      {/* Floating connection lines (SVG) */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.15,
        }}
      >
        {CITY_DATA.map((c, i) => {
          const next = CITY_DATA[(i + 1) % CITY_DATA.length];
          return (
            <line
              key={`line-${i}`}
              x1={`${c.posX}%`}
              y1={`${c.posY}%`}
              x2={`${next.posX}%`}
              y2={`${next.posY}%`}
              stroke="rgba(56, 189, 248, 0.5)"
              strokeWidth="1"
              strokeDasharray="5,5"
              style={{ animation: 'dashMove 2s linear infinite' }}
            />
          );
        })}
      </svg>

      {/* 3D Floating Tiles */}
      {CITY_DATA.map((city, i) => {
        const isActive = activeTile === i;
        const parallaxX = (mousePos.x - 0.5) * (isActive ? 8 : 3);
        const parallaxY = (mousePos.y - 0.5) * (isActive ? 8 : 3);

        return (
          <div
            key={city.city}
            onMouseEnter={() => setActiveTile(i)}
            onMouseLeave={() => setActiveTile(null)}
            onClick={() => onCityClick?.(city)}
            style={{
              position: 'absolute',
              left: `${city.posX}%`,
              top: `${city.posY}%`,
              transform: `
                translate(-50%, -50%)
                perspective(1000px)
                rotateX(${-parallaxY}deg)
                rotateY(${parallaxX}deg)
                translateZ(${isActive ? 30 : 0}px)
                scale(${isActive ? 1.12 : 1})
              `,
              width: isActive ? '230px' : '190px',
              zIndex: isActive ? 20 : 5 + i,
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              animation: `float ${FLOAT_DURATIONS[i]}s ease-in-out ${FLOAT_DELAYS[i]}s infinite`,
              cursor: 'pointer',
            }}
          >
            {/* Card Body */}
            <div
              style={{
                background: isActive
                  ? `linear-gradient(135deg, rgba(16, 38, 64, 0.95), rgba(13, 29, 49, 0.88))`
                  : 'rgba(13, 29, 49, 0.78)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${isActive ? city.color + '60' : 'rgba(56, 189, 248, 0.16)'}`,
                borderRadius: '16px',
                padding: isActive ? '1rem' : '0.8rem',
                boxShadow: isActive
                  ? `0 20px 50px -10px ${city.glow}, 0 0 30px ${city.glow}`
                  : '0 8px 30px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top bar color accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${city.color}, transparent)`,
                }}
              />

              {/* Scan line effect when active */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${city.color}80, transparent)`,
                    animation: 'scanLine 2s linear infinite',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>{city.emoji}</span>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#F1F5F9' }}>
                      {city.city}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 600 }}>
                      {city.state}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: city.color,
                    boxShadow: `0 0 10px ${city.color}`,
                    animation: 'pulseDot 2s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                padding: '0.4rem 0.6rem',
                marginBottom: isActive ? '0.5rem' : 0,
              }}>
                <div>
                  <div style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    Potholes/yr
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: city.color }}>
                    {city.potholes}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    CivicAI
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4ADE80' }}>
                    {city.civicAi}
                  </div>
                </div>
              </div>

              {/* Expanded details when active */}
              {isActive && (
                <div style={{
                  animation: 'fadeUp 0.3s ease-out',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.68rem',
                    color: '#94A3B8',
                    marginBottom: '0.3rem',
                  }}>
                    <Clock size={10} />
                    <span>Old delay: <span style={{ textDecoration: 'line-through', color: '#64748B' }}>{city.delay}</span></span>
                  </div>
                  <div style={{
                    fontSize: '0.68rem',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}>
                    <MapPin size={10} color={city.color} />
                    <span>{city.fact}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Center India Label */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '45%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <div
          className="text-gradient-watermark"
          style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 1,
          }}
        >
          INDIA
        </div>
        <div
          style={{
            fontSize: '0.7rem',
            color: 'rgba(100, 116, 139, 0.5)',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginTop: '0.25rem',
          }}
        >
          Pothole Crisis Map
        </div>
      </div>
    </div>
  );
}
