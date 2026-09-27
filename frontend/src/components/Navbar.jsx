import React from 'react';
import {
  Building2, Camera, ShieldAlert, BarChart3, Sparkles,
  Zap, PlayCircle, TrendingUp, Plus, AlertTriangle, Home
} from 'lucide-react';
import { playSound } from '../services/voiceAssistant';

export default function Navbar({ currentRole, setCurrentRole, activeIssuesCount, onReplayIntro }) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      accentColor: '#38BDF8',
    },
    {
      id: 'citizen',
      label: 'Report Issue',
      icon: Camera,
      accentColor: '#0EA5E9',
    },
    {
      id: 'officer',
      label: 'Field Queue',
      icon: ShieldAlert,
      accentColor: '#F59E0B',
      badge: activeIssuesCount,
    },
    {
      id: 'admin',
      label: 'City Admin',
      icon: BarChart3,
      accentColor: '#10B981',
    },
    {
      id: 'india_stats',
      label: 'India Stats',
      icon: TrendingUp,
      accentColor: '#F87171',
    },
  ];

  return (
    <header style={{
      background: '#0F172A',
      borderBottom: '1px solid #1E293B',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    }}>
      {/* Top micro neon strip */}
      <div style={{
        height: '2.5px',
        background: 'linear-gradient(90deg, #0EA5E9 0%, #6366F1 35%, #F59E0B 70%, #10B981 100%)'
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
          onClick={() => {
            playSound('click');
            setCurrentRole('home');
          }}
          title="Go to CivicAI Home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)',
            flexShrink: 0,
          }}>
            <Building2 size={19} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.18rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Civic<span style={{ color: '#38BDF8' }}>AI</span>
              </span>
              <span style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38BDF8',
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}>
                Smart India
              </span>
            </div>
            <p style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '1px', lineHeight: 1 }}>
              Autonomous Urban Intelligence
            </p>
          </div>
        </div>

        {/* Minimal Navigation Pills */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          background: '#1E293B',
          padding: '0.25rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = currentRole === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  playSound('click');
                  setCurrentRole(t.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.42rem 0.85rem',
                  borderRadius: '9px',
                  background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid transparent',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon
                  size={15}
                  strokeWidth={2.2}
                  color={isActive ? t.accentColor : '#94A3B8'}
                />
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                }}>
                  {t.label}
                </span>

                {t.badge > 0 && (
                  <span style={{
                    marginLeft: '0.2rem',
                    background: '#EF4444',
                    color: '#fff',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
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
          {/* Quick 1-Click Report Button */}
          {currentRole !== 'citizen' && (
            <button
              onClick={() => {
                playSound('click');
                setCurrentRole('citizen');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
                color: '#FFFFFF',
                padding: '0.45rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                boxShadow: '0 0 15px rgba(14, 165, 233, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <Plus size={15} />
              <span>Report Defect</span>
            </button>
          )}

          {/* Replay Intro Button */}
          <button
            onClick={() => {
              playSound('click');
              onReplayIntro?.();
            }}
            title="Replay CivicAI intro animation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.45rem 0.7rem',
              borderRadius: '10px',
              fontSize: '0.74rem',
              fontWeight: 600,
              color: '#CBD5E1',
              cursor: 'pointer',
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
