import React from 'react';
import { FileEdit, BrainCircuit, Gauge, Send, CheckCircle2 } from 'lucide-react';

const stages = [
  { num: 1, label: 'Report',      icon: FileEdit,      color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { num: 2, label: 'AI Reads',    icon: BrainCircuit,  color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { num: 3, label: 'Score',       icon: Gauge,         color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  { num: 4, label: 'Route',       icon: Send,          color: '#059669', bg: '#F0FDF4', border: '#BBF7D0' },
  { num: 5, label: 'Verify',      icon: CheckCircle2,  color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
];

export default function PipelineStrip({ activeStage = 1 }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E8EAED',
      borderRadius: '14px',
      padding: '1rem 1.25rem',
      marginBottom: '1.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        position: 'relative',
      }}>
        {stages.map((st, idx) => {
          const Icon = st.icon;
          const isDone = st.num < activeStage;
          const isCurrent = st.num === activeStage;
          const isLast = idx === stages.length - 1;

          let iconBg = '#F3F4F6';
          let iconColor = '#9CA3AF';
          let labelColor = '#9CA3AF';
          let numColor = '#D1D5DB';

          if (isDone) {
            iconBg = '#F0FDF4'; iconColor = '#16A34A'; labelColor = '#15803D'; numColor = '#16A34A';
          } else if (isCurrent) {
            iconBg = st.bg; iconColor = st.color; labelColor = st.color; numColor = st.color;
          }

          return (
            <React.Fragment key={st.num}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                {/* Step circle */}
                <div style={{
                  width: '38px', height: '38px',
                  borderRadius: '50%',
                  background: iconBg,
                  border: `2px solid ${isCurrent ? st.border : isDone ? '#BBF7D0' : '#E5E7EB'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isCurrent ? `0 0 0 4px ${st.bg}` : 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}>
                  {isDone ? (
                    <CheckCircle2 size={18} color="#16A34A" strokeWidth={2.5} />
                  ) : (
                    <Icon size={17} color={iconColor} strokeWidth={2.2} />
                  )}
                </div>
                {/* Label */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: labelColor, lineHeight: 1.1 }}>
                    {st.num}. {st.label}
                  </div>
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div style={{
                  flex: 0,
                  width: '40px',
                  height: '2px',
                  background: isDone ? '#BBF7D0' : '#E5E7EB',
                  borderRadius: '1px',
                  marginBottom: '20px',
                  transition: 'background 0.3s ease',
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
