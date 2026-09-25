import React from 'react';
import { BrainCircuit, Sparkles, Clock, Send, X, Eye } from 'lucide-react';

export default function AiExplainDrawer({ explanation, onClose }) {
  if (!explanation) return null;
  const {
    base_score = 0, keyword_boost = 0, matched_keywords = [],
    variance = 0, final_score = 0, priority_level = 'MEDIUM',
    confidence_score = 0.88, assigned_department = '', sla_hours = 72, rationale = '',
  } = explanation;

  const lvl = priority_level?.toLowerCase();
  const scoreColor = lvl === 'high' ? '#DC2626' : lvl === 'medium' ? '#D97706' : '#16A34A';

  return (
    <div style={{
      background: '#fff', border: '1px solid #BFDBFE', borderRadius: '14px',
      padding: '1.5rem', boxShadow: '0 4px 16px rgba(37,99,235,0.1)',
      position: 'relative',
    }} className="animate-fade-up">
      {onClose && (
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          color: '#9CA3AF', padding: '0.3rem', borderRadius: '6px',
          lineHeight: 1,
        }} aria-label="Close">
          <X size={17} />
        </button>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(37,99,235,0.25)', flexShrink: 0,
        }}>
          <BrainCircuit size={20} />
        </div>
        <div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            AI Resolution Passport
            <span className={`badge badge-${lvl}`}>{priority_level} · {final_score}/10</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Deterministic explainable AI — full scoring breakdown</div>
        </div>
      </div>

      {/* Rationale */}
      <div style={{
        background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px',
        padding: '0.85rem 1rem', marginBottom: '1.25rem',
        display: 'flex', gap: '0.6rem', fontSize: '0.85rem', color: '#1E3A8A', lineHeight: 1.45,
      }}>
        <Sparkles size={17} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div><strong>Routing Rationale:</strong> {rationale}</div>
      </div>

      {/* 4 KPI tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {/* Confidence */}
        <div style={{ background: '#F7F8FA', border: '1px solid #E8EAED', borderRadius: '10px', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Confidence</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
            {Math.round((confidence_score) * 100)}<span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>%</span>
          </div>
          <div className="progress-bar" style={{ marginTop: '0.45rem' }}>
            <div className="progress-fill" style={{ width: `${confidence_score * 100}%`, background: '#3B82F6' }} />
          </div>
        </div>

        {/* Score */}
        <div style={{ background: '#F7F8FA', border: '1px solid #E8EAED', borderRadius: '10px', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Priority Score</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
            {final_score}<span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 400 }}> /10</span>
          </div>
          <div className="progress-bar" style={{ marginTop: '0.45rem' }}>
            <div className="progress-fill" style={{ width: `${final_score * 10}%`, background: scoreColor }} />
          </div>
        </div>

        {/* Department */}
        <div style={{ background: '#F7F8FA', border: '1px solid #E8EAED', borderRadius: '10px', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Auto-Routed To</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>{assigned_department}</div>
        </div>

        {/* SLA */}
        <div style={{ background: '#F7F8FA', border: '1px solid #E8EAED', borderRadius: '10px', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '0.35rem' }}>SLA Target</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            {sla_hours}<span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 400 }}>h</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
            {sla_hours <= 24 ? '🔴 Emergency 24h' : sla_hours <= 72 ? '🟡 Expedited 3-day' : '🟢 Routine 7-day'}
          </div>
        </div>
      </div>

      {/* Formula breakdown */}
      <div style={{ background: '#FAFAFA', border: '1px solid #E8EAED', borderRadius: '10px', padding: '1rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.65rem' }}>Scoring Formula:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
            <span>Base issue severity</span><strong style={{ color: '#374151' }}>{base_score}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
            <span>NLP keyword boost</span>
            <strong style={{ color: keyword_boost > 0 ? '#DC2626' : '#374151' }}>+{keyword_boost}</strong>
          </div>

          {matched_keywords.length > 0 && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.55rem 0.75rem', margin: '0.1rem 0' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B91C1C', marginBottom: '0.3rem' }}>Urgency signals detected:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {matched_keywords.map((m, i) => (
                  <span key={i} title={m.reason} style={{
                    background: '#fff', border: '1px solid #FECACA', color: '#991B1B',
                    padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.71rem', fontWeight: 600,
                  }}>
                    "{m.keyword}" +{m.weight}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
            <span>Model variance</span><span style={{ color: '#374151' }}>{variance >= 0 ? `+${variance}` : variance}</span>
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            borderTop: '1px dashed #E8EAED', paddingTop: '0.45rem', marginTop: '0.1rem',
            fontWeight: 800, fontSize: '0.9rem',
          }}>
            <span style={{ color: '#111827' }}>Final Priority Score</span>
            <span style={{ color: '#2563EB' }}>{final_score} / 10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
