import React, { useState, useEffect } from 'react';
import {
  Layers, TrendingUp, CheckCircle2, Flame, ExternalLink,
  MapPin, BarChart3, Users, Zap, ChevronRight
} from 'lucide-react';
import { fetchAdminKpis, fetchHotspots, fetchWardBreakdown } from '../services/api';

/* ── Inline Hotspot Map ─────────────────────────────────── */
function HotspotMap({ points, selectedId, onSelect }) {
  const minLat = 37.73, maxLat = 37.82, minLng = -122.47, maxLng = -122.37;
  const W = 700, H = 380;
  const getX = (lng) => Math.max(12, Math.min(W - 12, ((lng - minLng) / (maxLng - minLng)) * W));
  const getY = (lat) => Math.max(12, Math.min(H - 12, (1 - (lat - minLat) / (maxLat - minLat)) * H));

  const colorOf = (pt) => {
    if (pt.status === 'RESOLVED' || pt.status === 'VERIFIED_CLOSED') return '#22C55E';
    if (pt.priority_level === 'HIGH') return '#EF4444';
    if (pt.priority_level === 'MEDIUM') return '#F59E0B';
    return '#22C55E';
  };

  return (
    <div style={{ position: 'relative', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        {/* Water */}
        <path d="M0,0 L700,0 L700,70 C540,64,420,88,280,72 C140,56,70,90,0,80Z" fill="#DBEAFE" stroke="#BFDBFE" strokeWidth="1" />
        <text x="360" y="42" fill="#1D4ED8" fontSize="12" fontWeight="700" opacity="0.5">MARINA BAY</text>

        {/* Parks */}
        <rect x="48" y="175" width="145" height="88" rx="8" fill="#DCFCE7" stroke="#BBF7D0" strokeWidth="1" />
        <text x="70" y="222" fill="#15803D" fontSize="11" fontWeight="700" opacity="0.6">PARK HEIGHTS</text>

        {/* Tech cluster */}
        <rect x="440" y="200" width="130" height="72" rx="8" fill="#F0F4FF" stroke="#C7D2FE" strokeWidth="1" />
        <text x="462" y="240" fill="#4338CA" fontSize="10" fontWeight="700" opacity="0.6">TECH CORRIDOR</text>

        {/* Grid */}
        <g stroke="#E2E8F0" strokeWidth="2.5">
          {[115, 175, 258, 315].map(y => <line key={y} x1="0" y1={y} x2={W} y2={y} />)}
          {[126, 248, 390, 534].map(x => <line key={x} x1={x} y1="0" x2={x} y2={H} />)}
        </g>
        {/* Highway */}
        <path d="M0,295 Q340,248,700,300" fill="none" stroke="#D1D5DB" strokeWidth="5" strokeDasharray="10,4" />
        <text x="290" y="283" fill="#6B7280" fontSize="9" fontWeight="600">METRO EXPRESSWAY 101</text>

        {/* Ward labels */}
        <text x="270" y="152" fill="#6B7280" fontSize="12" fontWeight="800" opacity="0.3">DOWNTOWN CENTRAL</text>
        <text x="72" y="118" fill="#6B7280" fontSize="10" fontWeight="700" opacity="0.25">HARBOR DISTRICT</text>
        <text x="280" y="356" fill="#6B7280" fontSize="10" fontWeight="700" opacity="0.25">INDUSTRIAL HUB</text>

        {/* Issue dots */}
        {points.map((pt) => {
          const x = getX(pt.longitude), y = getY(pt.latitude);
          const col = colorOf(pt);
          const isSelected = selectedId === pt.id;
          return (
            <g key={pt.id} onClick={() => onSelect(pt)} style={{ cursor: 'pointer' }}>
              {isSelected && <circle cx={x} cy={y} r="14" fill={col} opacity="0.2" />}
              <circle cx={x} cy={y} r={isSelected ? 7 : 5} fill={col} stroke="#fff" strokeWidth={isSelected ? 2.5 : 1.5} />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: '10px', left: '12px',
        background: 'rgba(255,255,255,0.92)', border: '1px solid #E8EAED', borderRadius: '8px',
        padding: '0.4rem 0.75rem', display: 'flex', gap: '0.85rem',
        fontSize: '0.72rem', fontWeight: 600, pointerEvents: 'none',
      }}>
        {[['#EF4444', 'HIGH'], ['#F59E0B', 'MEDIUM'], ['#22C55E', 'LOW/Resolved']].map(([c, l]) => (
          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#374151' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />{l}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── KPI Card ────────────────────────────────────────────── */
function KpiCard({ label, value, sub, colorClass, icon: Icon }) {
  return (
    <div className={`kpi-card ${colorClass}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <div className={`icon-box icon-box-${colorClass}`}><Icon size={18} strokeWidth={2.2} /></div>
      </div>
      <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#111827', lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.4rem' }}>{sub}</div>}
    </div>
  );
}

/* ── AdminView ──────────────────────────────────────────── */
export default function AdminView() {
  const [kpis, setKpis] = useState({ total_reports: 0, open_reports: 0, resolved_reports: 0, at_sla_risk: 0, active_wards_count: 0 });
  const [hotspotData, setHotspotData] = useState({ points: [], clusters: [] });
  const [wards, setWards] = useState([]);
  const [selectedPt, setSelectedPt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [k, h, w] = await Promise.all([fetchAdminKpis(), fetchHotspots(), fetchWardBreakdown()]);
        setKpis(k); setHotspotData(h); setWards(w);
        if (h.points?.length) setSelectedPt(h.points[0]);
      } catch { /* */ }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          City Operations Dashboard
          <span className="badge badge-low" style={{ fontSize: '0.72rem' }}>
            <Zap size={11} /> Live PostGIS
          </span>
        </h1>
        <p className="section-subtitle">Real-time municipal health, spatial hotspots, and ward priority load distribution.</p>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <KpiCard label="Total Reports"       value={kpis.total_reports}    sub={`Across ${kpis.active_wards_count || 6} wards`}   colorClass="blue"  icon={Layers}       />
        <KpiCard label="Active Open Issues"  value={kpis.open_reports}     sub="In pipeline"                                       colorClass="amber" icon={TrendingUp}    />
        <KpiCard label="Closed & Verified"   value={kpis.resolved_reports} sub="Citizen-confirmed"                                 colorClass="green" icon={CheckCircle2}  />
        <KpiCard label="At SLA Risk (<4h)"   value={kpis.at_sla_risk}      sub="Needs immediate action"                            colorClass="red"   icon={Flame}         />
      </div>

      {/* Map + Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Map */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>Spatial Hotspot Map</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Click a dot to inspect — color-coded by AI priority</div>
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', fontSize: '0.75rem' }}>
              {[['#EF4444', 'High (7–10)'], ['#F59E0B', 'Medium (4–6)'], ['#22C55E', 'Low / Resolved']].map(([c, l]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#374151', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />{l}
                </span>
              ))}
            </div>
          </div>
          <HotspotMap points={hotspotData.points} selectedId={selectedPt?.id} onSelect={setSelectedPt} />
        </div>

        {/* Inspector panel */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Point Inspector
          </div>

          {selectedPt ? (
            <div className="animate-fade-up">
              {/* Ticket + Priority */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <code style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '0.15rem 0.5rem', borderRadius: '5px' }}>
                  {selectedPt.ticket_number}
                </code>
                <span className={`badge badge-${selectedPt.priority_level?.toLowerCase()}`}>
                  {selectedPt.priority_level} · {selectedPt.priority_score}/10
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '0.4rem' }}>{selectedPt.title}</div>

              <div style={{ fontSize: '0.78rem', color: '#6B7280', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div><MapPin size={12} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle', color: '#9CA3AF' }} />{selectedPt.ward_name}</div>
                <div><ChevronRight size={12} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle', color: '#9CA3AF' }} />{selectedPt.assigned_department}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.85rem' }}>
                <div style={{ flex: 1, background: '#F7F8FA', borderRadius: '8px', padding: '0.65rem', textAlign: 'center', border: '1px solid #E8EAED' }}>
                  <div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Status</div>
                  <span className={`status-${selectedPt.status?.toLowerCase()}`} style={{ marginTop: '0.2rem', display: 'inline-block' }}>
                    {selectedPt.status?.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ flex: 1, background: '#F7F8FA', borderRadius: '8px', padding: '0.65rem', textAlign: 'center', border: '1px solid #E8EAED' }}>
                  <div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>SLA Left</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: selectedPt.sla_remaining_hours <= 0 ? '#DC2626' : '#111827', marginTop: '0.15rem' }}>
                    {selectedPt.sla_remaining_hours > 0 ? `${selectedPt.sla_remaining_hours}h` : 'Overdue'}
                  </div>
                </div>
              </div>

              <a href={`https://www.google.com/maps?q=${selectedPt.latitude},${selectedPt.longitude}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', textDecoration: 'none', fontSize: '0.8rem' }}>
                <ExternalLink size={13} /> Open in Google Maps
              </a>
            </div>
          ) : (
            <div style={{ color: '#9CA3AF', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>
              Click any dot on the map to inspect
            </div>
          )}

          {/* Dense clusters */}
          {hotspotData.clusters?.length > 0 && (
            <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Dense Clusters
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {hotspotData.clusters.slice(0, 3).map((cl, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', background: '#F7F8FA', borderRadius: '7px', padding: '0.4rem 0.65rem', border: '1px solid #E8EAED' }}>
                    <span style={{ color: '#374151', fontWeight: 600 }}>Cluster #{i + 1} — {cl.count} issues</span>
                    <span style={{ color: '#DC2626', fontWeight: 700 }}>Avg {cl.avg_priority}/10</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ward Breakdown Table */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Ward Operations Breakdown
            <span className="badge badge-medium" style={{ fontSize: '0.68rem' }}>Sorted by Load</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.2rem' }}>
            Wards ranked by active incident volume × avg AI priority. Identifies where to dispatch resources first.
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="civic-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ward</th>
                <th>Zone</th>
                <th>Officer</th>
                <th style={{ textAlign: 'center' }}>Open</th>
                <th style={{ textAlign: 'center' }}>Resolved</th>
                <th style={{ textAlign: 'center' }}>Avg Priority</th>
                <th style={{ width: '200px' }}>Priority Load</th>
              </tr>
            </thead>
            <tbody>
              {wards.map((w, idx) => {
                const isTop = idx === 0 && w.open_count > 0;
                const loadPct = Math.min(100, (w.load_index / 12) * 100);
                return (
                  <tr key={w.ward_id}>
                    <td>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: isTop ? '#FEF2F2' : '#F3F4F6',
                        color: isTop ? '#DC2626' : '#9CA3AF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.75rem',
                        border: isTop ? '1.5px solid #FECACA' : 'none',
                      }}>
                        {idx + 1}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{w.ward_name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontFamily: 'var(--font-mono)' }}>{w.ward_code}</div>
                    </td>
                    <td style={{ fontSize: '0.83rem', color: '#374151' }}>{w.zone}</td>
                    <td style={{ fontSize: '0.83rem', color: '#374151', fontWeight: 600 }}>{w.officer_in_charge}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: w.open_count > 0 ? '#D97706' : '#9CA3AF' }}>{w.open_count}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#16A34A' }}>{w.resolved_count}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        fontSize: '0.92rem', fontWeight: 800,
                        color: w.avg_priority_score >= 7 ? '#DC2626' : w.avg_priority_score >= 4 ? '#D97706' : '#16A34A',
                      }}>
                        {w.avg_priority_score}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}> /10</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{
                            width: `${loadPct}%`,
                            background: isTop ? '#EF4444' : '#3B82F6',
                          }} />
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600, width: '24px', textAlign: 'right' }}>
                          {w.load_index}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
