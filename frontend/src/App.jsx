import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import CitizenView from './views/CitizenView';
import OfficerView from './views/OfficerView';
import AdminView from './views/AdminView';
import IndiaStatsView from './views/IndiaStatsView';
import CivicIntroAnimation from './components/CivicIntroAnimation';
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
      {/* Intro splash animation when opened or replayed */}
      {showIntro && (
        <CivicIntroAnimation onComplete={() => setShowIntro(false)} />
      )}


      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeIssuesCount={activeIssuesCount}
        onReplayIntro={() => setShowIntro(true)}
      />

      <main style={{ flex: 1, paddingTop: '1.75rem', paddingBottom: '2.5rem' }}>
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
      <footer style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '1.5rem 0' }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.78rem', color: '#64748B',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: '#1E293B' }}>CivicAI</span>
            <span>— Neural Vision &amp; Spatial Municipal Dispatch Platform</span>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentRole('home')}
              style={{ color: '#64748B', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}
            >
              Home &amp; Overview
            </button>
            <button
              onClick={() => setCurrentRole('india_stats')}
              style={{ color: '#64748B', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}
            >
              India Pothole Stats
            </button>
            <button
              onClick={() => setCurrentRole('citizen')}
              style={{ color: '#2563EB', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
            >
              Report an Issue
            </button>
            <span style={{ color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} /> Live 2h-24h SLA Timers
            </span>
          </div>
        </div>
      </footer>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: '#0F172A', color: '#fff',
          padding: '0.85rem 1.25rem', borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          fontSize: '0.85rem', fontWeight: 600, zIndex: 1000,
          animation: 'fadeUp 0.2s ease-out',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <CheckCircle2 size={16} color="#22C55E" />
          {toast}
        </div>
      )}
    </div>
  );
}
