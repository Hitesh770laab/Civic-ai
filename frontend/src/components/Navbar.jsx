import React from 'react';
import { Building2, UserCheck, ShieldAlert, BarChart3, Sparkles, Zap, Volume2 } from 'lucide-react';
import { playSound } from '../services/voiceAssistant';

export default function Navbar({ currentRole, setCurrentRole, activeIssuesCount }) {
  const roles = [
    { id: 'citizen', label: 'Citizen View',  sub: 'Voice & Easy Mode',       icon: UserCheck,  accentColor: '#2563EB' },
    { id: 'officer', label: 'Field Officer', sub: 'Prioritized Queue',        icon: ShieldAlert, accentColor: '#D97706', badge: activeIssuesCount },
    { id: 'admin',   label: 'City Admin',    sub: 'Operations Dashboard',     icon: BarChart3,   accentColor: '#16A34A' },
  ];

  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #E8EAED',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      {/* Top accent strip */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 50%, #059669 100%)' }} />

      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '10px',
            background: '#2563EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
            flexShrink: 0,
          }}>
            <Building2 size={21} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em' }}>
                Civic<span style={{ color: '#2563EB' }}>AI</span>
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                background: '#EEF2FF', color: '#4338CA',
                fontSize: '0.68rem', fontWeight: 700,
                padding: '0.15rem 0.5rem', borderRadius: '999px',
                border: '1px solid #C7D2FE',
              }}>
                <Sparkles size={10} /> Explainable AI
              </span>
            </div>
            <p style={{ fontSize: '0.73rem', color: '#9CA3AF', marginTop: '1px', lineHeight: 1 }}>
              Urban Issue Intelligence Platform
            </p>
          </div>
        </div>

        {/* Role Switcher */}
        <nav className="pill-nav">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => { playSound('click'); setCurrentRole(r.id); }}
                className={`pill-nav-item ${isActive ? 'active' : ''}`}
                style={{ position: 'relative' }}
              >
                <Icon
                  size={16}
                  strokeWidth={2.2}
                  color={isActive ? r.accentColor : '#9CA3AF'}
                />
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isActive ? '#111827' : '#6B7280' }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 500 }}>
                    {r.sub}
                  </div>
                </div>
                {r.badge > 0 && (
                  <span style={{
                    position: 'absolute', top: '4px', right: '6px',
                    background: '#EF4444', color: '#fff',
                    fontSize: '0.65rem', fontWeight: 800,
                    width: '17px', height: '17px',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #fff',
                  }}>
                    {r.badge > 9 ? '9+' : r.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Live System Status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: '#F0FDF4', border: '1px solid #BBF7D0',
          padding: '0.4rem 0.9rem', borderRadius: '999px',
          fontSize: '0.76rem', fontWeight: 600, color: '#15803D',
        }}>
          <span className="live-dot" />
          <span>YOLO &amp; PostGIS Live</span>
        </div>
      </div>
    </header>
  );
}
