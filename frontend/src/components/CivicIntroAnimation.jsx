import React, { useState, useEffect } from 'react';
import {
  Building2, Cpu, Sparkles, Database, ShieldCheck, Zap,
  CheckCircle2, ArrowRight, Activity, Radio, MapPin, Layers
} from 'lucide-react';

export default function CivicIntroAnimation({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const steps = [
    { label: 'Initializing Neural Defect Vision (YOLOv8)', icon: Cpu, badge: 'CV CORE' },
    { label: 'Connecting PostGIS Spatial Municipal Mesh', icon: MapPin, badge: '6 WARDS' },
    { label: 'Synchronizing Dynamic SLA Priority Dispatcher', icon: Zap, badge: 'SLA ROUTER' },
    { label: 'Loading Real-Time Citizen Intelligence Hub', icon: ShieldCheck, badge: 'READY' },
  ];

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2800; // total intro duration in ms

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 28) {
        setCurrentStepIndex(0);
      } else if (pct < 55) {
        setCurrentStepIndex(1);
      } else if (pct < 82) {
        setCurrentStepIndex(2);
      } else {
        setCurrentStepIndex(3);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        handleFinish();
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
    }, 450); // allow exit animation to play smoothly
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#070B19',
        color: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: isExiting ? 'none' : 'auto',
      }}
    >
      {/* Background Animated Tech Grid & Radial Glows */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 35%, rgba(37, 99, 235, 0.22) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.18) 0%, transparent 50%),
            radial-gradient(circle at 20% 70%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px',
          opacity: 0.85,
        }}
      />

      {/* Floating Ambient Rings */}
      <div
        style={{
          position: 'absolute',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          border: '1px dashed rgba(59, 130, 246, 0.25)',
          animation: 'spin 30s linear infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '680px',
          height: '680px',
          borderRadius: '50%',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          animation: 'spin 45s linear infinite reverse',
          pointerEvents: 'none',
        }}
      />

      {/* Main Content Box */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '560px',
          padding: '2rem 1.5rem',
          width: '100%',
        }}
      >
        {/* Animated Hologram Logo Centerpiece */}
        <div style={{ position: 'relative', marginBottom: '1.75rem' }}>
          {/* Glowing Aura */}
          <div
            style={{
              position: 'absolute',
              inset: '-12px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED, #059669)',
              filter: 'blur(20px)',
              opacity: 0.65,
              animation: 'pulseDot 2.4s ease-in-out infinite alternate',
            }}
          />

          <div
            style={{
              position: 'relative',
              width: '84px',
              height: '84px',
              borderRadius: '22px',
              background: 'linear-gradient(145deg, #1E293B, #0F172A)',
              border: '2px solid rgba(96, 165, 250, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            <Building2 size={42} color="#60A5FA" strokeWidth={2.2} />
            <div
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#10B981',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px #10B981',
                border: '2px solid #070B19',
              }}
            >
              <Zap size={10} color="#FFFFFF" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Brand Name with Electric Shimmer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <h1
            style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            }}
          >
            <span style={{ color: '#FFFFFF' }}>Civic</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #34D399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginLeft: '2px',
              }}
            >
              AI
            </span>
          </h1>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              color: '#93C5FD',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              letterSpacing: '0.05em',
            }}
          >
            <Sparkles size={11} color="#60A5FA" />
            NEXT-GEN OS
          </span>
        </div>

        <p
          style={{
            fontSize: '0.92rem',
            color: '#94A3B8',
            marginBottom: '2rem',
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          Autonomous Urban Intelligence &amp; SLA Auto-Dispatch Engine
        </p>

        {/* Live Step Diagnostic Card */}
        <div
          style={{
            width: '100%',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.75rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
              fontSize: '0.75rem',
              color: '#64748B',
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8' }}>
              <Radio size={12} className="animate-spin" />
              SYSTEM DIAGNOSTICS
            </span>
            <span style={{ color: '#10B981', fontWeight: 800 }}>{progress}% COMPLETE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    background: isCurrent
                      ? 'rgba(37, 99, 235, 0.15)'
                      : isDone
                      ? 'rgba(16, 185, 129, 0.06)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isCurrent
                      ? '1px solid rgba(96, 165, 250, 0.35)'
                      : '1px solid transparent',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isDone
                          ? '#059669'
                          : isCurrent
                          ? '#2563EB'
                          : '#334155',
                        color: '#FFFFFF',
                        flexShrink: 0,
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 size={14} strokeWidth={2.5} />
                      ) : (
                        <Icon size={13} />
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: isCurrent ? 700 : 500,
                        color: isDone ? '#E2E8F0' : isCurrent ? '#FFFFFF' : '#64748B',
                      }}
                    >
                      {step.label}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: isDone
                        ? 'rgba(16, 185, 129, 0.2)'
                        : isCurrent
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                      color: isDone
                        ? '#34D399'
                        : isCurrent
                        ? '#93C5FD'
                        : '#475569',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {isDone ? 'ONLINE' : isCurrent ? 'BOOTING' : 'QUEUED'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar with glowing tip */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              marginTop: '1rem',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 50%, #10B981 100%)',
                borderRadius: '999px',
                transition: 'width 0.08s linear',
                boxShadow: '0 0 12px rgba(96, 165, 250, 0.8)',
              }}
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleFinish}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.65rem 1.4rem',
              borderRadius: '999px',
              fontSize: '0.88rem',
              fontWeight: 700,
              boxShadow: '0 4px 20px rgba(37, 99, 235, 0.45)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(37, 99, 235, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 99, 235, 0.45)';
            }}
          >
            <span>Launch Dashboard</span>
            <ArrowRight size={15} />
          </button>

          <button
            onClick={handleFinish}
            style={{
              color: '#64748B',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0.5rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#94A3B8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
          >
            Skip Intro ➔
          </button>
        </div>
      </div>
    </div>
  );
}
