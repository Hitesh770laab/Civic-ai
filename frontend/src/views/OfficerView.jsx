import React, { useState, useEffect } from 'react';
import {
  RotateCw, Search, ExternalLink, CheckCircle, Play, Clock,
  Sparkles, AlertCircle, ChevronRight, Filter, RefreshCw, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SlaCountdown from '../components/SlaCountdown';
import AiExplainDrawer from '../components/AiExplainDrawer';
import { fetchReports, updateReportStatus } from '../services/api';

const STATUS_TABS = ['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED', 'VERIFIED_CLOSED'];

export default function OfficerView() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expandedExplain, setExpandedExplain] = useState(null);
  const [countdown, setCountdown] = useState(30);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchReports({ status: statusFilter === 'ALL' ? null : statusFilter, sort_by: 'priority_score' });
      setReports(data);
      setCountdown(30);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [statusFilter]);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { load(); return 30; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [statusFilter]);

  const doAction = async (report, nextStatus) => {
    try {
      await updateReportStatus(report.id, nextStatus);
      setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: nextStatus } : r));
      if (nextStatus === 'VERIFIED_CLOSED') {
        try { confetti({ particleCount: 60, spread: 65, origin: { y: 0.6 } }); } catch { /* */ }
      }
    } catch { alert('Status update failed.'); }
  };

  const filtered = reports.filter(r => {
    if (!search) return true;
    const t = search.toLowerCase();
    return [r.ticket_number, r.title, r.issue_type, r.ward_name, r.description].some(s => s?.toLowerCase().includes(t));
  });

  const counts = { total: reports.length, open: reports.filter(r => ['NEW', 'IN_PROGRESS'].includes(r.status)).length };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            Field Officer Queue
            <span className="badge badge-medium">Priority-Sorted</span>
          </h1>
          <p className="section-subtitle">Sorted strictly by AI severity score. SLA timers count down in real time.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: '#fff', border: '1px solid #E8EAED', borderRadius: '999px',
            padding: '0.4rem 0.85rem', fontSize: '0.78rem', color: '#6B7280',
          }}>
            <Clock size={13} color="#2563EB" />
            Auto-refresh in <strong style={{ color: '#111827', marginLeft: '3px' }}>{countdown}s</strong>
          </div>
          <button onClick={load} disabled={loading} className="btn btn-secondary">
            <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Quick stats bar */}
      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap',
      }}>
        {[
          { label: 'Total', value: counts.total, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
          { label: 'Active', value: counts.open, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
          { label: 'Resolved', value: counts.total - counts.open, color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '10px', padding: '0.55rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</span>
            <span style={{ fontSize: '0.78rem', color: s.color, fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{
        background: '#fff', border: '1px solid #E8EAED', borderRadius: '12px',
        padding: '0.75rem 1rem', marginBottom: '1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '0.65rem', boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {STATUS_TABS.map(st => (
            <button key={st} onClick={() => setStatusFilter(st)}
              className="btn btn-sm"
              style={{
                background: statusFilter === st ? '#2563EB' : '#F3F4F6',
                color: statusFilter === st ? '#fff' : '#6B7280',
                fontWeight: 600, fontSize: '0.78rem',
              }}>
              {st === 'ALL' ? 'All' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', minWidth: '220px' }}>
          <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: '9px', top: '9px', pointerEvents: 'none' }} />
          <input type="text" placeholder="Search ticket, ward, keyword…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="form-input" style={{ paddingLeft: '2rem', fontSize: '0.82rem', height: '34px', padding: '0 0.75rem 0 2rem' }} />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="civic-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Score</th>
                <th>Issue</th>
                <th style={{ width: '160px' }}>Ward / Location</th>
                <th style={{ width: '175px' }}>Department</th>
                <th style={{ width: '200px' }}>SLA Countdown</th>
                <th style={{ width: '120px' }}>Status</th>
                <th style={{ width: '160px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#9CA3AF' }}>No reports found.</td></tr>
              )}
              {filtered.map(r => {
                const lvl = r.priority_level?.toLowerCase();
                const mapsUrl = `https://www.google.com/maps?q=${r.latitude},${r.longitude}`;
                const isExpanded = expandedExplain === r.id;

                return (
                  <React.Fragment key={r.id}>
                    <tr>
                      {/* Score */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span className={`badge badge-${lvl}`}>{r.priority_level}</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                            {r.priority_score}<span style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 400 }}>/10</span>
                          </span>
                        </div>
                      </td>

                      {/* Issue details */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', maxWidth: '360px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <code style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '0.1rem 0.45rem', borderRadius: '5px', fontFamily: 'var(--font-mono)' }}>
                              {r.ticket_number}
                            </code>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>{r.title}</span>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.35 }}>
                            {r.description?.slice(0, 110)}{r.description?.length > 110 ? '…' : ''}
                          </p>
                          {r.urgency_keywords?.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                              {r.urgency_keywords.map((kw, i) => (
                                <span key={i} style={{ fontSize: '0.66rem', fontWeight: 700, background: '#FEF2F2', color: '#DC2626', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid #FECACA' }}>
                                  ⚡ {kw}
                                </span>
                              ))}
                            </div>
                          )}
                          <button type="button" onClick={() => setExpandedExplain(isExpanded ? null : r.id)}
                            className="btn-ghost" style={{ width: 'fit-content', fontSize: '0.72rem', padding: '0.2rem 0.4rem' }}>
                            <Sparkles size={11} />
                            {isExpanded ? 'Hide' : 'View'} AI Math
                          </button>
                        </div>
                      </td>

                      {/* Ward */}
                      <td>
                        <div style={{ fontSize: '0.83rem', fontWeight: 700, color: '#374151' }}>{r.ward_name || '—'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{r.address_hint}</div>
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: '0.71rem', color: '#2563EB', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                          <ExternalLink size={11} /> Maps
                        </a>
                      </td>

                      {/* Department */}
                      <td>
                        <div style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 500, lineHeight: 1.3 }}>{r.assigned_department}</div>
                      </td>

                      {/* SLA */}
                      <td><SlaCountdown deadline={r.sla_deadline} status={r.status} /></td>

                      {/* Status */}
                      <td>
                        <span className={`status-${r.status?.toLowerCase()}`}>{r.status?.replace('_', ' ')}</span>
                      </td>

                      {/* Action */}
                      <td style={{ textAlign: 'right' }}>
                        {r.status === 'NEW' && (
                          <button onClick={() => doAction(r, 'IN_PROGRESS')} className="btn btn-primary btn-sm">
                            <Play size={13} /> Accept
                          </button>
                        )}
                        {r.status === 'IN_PROGRESS' && (
                          <button onClick={() => doAction(r, 'RESOLVED')} className="btn btn-success btn-sm">
                            <CheckCircle size={13} /> Resolve
                          </button>
                        )}
                        {r.status === 'RESOLVED' && (
                          <button onClick={() => doAction(r, 'VERIFIED_CLOSED')} className="btn btn-violet btn-sm">
                            <Sparkles size={13} /> Verify & Close
                          </button>
                        )}
                        {r.status === 'VERIFIED_CLOSED' && (
                          <span style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                            <CheckCircle size={13} /> Closed
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Inline AI explanation row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} style={{ padding: '0 1rem 1rem', background: '#F8FAFF', borderBottom: '1px solid #E8EAED' }}>
                          <AiExplainDrawer explanation={r.ai_explanation} onClose={() => setExpandedExplain(null)} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
