import React from 'react';
import {
  Building2, Camera, ShieldAlert, BarChart3, Sparkles,
  Zap, PlayCircle, TrendingUp, Plus, AlertTriangle, Home
} from 'lucide-react';
import { playSound } from '../services/voiceAssistant';

export default function Navbar({ currentRole, setCurrentRole, activeIssuesCount, onReplayIntro }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, accentColor: '#34D399' },
    { id: 'citizen', label: 'Report Issue', icon: Camera, accentColor: '#38BDF8' },
    { id: 'officer', label: 'Field Queue', icon: ShieldAlert, accentColor: '#F59E0B', badge: activeIssuesCount },
    { id: 'admin', label: 'City Admin', icon: BarChart3, accentColor: '#10B981' },
    { id: 'india_stats', label: 'India Stats', icon: TrendingUp, accentColor: '#0EA5E9' },
  ];

  return (
    <header style={{
      background: 'rgba(8, 19, 31, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 4px 30px rgba(0,0,0,0.35)',
    }}>
      {/* Top Green & Blue gradient strip */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, #10B981 0%, #0EA5E9 35%, #2563EB 70%, #10B981 100%)',
        backgroundSize: '200% 100%',
        animation: 'gradientShift 6s ease infinite',
      }} />

      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1.25rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {/* Brand */}
        <div
          onClick={() => { playSound('click'); setCurrentRole('home'); }}
          title="Go to CivicAI Home"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.65rem',
            cursor: 'pointer', userSelect: 'none',
          }}
        >
          <div style={{
            width: '38px', height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10B981 0%, #0EA5E9 50%, #2563EB 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4), 0 4px 15px rgba(14, 165, 233, 0.25)',
            flexShrink: 0,
          }}>
            <Building2 size={19} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{
                fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC',
                letterSpacing: '-0.02em',
              }}>
                Civic<span className="text-gradient-brand">AI</span>
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#34D399',
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
                border: '1px solid rgba(52, 211, 153, 0.25)',
              }}>
                Smart India
              </span>
            </div>
            <p style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '1px', lineHeight: 1 }}>
              Autonomous Urban Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Pills */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          background: 'rgba(11, 28, 48, 0.75)',
          padding: '3px',
          borderRadius: '14px',
          border: '1px solid rgba(56, 189, 248, 0.15)',
        }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = currentRole === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { playSound('click'); setCurrentRole(t.id); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '11px',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(14, 165, 233, 0.18) 100%)'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 15px rgba(16, 185, 129, 0.15)' : 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <Icon
                  size={15}
                  strokeWidth={2.2}
                  color={isActive ? (t.accentColor || '#38BDF8') : '#64748B'}
                />
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: isActive ? '#F8FAFC' : '#94A3B8',
                }}>
                  {t.label}
                </span>

                {t.badge > 0 && (
                  <span style={{
                    marginLeft: '0.15rem',
                    background: '#EF4444',
                    color: '#fff',
                    fontSize: '0.58rem',
                    fontWeight: 800,
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)',
                  }}>
                    {t.badge > 9 ? '9+' : t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick Report Button */}
          {currentRole !== 'citizen' && (
            <button
              onClick={() => { playSound('click'); setCurrentRole('citizen'); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'linear-gradient(135deg, #10B981 0%, #0284C7 50%, #2563EB 100%)',
                color: '#FFFFFF',
                padding: '0.5rem 0.95rem',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(14, 165, 233, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(14, 165, 233, 0.3)';
              }}
            >
              <Plus size={15} />
              <span>Report Defect</span>
            </button>
          )}

          {/* Replay Intro */}
          <button
            onClick={() => { playSound('click'); onReplayIntro?.(); }}
            title="Replay CivicAI intro animation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '0.5rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: '#64748B',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.2)';
              e.currentTarget.style.color = '#CBD5E1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <PlayCircle size={13} color="#38BDF8" />
            <span>Intro</span>
          </button>
        </div>
      </div>
    </header>
  );
}
