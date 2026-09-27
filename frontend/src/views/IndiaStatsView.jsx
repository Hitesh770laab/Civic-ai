import React, { useState } from 'react';
import {
  AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert,
  Clock, Activity, Layers, Droplet, ChevronRight, TrendingUp
} from 'lucide-react';
import { playSound } from '../services/voiceAssistant';
import { useScrollRevealAll } from '../hooks/useAnimations';

export default function IndiaStatsView({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('potholes');

  useScrollRevealAll('scroll-reveal');

  const nationalMetrics = [
    {
      title: 'Annual Pothole Deaths', value: '3,597',
      sub: 'MoRTH Official Annual Fatalities', badge: '72% Two-Wheelers',
      color: '#EF4444', glow: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.2)',
      desc: 'Severe road accidents attributed directly to deep craters and unpaved road trenches.',
    },
    {
      title: 'Active Potholes / Year', value: '2.5 Cr+',
      sub: 'Across 6.3M km Road Network', badge: 'Peak Monsoon Surge',
      color: '#F59E0B', glow: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.2)',
      desc: 'Rapid water ingress and heavy axle traffic break up tarmac across Indian urban wards.',
    },
    {
      title: 'Economic Damage', value: '₹15,000 Cr',
      sub: 'Vehicle Repairs & Transit Delays', badge: 'Direct Citizen Cost',
      color: '#8B5CF6', glow: 'rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.2)',
      desc: 'Tire bursts, suspension failures, and commercial logistics transit gridlocks.',
    },
    {
      title: 'CivicAI Target SLA', value: '2h – 24h',
      sub: 'vs 45-Day Manual Red Tape', badge: '96% Faster Resolution',
      color: '#10B981', glow: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.2)',
      desc: 'Automated YOLOv8 vision detection with direct field officer priority dispatch.',
    },
  ];

  const stateData = [
    { state: 'Maharashtra', deaths: 890, potholes: '1,42,000+', oldDelay: '42 days', civicAi: '4 - 12h', risk: 'Severe' },
    { state: 'Uttar Pradesh', deaths: 710, potholes: '1,20,000+', oldDelay: '55 days', civicAi: '6 - 18h', risk: 'Severe' },
    { state: 'Karnataka', deaths: 640, potholes: '98,000+', oldDelay: '38 days', civicAi: '4 - 10h', risk: 'High' },
    { state: 'Tamil Nadu', deaths: 430, potholes: '76,000+', oldDelay: '30 days', civicAi: '3 - 8h', risk: 'Medium' },
    { state: 'Delhi-NCR', deaths: 380, potholes: '85,000+', oldDelay: '35 days', civicAi: '3 - 8h', risk: 'High' },
    { state: 'West Bengal', deaths: 410, potholes: '71,000+', oldDelay: '48 days', civicAi: '6 - 14h', risk: 'High' },
  ];

  const hazards = {
    potholes: {
      title: '🕳️ Road Potholes & Craters',
      headline: "India's #1 Urban Road Hazard for Motorists",
      bullets: [
        'Two-wheelers account for over 72% of all fatal pothole collisions in India.',
        'Water-filled puddles in monsoon act as blind traps for cyclists and commuters.',
        'CivicAI computer vision automatically flags defect area and triggers immediate repair dispatch.',
      ],
    },
    garbage: {
      title: '🗑️ Solid Waste & Dumps',
      headline: '62M Tonnes Generated · 31M Tonnes Dumped Openly',
      bullets: [
        'Uncollected plastic waste clogs stormwater roadside gutters, sparking road washouts.',
        'Creates toxic breeding grounds for vector-borne diseases in residential wards.',
        'CivicAI classifies garbage dump size and auto-assigns Solid Waste Management crews.',
      ],
    },
    lights: {
      title: '💡 Faulty Streetlights',
      headline: '18%+ Streetlight Downtime Across Arterial Roads',
      bullets: [
        'Dark arterial corridors dramatically escalate pedestrian night-time crossing fatalities.',
        'CivicAI gives instant priority boost for non-functional lights reported near key crossings.',
      ],
    },
    water: {
      title: '💧 Pipeline Leaks',
      headline: '40% Treated Municipal Water Lost in Underground Pipe Ruptures',
      bullets: [
        'Underground leaks weaken the soil foundation beneath tarmac, causing sudden sinkholes.',
        'CivicAI routes pooling water reports directly to the Water Supply & Sewerage Board.',
      ],
    },
  };

  const curHazard = hazards[activeCategory];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
      
      {/* Header Banner */}
      <div className="scroll-reveal" style={{
        background: 'rgba(13, 29, 49, 0.75)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '2.25rem',
        color: '#F8FAFC',
        border: '1px solid rgba(56, 189, 248, 0.16)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '-40px', left: '-40px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(239,68,68,0.12)',
            color: '#FCA5A5',
            border: '1px solid rgba(239,68,68,0.25)',
            padding: '0.25rem 0.7rem',
            borderRadius: '999px',
            fontSize: '0.72rem', fontWeight: 700,
            marginBottom: '0.75rem',
          }}>
            <AlertTriangle size={12} />
            <span>MoRTH & CPCB OFFICIAL CIVIC DATA</span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
            India Pothole &{' '}
            <span className="text-gradient-danger">Civic Infrastructure Crisis</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.88rem', maxWidth: '600px', lineHeight: 1.5 }}>
            Quantifying road hazards, casualty metrics, and the transformation achieved with AI-driven municipal dispatch.
          </p>
        </div>

        <button
          onClick={() => { playSound('click'); onNavigate('citizen'); }}
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #0284C7 100%)',
            color: '#FFFFFF',
            padding: '0.8rem 1.4rem',
            borderRadius: '14px',
            fontSize: '0.9rem', fontWeight: 800,
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <span>Report a Defect Now</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 4 Metric Tiles */}
      <div className="scroll-reveal" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem',
      }}>
        {nationalMetrics.map((m, idx) => (
          <div
            key={idx}
            className="tile-3d"
            style={{
              background: 'rgba(13, 29, 49, 0.75)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${m.borderColor}`,
              borderRadius: '20px',
              padding: '1.35rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: '-20px', right: '-15px',
              width: '80px', height: '80px', borderRadius: '50%',
              background: `radial-gradient(circle, ${m.glow} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <span style={{
                fontSize: '0.68rem', fontWeight: 800, color: m.color,
                background: `rgba(${m.color === '#EF4444' ? '239,68,68' : m.color === '#F59E0B' ? '245,158,11' : m.color === '#8B5CF6' ? '139,92,246' : '16,185,129'}, 0.12)`,
                padding: '0.2rem 0.55rem', borderRadius: '999px',
                border: `1px solid ${m.borderColor}`,
              }}>
                {m.badge}
              </span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: m.color, marginTop: '0.3rem', position: 'relative', zIndex: 1 }}>
              {m.value}
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#E2E8F0', position: 'relative', zIndex: 1 }}>
              {m.title}
            </div>
            <p style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.45, margin: 0, position: 'relative', zIndex: 1 }}>
              {m.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Hazard Selector */}
      <div className="scroll-reveal" style={{
        background: 'rgba(13, 29, 49, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(56, 189, 248, 0.16)',
        borderRadius: '24px',
        padding: '1.75rem',
      }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {Object.keys(hazards).map((key) => {
            const isSelected = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => { playSound('click'); setActiveCategory(key); }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.82rem', fontWeight: 700,
                  background: isSelected ? 'linear-gradient(135deg, #10B981, #0284C7)' : 'rgba(56, 189, 248, 0.08)',
                  color: isSelected ? '#FFFFFF' : '#94A3B8',
                  border: `1px solid ${isSelected ? 'transparent' : 'rgba(56, 189, 248, 0.15)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 15px rgba(16, 185, 129, 0.35)' : 'none',
                }}
              >
                {hazards[key].title}
              </button>
            );
          })}
        </div>

        <div style={{
          background: 'rgba(11, 24, 40, 0.75)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(56, 189, 248, 0.14)',
          animation: 'fadeUp 0.3s ease-out',
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.85rem' }}>
            {curHazard.headline}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {curHazard.bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', fontSize: '0.86rem', color: '#CBD5E1' }}>
                <CheckCircle2 size={15} color="#34D399" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* State Table */}
      <div className="scroll-reveal" style={{
        background: 'rgba(13, 29, 49, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(56, 189, 248, 0.16)',
        borderRadius: '24px',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '1.35rem 1.5rem 0.85rem', borderBottom: '1px solid rgba(56, 189, 248, 0.12)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC' }}>
            State-Wise Casualties & Municipal Turnaround
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{
                background: 'rgba(11, 24, 40, 0.85)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                color: '#64748B',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
              }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>State</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Deaths (MoRTH)</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Potholes Logged</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Traditional</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#4ADE80' }}>CivicAI Target</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {stateData.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14, 165, 233, 0.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'; }}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#F1F5F9' }}>{row.state}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#FCA5A5', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{row.deaths}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#CBD5E1' }}>{row.potholes}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569', textDecoration: 'line-through' }}>{row.oldDelay}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#4ADE80', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{row.civicAi}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      fontSize: '0.68rem', fontWeight: 800,
                      background: row.risk === 'Severe' ? 'rgba(239,68,68,0.15)' : row.risk === 'High' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                      color: row.risk === 'Severe' ? '#FCA5A5' : row.risk === 'High' ? '#FCD34D' : '#86EFAC',
                      border: `1px solid ${row.risk === 'Severe' ? 'rgba(239,68,68,0.3)' : row.risk === 'High' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
                    }}>
                      {row.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
