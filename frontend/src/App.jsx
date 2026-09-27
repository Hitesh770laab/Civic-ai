import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import CitizenView from './views/CitizenView';
import OfficerView from './views/OfficerView';
import AdminView from './views/AdminView';
import IndiaStatsView from './views/IndiaStatsView';
import CivicIntroAnimation from './components/CivicIntroAnimation';
import ScrollProgressBar from './components/ScrollProgressBar';
import { fetchReports } from './services/api';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [showIntro, setShowIntro] = useState(false);
  const [currentRole, setCurrentRole] = useState('home');
  const [activeIssuesCount, setActiveIssuesCount] = useState(0);
  const [toast, setToast] = useState(null);

  const refreshCount = async () => {
    try {
      const r = await fetchReports({ status: null });
      setActiveIssuesCount(r.filter(x => ['NEW', 'IN_PROGRESS'].includes(x.status)).length);
    } catch { /* */ }
  };

  useEffect(() => {
    refreshCount();
    const id = setInterval(refreshCount, 15000);
    return () => clearInterval(id);
  }, []);

  const handleReportSubmitted = (rep) => {
    refreshCount();
    const dept = rep.assigned_department?.split(' ').slice(0, 3).join(' ');
    setToast(`✓ ${rep.ticket_number} logged · Routed to ${dept}`);
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-app, #08131F)',
      position: 'relative',
    }}>
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Green & Blue Mesh gradient background */}
      <div style={{
        position: 'fixed', inset: 0,
        background: `
          radial-gradient(ellipse 60% 60% at 15% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 60%),
          radial-gradient(ellipse 60% 60% at 85% 80%, rgba(14, 165, 233, 0.12) 0%, transparent 60%),
          radial-gradient(ellipse 50% 50% at 50% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 60%)
        `,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Noise overlay */}
      <div className="noise-overlay" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      {/* Intro splash animation */}
      {showIntro && (
        <CivicIntroAnimation onComplete={() => setShowIntro(false)} />
      )}

      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeIssuesCount={activeIssuesCount}
        onReplayIntro={() => setShowIntro(true)}
      />

      <main style={{ flex: 1, paddingTop: currentRole === 'home' ? 0 : '1.75rem', paddingBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
        {currentRole === 'home' && (
          <HomeView
            onNavigate={(tab) => setCurrentRole(tab)}
            onReplayIntro={() => setShowIntro(true)}
          />
        )}
        {currentRole === 'citizen' && (
          <CitizenView onReportSubmitted={handleReportSubmitted} />
        )}
        {currentRole === 'officer' && <OfficerView />}
        {currentRole === 'admin' && <AdminView />}
        {currentRole === 'india_stats' && (
          <IndiaStatsView onNavigate={(tab) => setCurrentRole(tab)} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(8, 19, 31, 0.95)',
        borderTop: '1px solid rgba(56, 189, 248, 0.12)',
        padding: '1.5rem 0',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.78rem', color: '#475569',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: '#E2E8F0' }}>CivicAI</span>
            <span>— Neural Vision & Spatial Municipal Dispatch Platform</span>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentRole('home')}
              style={{ color: '#64748B', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#CBD5E1'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
            >
              Home & Overview
            </button>
            <button
              onClick={() => setCurrentRole('india_stats')}
              style={{ color: '#64748B', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#CBD5E1'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
            >
              India Pothole Stats
            </button>
            <button
              onClick={() => setCurrentRole('citizen')}
              style={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0EA5E9'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#38BDF8'}
            >
              Report an Issue
            </button>
            <span style={{ color: '#4ADE80', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="live-dot" style={{ width: '6px', height: '6px' }} /> Live 2h-24h SLA Timers
            </span>
          </div>
        </div>
      </footer>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: 'rgba(14, 18, 30, 0.95)',
          backdropFilter: 'blur(16px)',
          color: '#F1F5F9',
          padding: '0.95rem 1.35rem', borderRadius: '16px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.5), 0 0 20px rgba(14, 165, 233, 0.1)',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          fontSize: '0.85rem', fontWeight: 600, zIndex: 1000,
          animation: 'fadeUp 0.3s ease-out',
          border: '1px solid rgba(56, 189, 248, 0.15)',
        }}>
          <CheckCircle2 size={16} color="#4ADE80" />
          {toast}
        </div>
      )}
    </div>
  );
}
