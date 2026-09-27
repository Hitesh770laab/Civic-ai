import React, { useState } from 'react';
import {
  Camera, ShieldAlert, BarChart3, AlertTriangle,
  Sparkles, Zap, ArrowRight, CheckCircle2,
  Clock, Volume2, Activity, Layers, ChevronRight
} from 'lucide-react';
import { playSound } from '../services/voiceAssistant';

export default function HomeView({ onNavigate }) {
  const [selectedCity, setSelectedCity] = useState('bengaluru');

  const cityHighlights = {
    bengaluru: {
      name: 'Bengaluru (BBMP)',
      state: 'Karnataka',
      potholes: '48,000+ logged/yr',
      delay: '38 days',
      civicAi: '4 - 12 hours',
      tag: 'Monsoon outer-ring road hotspot',
    },
    mumbai: {
      name: 'Mumbai (BMC)',
      state: 'Maharashtra',
      potholes: '65,000+ logged/yr',
      delay: '45 days',
      civicAi: '2 - 8 hours',
      tag: 'High coastal rainfall tarmac wear',
    },
    delhi: {
      name: 'Delhi-NCR (MCD)',
      state: 'Delhi',
      potholes: '52,000+ logged/yr',
      delay: '42 days',
      civicAi: '3 - 10 hours',
      tag: 'Dense arterial flyover intersections',
    },
    hyderabad: {
      name: 'Hyderabad (GHMC)',
      state: 'Telangana',
      potholes: '34,000+ logged/yr',
      delay: '30 days',
      civicAi: '4 - 8 hours',
      tag: 'IT corridor expansion & utility trenches',
    },
  };

  const city = cityHighlights[selectedCity] || cityHighlights.bengaluru;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1160px', margin: '0 auto', padding: '0 1rem' }}>
      
      {/* ── HIGH-TECH HERO BANNER (CIVIC DARK + NEON CYAN/EMERALD) ──── */}
      <section style={{
        background: 'linear-gradient(135deg, #0B0F19 0%, #0F172A 55%, #1E1B4B 100%)',
        borderRadius: '24px',
        padding: '2.75rem 2rem',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px -15px rgba(11, 15, 25, 0.5), 0 0 30px rgba(14, 165, 233, 0.15)',
      }}>
        {/* Subtle glowing ambient lights */}
        <div style={{
          position: 'absolute', top: '-20%', right: '10%',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '5%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Left Column: Hero Text */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(14, 165, 233, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#38BDF8',
              letterSpacing: '0.04em',
              marginBottom: '1.25rem',
            }}>
              <Sparkles size={13} color="#38BDF8" />
              <span>INDIA SMART CITIES · EXPLAINABLE CIVIC AI</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: '#FFFFFF',
              marginBottom: '1rem',
            }}>
              Fixing Broken Roads &amp; Civic Hazards with{' '}
              <span style={{
                background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #34D399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Autonomous Vision
              </span>
            </h1>

            <p style={{
              fontSize: '1rem',
              color: '#94A3B8',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
              maxWidth: '520px',
            }}>
              CivicAI instantly classifies road potholes, garbage heaps, and broken streetlights via <strong>YOLOv8 vision</strong>, maps coordinates to <strong>municipal ward polygons</strong>, and slashes 45-day delays to <strong>2–24h SLA resolutions</strong>.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => {
                  playSound('click');
                  onNavigate('citizen');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
                  color: '#FFFFFF',
                  padding: '0.85rem 1.5rem',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 18px rgba(14, 165, 233, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <Camera size={19} />
                <span>Report Defect (AI Scan)</span>
                <ArrowRight size={17} />
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  onNavigate('officer');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#FCD34D',
                  border: '1px solid rgba(252, 211, 77, 0.3)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
              >
                <ShieldAlert size={17} />
                <span>Field SLA Queue</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live AI Scanner Hologram Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '18px',
            padding: '1.5rem',
            boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
            position: 'relative',
          }}>
            {/* Live Scan Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#22C55E', boxShadow: '0 0 10px #22C55E',
                }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E2E8F0' }}>
                  YOLOv8 Live Vision Inference
                </span>
              </div>
              <span style={{
                fontSize: '0.68rem', fontWeight: 700,
                color: '#38BDF8', background: 'rgba(56, 189, 248, 0.15)',
                padding: '0.15rem 0.5rem', borderRadius: '999px',
              }}>
                Latency: 0.38s
              </span>
            </div>

            {/* Mock Visual Box */}
            <div style={{
              background: '#0B0F19',
              borderRadius: '12px',
              border: '1.5px dashed #0EA5E9',
              padding: '1.25rem',
              position: 'relative',
              marginBottom: '1rem',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '8px', right: '10px',
                background: '#DC2626', color: '#fff',
                fontSize: '0.65rem', fontWeight: 800,
                padding: '0.15rem 0.5rem', borderRadius: '4px',
              }}>
                HIGH HAZARD
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.6rem' }}>🕳️</span>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#F8FAFC' }}>
                    Deep Asphalt Pothole Detected
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                    Bounding Box Confidence: <strong style={{ color: '#34D399' }}>94.6%</strong>
                  </div>
                </div>
              </div>

              {/* Formula Strip */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                fontSize: '0.72rem',
                color: '#CBD5E1',
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '0.5rem',
              }}>
                <span>Score: <strong>8.8 / 10</strong></span>
                <span>Ward: <strong>Ward 104 Central</strong></span>
                <span style={{ color: '#F87171', fontWeight: 700 }}>SLA: <strong>2 Hours</strong></span>
              </div>
            </div>

            {/* Quick stats bottom */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={13} color="#34D399" /> PostGIS Geofenced
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Volume2 size={13} color="#38BDF8" /> Multilingual Ready
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 COMPACT STAT TILES (CRISP MIXED PALETTE) ──────────── */}
      <section>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}>
          {/* Card 1: MoRTH Deaths */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #FEE2E2',
            borderRadius: '16px',
            padding: '1.25rem',
            boxShadow: '0 2px 10px rgba(220, 38, 38, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#DC2626', background: '#FEF2F2', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                ROAD SAFETY CRISIS
              </span>
              <AlertTriangle size={15} color="#DC2626" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', marginTop: '0.2rem' }}>
              3,500+
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>
              Annual Pothole Deaths in India
            </div>
            <div style={{ fontSize: '0.74rem', color: '#6B7280', lineHeight: 1.4 }}>
              Official MoRTH records. 72% involve two-wheeler motorists.
            </div>
          </div>

          {/* Card 2: Active Potholes */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #FEF3C7',
            borderRadius: '16px',
            padding: '1.25rem',
            boxShadow: '0 2px 10px rgba(217, 119, 6, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D97706', background: '#FFFBEB', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                MONSOON DEFICIT
              </span>
              <Activity size={15} color="#D97706" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', marginTop: '0.2rem' }}>
              2.5 Crore+
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>
              Potholes Formed Annually
            </div>
            <div style={{ fontSize: '0.74rem', color: '#6B7280', lineHeight: 1.4 }}>
              Across 6.3M km of urban corridors &amp; national highway networks.
            </div>
          </div>

          {/* Card 3: AI Turnaround Speed */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #BBF7D0',
            borderRadius: '16px',
            padding: '1.25rem',
            boxShadow: '0 2px 10px rgba(22, 163, 74, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', background: '#F0FDF4', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                96% FASTER SLA
              </span>
              <Clock size={15} color="#16A34A" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#16A34A', marginTop: '0.2rem' }}>
              2h – 24h
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>
              CivicAI Repair Resolution
            </div>
            <div style={{ fontSize: '0.74rem', color: '#6B7280', lineHeight: 1.4 }}>
              Replaces the traditional 45-day bureaucratic paper delays.
            </div>
          </div>

          {/* Card 4: Solid Waste & Floods */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #BFDBFE',
            borderRadius: '16px',
            padding: '1.25rem',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                SANIDRIVE VISION
              </span>
              <Layers size={15} color="#2563EB" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', marginTop: '0.2rem' }}>
              62M Tonnes
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>
              Annual Municipal Solid Waste
            </div>
            <div style={{ fontSize: '0.74rem', color: '#6B7280', lineHeight: 1.4 }}>
              31M+ tonnes openly dumped, blocking stormwater drains.
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPACT 3-STEP CIVICAI WORKFLOW ─────────────────────── */}
      <section style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              color: '#0EA5E9', fontSize: '0.72rem', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              <Zap size={13} /> Automated Urban Pipeline
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
              How CivicAI Works in 3 Steps
            </h2>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onNavigate('india_stats');
            }}
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
            }}
          >
            <span>Explore In-Depth Indian Data</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {/* Step 1 */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '1.25rem',
            position: 'relative',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
              color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.75rem',
            }}>
              1
            </div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
              Snap Photo or Speak in Voice
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
              Citizens upload a photo or speak in <strong>Hindi, English, or Spanish</strong>. YOLOv8 scans defect coordinates in 400ms.
            </p>
          </div>

          {/* Step 2 */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '1.25rem',
            position: 'relative',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.75rem',
            }}>
              2
            </div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
              Spatial Ward &amp; SLA Triage
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
              PostGIS locks coordinates inside municipal ward boundary polygons. The 4-factor formula assigns dynamic 2h to 24h SLA timers.
            </p>
          </div>

          {/* Step 3 */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '1.25rem',
            position: 'relative',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.75rem',
            }}>
              3
            </div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
              Field Officer 1-Tap Resolution
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
              Repair crews receive prioritized work orders on mobile. Issues transition from <code>NEW</code> ➔ <code>RESOLVED</code> instantly.
            </p>
          </div>
        </div>
      </section>

      {/* ── CITY IMPACT STRIP (COMPACT PILLS) ──────────────────── */}
      <section style={{
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '18px',
        padding: '1.5rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
              Live Metro City Hotspot Tracking
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Comparing traditional municipal response against CivicAI SLA dispatch.
            </p>
          </div>

          {/* City Switcher */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {Object.keys(cityHighlights).map((key) => {
              const isSelected = selectedCity === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    playSound('click');
                    setSelectedCity(key);
                  }}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: isSelected ? '#2563EB' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    border: '1px solid',
                    borderColor: isSelected ? '#2563EB' : '#CBD5E1',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {key}
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact City Banner */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
              {city.name} <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>({city.state})</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Profile: {city.tag}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>ANNUAL DEFECTS</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#DC2626' }}>{city.potholes}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>OLD DELAY</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6B7280', textDecoration: 'line-through' }}>{city.delay}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#16A34A', fontWeight: 700 }}>CIVICAI SPEED</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#16A34A' }}>{city.civicAi}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK DIRECT LAUNCHERS (3 CARDS) ───────────────────── */}
      <section>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}>
          {/* Card 1: Citizen View */}
          <div
            onClick={() => { playSound('click'); onNavigate('citizen'); }}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #DBEAFE',
              borderRadius: '14px',
              padding: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563EB';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#DBEAFE';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '0.75rem',
              }}>
                <Camera size={20} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                Citizen AI Reporting
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                Instant photo upload, YOLOv8 bounding boxes, and Hindi/English voice reporting.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#2563EB', fontWeight: 700, fontSize: '0.78rem', marginTop: '1rem' }}>
              <span>Report Issue</span> <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 2: Field Officer */}
          <div
            onClick={() => { playSound('click'); onNavigate('officer'); }}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #FEF3C7',
              borderRadius: '14px',
              padding: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#D97706';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#FEF3C7';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '0.75rem',
              }}>
                <ShieldAlert size={20} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                Field Officer SLA Queue
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                Prioritized queue with dynamic countdown timers (2h, 6h, 12h, 24h) and 1-tap resolution.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#D97706', fontWeight: 700, fontSize: '0.78rem', marginTop: '1rem' }}>
              <span>Open Queue</span> <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 3: Admin Ops */}
          <div
            onClick={() => { playSound('click'); onNavigate('admin'); }}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #DCFCE7',
              borderRadius: '14px',
              padding: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#16A34A';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#DCFCE7';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '0.75rem',
              }}>
                <BarChart3 size={20} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                City Admin Dashboard
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                Ward density heatmaps, PostGIS spatial clusters, and 4-factor mathematical breakdown.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16A34A', fontWeight: 700, fontSize: '0.78rem', marginTop: '1rem' }}>
              <span>Open Dashboard</span> <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
