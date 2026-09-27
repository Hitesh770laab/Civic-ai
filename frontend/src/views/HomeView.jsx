import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, ShieldAlert, BarChart3, AlertTriangle,
  Sparkles, Zap, ArrowRight, CheckCircle2,
  Clock, Volume2, Activity, Layers, ChevronRight,
  MapPin, Eye, Shield, Cpu, Globe2, Target
} from 'lucide-react';
import { playSound } from '../services/voiceAssistant';
import { useScrollRevealAll, useCountUp, useMouseParallax } from '../hooks/useAnimations';
import FloatingCityTiles from '../components/FloatingCityTiles';

/* ─── Animated Counter Component ─── */
function AnimatedNumber({ value, suffix = '', prefix = '', color, size = '2.2rem' }) {
  const numericValue = parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;
  const [count, ref] = useCountUp(numericValue, 2200);

  return (
    <div ref={ref} style={{ fontSize: size, fontWeight: 900, color, letterSpacing: '-0.03em' }}>
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

export default function HomeView({ onNavigate }) {
  const [selectedCity, setSelectedCity] = useState('bengaluru');
  const heroParallax = useMouseParallax(8);

  // Activate scroll reveals
  useScrollRevealAll('scroll-reveal');
  useScrollRevealAll('scroll-reveal-left');
  useScrollRevealAll('scroll-reveal-right');
  useScrollRevealAll('scroll-reveal-scale');

  const cityHighlights = {
    bengaluru: {
      name: 'Bengaluru (BBMP)', state: 'Karnataka',
      potholes: '48,000+ logged/yr', delay: '38 days', civicAi: '4 - 12 hours',
      tag: 'Monsoon outer-ring road hotspot',
    },
    mumbai: {
      name: 'Mumbai (BMC)', state: 'Maharashtra',
      potholes: '65,000+ logged/yr', delay: '45 days', civicAi: '2 - 8 hours',
      tag: 'High coastal rainfall tarmac wear',
    },
    delhi: {
      name: 'Delhi-NCR (MCD)', state: 'Delhi',
      potholes: '52,000+ logged/yr', delay: '42 days', civicAi: '3 - 10 hours',
      tag: 'Dense arterial flyover intersections',
    },
    hyderabad: {
      name: 'Hyderabad (GHMC)', state: 'Telangana',
      potholes: '34,000+ logged/yr', delay: '30 days', civicAi: '4 - 8 hours',
      tag: 'IT corridor expansion & utility trenches',
    },
  };

  const city = cityHighlights[selectedCity] || cityHighlights.bengaluru;

  const workflowSteps = [
    {
      num: '01',
      title: 'Snap or Speak',
      desc: 'Citizens upload a photo or speak in Hindi, English, or Spanish. YOLOv8 scans defect coordinates in 400ms.',
      icon: Camera,
      gradient: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
      glow: 'rgba(14, 165, 233, 0.25)',
    },
    {
      num: '02',
      title: 'Spatial Ward Triage',
      desc: 'PostGIS locks coordinates inside municipal ward boundary polygons. 4-factor formula assigns dynamic SLA timers.',
      icon: Target,
      gradient: 'linear-gradient(135deg, #10B981, #0284C7)',
      glow: 'rgba(16, 185, 129, 0.25)',
    },
    {
      num: '03',
      title: '1-Tap Resolution',
      desc: 'Repair crews receive prioritized work orders on mobile. Issues transition from NEW ➔ RESOLVED instantly.',
      icon: Shield,
      gradient: 'linear-gradient(135deg, #059669, #10B981)',
      glow: 'rgba(16, 185, 129, 0.25)',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: IMMERSIVE HERO
      ═══════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '0 1rem',
        }}
      >
        {/* Mesh gradient background - Green & Blue Auroral */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 20% 40%, rgba(16, 185, 129, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 30%, rgba(14, 165, 233, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse 70% 40% at 50% 80%, rgba(37, 99, 235, 0.10) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage:
            'linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
        }} />

        {/* Orbiting particles */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`particle-${i}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: ['#34D399', '#38BDF8', '#10B981'][i],
              boxShadow: `0 0 15px ${['#34D399', '#38BDF8', '#10B981'][i]}`,
              animation: `orbit ${15 + i * 5}s linear infinite`,
              opacity: 0.6,
            }}
          />
        ))}

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
          }}>
            {/* Left: Hero Text */}
            <div style={{ animation: 'fadeUp 0.8s ease-out' }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#34D399',
                letterSpacing: '0.06em',
                marginBottom: '1.5rem',
                backdropFilter: 'blur(8px)',
              }}>
                <Sparkles size={14} />
                <span>INDIA SMART CITIES · EXPLAINABLE CIVIC AI</span>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#22C55E',
                  boxShadow: '0 0 8px #22C55E',
                  animation: 'pulseDot 2s infinite',
                }} />
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1.08,
                color: '#F8FAFC',
                marginBottom: '1.25rem',
              }}>
                Fixing Broken Roads{' '}
                <span style={{ display: 'block', marginTop: '0.15em' }}>
                  with{' '}
                  <span className="text-gradient-hero">
                    Autonomous Vision
                  </span>
                </span>
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: '1.05rem',
                color: '#94A3B8',
                lineHeight: 1.7,
                marginBottom: '2rem',
                maxWidth: '520px',
              }}>
                CivicAI classifies road potholes, garbage, and broken streetlights via{' '}
                <strong style={{ color: '#E2E8F0' }}>YOLOv8 vision</strong>, maps coordinates to{' '}
                <strong style={{ color: '#E2E8F0' }}>municipal ward polygons</strong>, and slashes 45-day delays to{' '}
                <strong style={{ color: '#34D399' }}>2–24h SLA resolutions</strong>.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={() => { playSound('click'); onNavigate('citizen'); }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                    background: 'linear-gradient(135deg, #10B981 0%, #0284C7 50%, #2563EB 100%)',
                    color: '#FFFFFF',
                    padding: '0.95rem 1.75rem',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 25px rgba(16, 185, 129, 0.4), 0 0 35px rgba(14, 165, 233, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 35px rgba(16, 185, 129, 0.5), 0 0 50px rgba(14, 165, 233, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 25px rgba(16, 185, 129, 0.4), 0 0 35px rgba(14, 165, 233, 0.2)';
                  }}
                >
                  <Camera size={20} />
                  <span>Report Defect (AI Scan)</span>
                  <ArrowRight size={18} />
                </button>


                <button
                  onClick={() => { playSound('click'); onNavigate('officer'); }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(8px)',
                    color: '#FCD34D',
                    border: '1px solid rgba(252, 211, 77, 0.2)',
                    padding: '0.95rem 1.5rem',
                    borderRadius: '14px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(252, 211, 77, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(252, 211, 77, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <ShieldAlert size={18} />
                  <span>Field SLA Queue</span>
                </button>
              </div>

              {/* Trust badges */}
              <div style={{
                display: 'flex', gap: '1.5rem', marginTop: '2.5rem',
                flexWrap: 'wrap',
              }}>
                {[
                  { icon: Eye, label: 'YOLOv8 Vision', color: '#38BDF8' },
                  { icon: Globe2, label: 'PostGIS Spatial', color: '#A78BFA' },
                  { icon: Cpu, label: 'Real-time SLA', color: '#34D399' },
                ].map((b, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    fontSize: '0.78rem', fontWeight: 600, color: '#64748B',
                  }}>
                    <b.icon size={14} color={b.color} />
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 3D Hologram Scanner Card */}
            <div style={{ ...heroParallax, animation: 'fadeUp 1s ease-out 0.2s both' }}>
              <div style={{
                background: 'rgba(14, 18, 30, 0.6)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(56, 189, 248, 0.15)',
                borderRadius: '24px',
                padding: '1.75rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(14, 165, 233, 0.08)',
                position: 'relative',
                overflow: 'hidden',
                animation: 'glowPulse 4s ease-in-out infinite',
              }}>
                {/* Corner accents */}
                <div style={{ position: 'absolute', top: '8px', left: '8px', width: '20px', height: '20px', borderLeft: '2px solid rgba(56, 189, 248, 0.3)', borderTop: '2px solid rgba(56, 189, 248, 0.3)', borderRadius: '4px 0 0 0' }} />
                <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderRight: '2px solid rgba(56, 189, 248, 0.3)', borderTop: '2px solid rgba(56, 189, 248, 0.3)', borderRadius: '0 4px 0 0' }} />
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '20px', height: '20px', borderLeft: '2px solid rgba(56, 189, 248, 0.3)', borderBottom: '2px solid rgba(56, 189, 248, 0.3)', borderRadius: '0 0 0 4px' }} />
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '20px', height: '20px', borderRight: '2px solid rgba(56, 189, 248, 0.3)', borderBottom: '2px solid rgba(56, 189, 248, 0.3)', borderRadius: '0 0 4px 0' }} />

                {/* Live Scan Header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '1.25rem', paddingBottom: '0.85rem',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="live-dot" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0' }}>
                      YOLOv8 Live Vision
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, color: '#38BDF8',
                    background: 'rgba(56, 189, 248, 0.1)',
                    padding: '0.2rem 0.6rem', borderRadius: '999px',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    0.38s latency
                  </span>
                </div>

                {/* Detection box */}
                <div style={{
                  background: 'rgba(6, 8, 15, 0.8)',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(14, 165, 233, 0.2)',
                  padding: '1.5rem',
                  position: 'relative',
                  marginBottom: '1.25rem',
                  overflow: 'hidden',
                }}>
                  {/* Scan line */}
                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.5), transparent)',
                    animation: 'scanLine 3s linear infinite',
                    pointerEvents: 'none',
                  }} />

                  {/* Hazard tag */}
                  <div style={{
                    position: 'absolute', top: '10px', right: '12px',
                    background: 'rgba(220, 38, 38, 0.2)',
                    color: '#FCA5A5', border: '1px solid rgba(220, 38, 38, 0.3)',
                    fontSize: '0.65rem', fontWeight: 800,
                    padding: '0.2rem 0.6rem', borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    ⚡ HIGH HAZARD
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>🕳️</span>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F8FAFC' }}>
                        Deep Asphalt Pothole
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                        Confidence: <strong style={{ color: '#34D399', fontFamily: 'var(--font-mono)' }}>94.6%</strong>
                      </div>
                    </div>
                  </div>

                  {/* Score strip */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.75rem',
                    color: '#CBD5E1',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>SCORE</div>
                      <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>8.8 / 10</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>WARD</div>
                      <div style={{ fontWeight: 700 }}>104 Central</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>SLA</div>
                      <div style={{ fontWeight: 800, color: '#F87171', fontFamily: 'var(--font-mono)' }}>2 Hours</div>
                    </div>
                  </div>
                </div>

                {/* Bottom badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#64748B' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={13} color="#34D399" /> PostGIS Geofenced
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Volume2 size={13} color="#38BDF8" /> Multilingual Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute', bottom: '-60px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            animation: 'float 3s ease-in-out infinite',
          }}>
            <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600, letterSpacing: '0.1em' }}>
              SCROLL TO EXPLORE
            </span>
            <div style={{
              width: '20px', height: '32px', borderRadius: '10px',
              border: '2px solid rgba(56, 189, 248, 0.3)',
              display: 'flex', justifyContent: 'center', paddingTop: '6px',
            }}>
              <div style={{
                width: '3px', height: '8px', borderRadius: '2px',
                background: '#38BDF8',
                animation: 'float 2s ease-in-out infinite',
              }} />
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: ANIMATED STATS COUNTERS
      ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 1rem 3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="scroll-reveal" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem',
        }}>
          {[
            { value: 3597, suffix: '+', label: 'Annual Pothole Deaths', sub: 'MoRTH Official Records', color: '#EF4444', glow: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.2)', icon: AlertTriangle },
            { value: 25, suffix: 'M+', label: 'Potholes Formed / Year', sub: 'Across 6.3M km network', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.2)', icon: Activity },
            { value: 96, suffix: '%', label: 'Faster SLA Resolution', sub: '2h–24h vs 45-day delays', color: '#10B981', glow: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.2)', icon: Clock },
            { value: 62, suffix: 'M', label: 'Tonnes Solid Waste / Yr', sub: '31M+ dumped openly', color: '#0EA5E9', glow: 'rgba(14, 165, 233, 0.15)', borderColor: 'rgba(14, 165, 233, 0.2)', icon: Layers },
          ].map((stat, i) => (
            <div
              key={i}
              className="tile-3d"
              style={{
                background: 'rgba(13, 29, 49, 0.75)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${stat.borderColor}`,
                borderRadius: '20px',
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {/* Top glow */}
              <div style={{
                position: 'absolute', top: '-30px', right: '-20px',
                width: '100px', height: '100px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${stat.glow} 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '12px',
                    background: `rgba(${stat.color === '#EF4444' ? '239,68,68' : stat.color === '#F59E0B' ? '245,158,11' : stat.color === '#10B981' ? '16,185,129' : '139,92,246'}, 0.12)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <stat.icon size={18} color={stat.color} />
                  </div>
                </div>

                <AnimatedNumber value={stat.value} suffix={stat.suffix} color={stat.color} />

                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#E2E8F0', marginTop: '0.35rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                  {stat.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: 3D FLOATING INDIA POTHOLE MAP
      ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '3rem 1rem 5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#FCA5A5',
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.72rem', fontWeight: 700,
            marginBottom: '1rem',
          }}>
            <AlertTriangle size={13} />
            <span>LIVE CRISIS MAPPING</span>
          </div>
          <h2 style={{
            fontSize: '2.2rem', fontWeight: 900,
            letterSpacing: '-0.04em',
            color: '#F1F5F9',
            marginBottom: '0.5rem',
          }}>
            Pothole Hotspots Across{' '}
            <span className="text-gradient-danger">India</span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748B', maxWidth: '550px', margin: '0 auto' }}>
            Hover over the 3D tiles to explore real-time pothole data from major metro cities.
          </p>
        </div>

        <div className="scroll-reveal-scale">
          <FloatingCityTiles onCityClick={(c) => { playSound('click'); }} />
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: HOW IT WORKS — 3D WORKFLOW CARDS
      ═══════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '5rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div className="scroll-reveal" style={{ marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            color: '#38BDF8', fontSize: '0.75rem', fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            marginBottom: '0.5rem',
          }}>
            <Zap size={14} /> Automated Urban Pipeline
          </div>
          <h2 style={{
            fontSize: '2rem', fontWeight: 900,
            letterSpacing: '-0.03em', color: '#F1F5F9',
          }}>
            How CivicAI Works
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '0.35rem', maxWidth: '500px' }}>
            From citizen photo to repaired road in 3 automated steps.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          position: 'relative',
        }}>
          {/* Connection line */}
          <div style={{
            position: 'absolute',
            top: '45px', left: '16.66%', right: '16.66%',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(16,185,129,0.4), rgba(14,165,233,0.4), rgba(37,99,235,0.4))',
            zIndex: 0,
          }} />

          {workflowSteps.map((step, i) => (
            <div
              key={i}
              className={`scroll-reveal tile-3d`}
              style={{
                position: 'relative',
                zIndex: 1,
                transitionDelay: `${i * 0.15}s`,
              }}
            >
              <div style={{
                background: 'rgba(13, 29, 49, 0.75)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(56, 189, 248, 0.16)',
                borderRadius: '24px',
                padding: '2rem 1.5rem',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
              }}>
                {/* Ambient glow */}
                <div style={{
                  position: 'absolute', top: '-20px', right: '-20px',
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: `radial-gradient(circle, ${step.glow} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Step number + icon */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  marginBottom: '1.25rem',
                }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '16px',
                    background: step.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: `0 8px 25px ${step.glow}`,
                    position: 'relative',
                  }}>
                    <step.icon size={24} />
                  </div>
                  <span style={{
                    fontSize: '2.5rem', fontWeight: 900,
                    color: 'rgba(255,255,255,0.04)',
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1,
                  }}>
                    {step.num}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '1.15rem', fontWeight: 800,
                  color: '#F1F5F9', marginBottom: '0.5rem',
                }}>
                  {step.title}
                </h3>

                <p style={{
                  fontSize: '0.85rem', color: '#94A3B8',
                  lineHeight: 1.6,
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: CITY IMPACT TRACKER
      ═══════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '3rem 1rem 5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div
          className="scroll-reveal"
          style={{
            background: 'rgba(13, 29, 49, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(56, 189, 248, 0.16)',
            borderRadius: '28px',
            padding: '2rem',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: '-50px', left: '-50px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem',
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F1F5F9' }}>
                Live Metro City Hotspot Tracking
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.2rem' }}>
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
                    onClick={() => { playSound('click'); setSelectedCity(key); }}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: isSelected ? 'linear-gradient(135deg, #10B981, #0284C7)' : 'rgba(56, 189, 248, 0.08)',
                      color: isSelected ? '#FFFFFF' : '#94A3B8',
                      border: `1px solid ${isSelected ? 'transparent' : 'rgba(56, 189, 248, 0.15)'}`,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 15px rgba(16, 185, 129, 0.35)' : 'none',
                    }}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          </div>

          {/* City Banner */}
          <div style={{
            background: 'rgba(11, 24, 40, 0.75)',
            borderRadius: '18px',
            border: '1px solid rgba(56, 189, 248, 0.14)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            animation: 'fadeUp 0.3s ease-out',
          }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F1F5F9' }}>
                {city.name}{' '}
                <span style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 600 }}>({city.state})</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>
                <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                {city.tag}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Annual Defects</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F87171' }}>{city.potholes}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Old Delay</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#475569', textDecoration: 'line-through' }}>{city.delay}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#4ADE80', fontWeight: 700, textTransform: 'uppercase' }}>CivicAI Speed</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#4ADE80' }}>{city.civicAi}</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: QUICK LAUNCHERS
      ═══════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '0 1rem 5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }}>
          {[
            {
              title: 'Citizen AI Reporting',
              desc: 'Instant photo upload, YOLOv8 bounding boxes, and Hindi/English voice reporting.',
              icon: Camera, tab: 'citizen',
              gradient: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
              glow: 'rgba(14, 165, 233, 0.15)',
              borderColor: 'rgba(14, 165, 233, 0.15)',
              accentColor: '#38BDF8',
              cta: 'Report Issue',
            },
            {
              title: 'Field Officer SLA Queue',
              desc: 'Prioritized queue with dynamic countdown timers and 1-tap resolution.',
              icon: ShieldAlert, tab: 'officer',
              gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
              glow: 'rgba(245, 158, 11, 0.15)',
              borderColor: 'rgba(245, 158, 11, 0.15)',
              accentColor: '#FCD34D',
              cta: 'Open Queue',
            },
            {
              title: 'City Admin Dashboard',
              desc: 'Ward density heatmaps, PostGIS spatial clusters, and 4-factor breakdown.',
              icon: BarChart3, tab: 'admin',
              gradient: 'linear-gradient(135deg, #10B981, #059669)',
              glow: 'rgba(16, 185, 129, 0.15)',
              borderColor: 'rgba(16, 185, 129, 0.15)',
              accentColor: '#4ADE80',
              cta: 'Open Dashboard',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="scroll-reveal tile-3d"
              onClick={() => { playSound('click'); onNavigate(card.tab); }}
              style={{
                cursor: 'pointer',
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div style={{
                background: 'rgba(13, 29, 49, 0.75)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${card.borderColor}`,
                borderRadius: '24px',
                padding: '1.75rem',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                {/* Ambient glow */}
                <div style={{
                  position: 'absolute', top: '-30px', right: '-30px',
                  width: '120px', height: '120px', borderRadius: '50%',
                  background: `radial-gradient(circle, ${card.glow} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: card.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff',
                    marginBottom: '1rem',
                    boxShadow: `0 8px 20px ${card.glow}`,
                  }}>
                    <card.icon size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F1F5F9', marginBottom: '0.35rem' }}>
                    {card.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5 }}>
                    {card.desc}
                  </p>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  color: card.accentColor,
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  marginTop: '1.25rem',
                }}>
                  <span>{card.cta}</span>
                  <ChevronRight size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
