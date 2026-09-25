import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CitizenView from './views/CitizenView';
import OfficerView from './views/OfficerView';
import AdminView from './views/AdminView';
import { fetchReports } from './services/api';
import { CheckCircle2, Cpu, Database, Sparkles } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState('citizen');
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
      {/* Tech stack banner */}
      <div style={{
        background: '#1E293B', color: '#94A3B8',
        padding: '0.4rem 0', fontSize: '0.73rem', borderBottom: '1px solid #0F172A',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#CBD5E1', fontWeight: 700 }}>
            <Sparkles size={12} color="#60A5FA" /> CivicAI Prototype
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Cpu size={12} color="#34D399" /> FastAPI + YOLOv8 Defect Vision
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Database size={12} color="#A78BFA" /> PostGIS / Shapely Spatial
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E' }} />
            React.js · Light Theme
          </span>
        </div>
      </div>

      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeIssuesCount={activeIssuesCount}
      />

      <main style={{ flex: 1, paddingTop: '2rem' }}>
        {currentRole === 'citizen' && <CitizenView onReportSubmitted={handleReportSubmitted} />}
        {currentRole === 'officer' && <OfficerView />}
        {currentRole === 'admin'   && <AdminView />}
      </main>

      {/* Footer */}
      <footer style={{ background: '#F7F8FA', borderTop: '1px solid #E8EAED', padding: '1.1rem 0' }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '0.65rem', fontSize: '0.76rem', color: '#9CA3AF',
        }}>
          <span>CivicAI — React · FastAPI · PostGIS / Shapely · Ultralytics YOLOv8</span>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span style={{ color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} /> Live SLA Monitors
            </span>
            <span>Explainable AI · All 6 Wards</span>
          </div>
        </div>
      </footer>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: '#111827', color: '#fff',
          padding: '0.85rem 1.25rem', borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          fontSize: '0.85rem', fontWeight: 600, zIndex: 100,
          animation: 'fadeUp 0.2s ease-out',
        }}>
          <CheckCircle2 size={16} color="#22C55E" />
          {toast}
        </div>
      )}
    </div>
  );
}
