import React, { useState } from 'react';
import {
  AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert,
  Clock, Activity, Layers, Droplet, ChevronRight, TrendingUp
} from 'lucide-react';
import { playSound } from '../services/voiceAssistant';

export default function IndiaStatsView({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('potholes');

  const nationalMetrics = [
    {
      title: 'Annual Pothole Deaths',
      value: '3,597',
      sub: 'MoRTH Official Annual Fatalities',
      badge: '72% Two-Wheelers',
      color: '#DC2626',
      border: '#FEE2E2',
      bg: '#FEF2F2',
      desc: 'Severe road accidents attributed directly to deep craters and unpaved road trenches.',
    },
    {
      title: 'Active Potholes / Year',
      value: '2.5 Cr+',
      sub: 'Across 6.3M km Road Network',
      badge: 'Peak Monsoon Surge',
      color: '#D97706',
      border: '#FEF3C7',
      bg: '#FFFBEB',
      desc: 'Rapid water ingress and heavy axle traffic break up tarmac across Indian urban wards.',
    },
    {
      title: 'Economic Damage',
      value: '₹15,000 Cr',
      sub: 'Vehicle Repairs & Transit Delays',
      badge: 'Direct Citizen Cost',
      color: '#4F46E5',
      border: '#E0E7FF',
      bg: '#EEF2FF',
      desc: 'Tire bursts, suspension failures, and commercial logistics transit gridlocks.',
    },
    {
      title: 'CivicAI Target SLA',
      value: '2h – 24h',
      sub: 'vs 45-Day Manual Red Tape',
      badge: '96% Faster Resolution',
      color: '#16A34A',
      border: '#DCFCE7',
      bg: '#F0FDF4',
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
      headline: 'India’s #1 Urban Road Hazard for Motorists',
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
      <div style={{
        background: 'linear-gradient(135deg, #0B0F19 0%, #1E293B 100%)',
        borderRadius: '20px',
        padding: '2rem',
        color: '#FFFFFF',
        border: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(239,68,68,0.18)',
            color: '#F87171',
            border: '1px solid rgba(239,68,68,0.3)',
            padding: '0.2rem 0.65rem',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 700,
            marginBottom: '0.6rem',
          }}>
            <AlertTriangle size={12} />
            <span>MoRTH &amp; CPCB OFFICIAL CIVIC DATA</span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            India Pothole &amp; Civic Infrastructure Crisis
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', maxWidth: '600px', lineHeight: 1.5 }}>
            Quantifying road hazards, casualty metrics, and the transformation achieved with AI-driven municipal dispatch.
          </p>
        </div>

        <button
          onClick={() => {
            playSound('click');
            onNavigate('citizen');
          }}
          style={{
            background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
            color: '#FFFFFF',
            padding: '0.75rem 1.35rem',
            borderRadius: '12px',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(14, 165, 233, 0.35)',
          }}
        >
          <span>Report a Defect Now</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 4 Metric Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1rem',
      }}>
        {nationalMetrics.map((m, idx) => (
          <div
            key={idx}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${m.border}`,
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: m.color, background: m.bg, padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                {m.badge}
              </span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: m.color, marginTop: '0.25rem' }}>
              {m.value}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
              {m.title}
            </div>
            <p style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.45, margin: 0 }}>
              {m.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Hazard Selector Pills & Info */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '18px',
        padding: '1.5rem',
      }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {Object.keys(hazards).map((key) => {
            const isSelected = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => {
                  playSound('click');
                  setActiveCategory(key);
                }}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  background: isSelected ? '#2563EB' : '#F1F5F9',
                  color: isSelected ? '#FFFFFF' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {hazards[key].title}
              </button>
            );
          })}
        </div>

        <div style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid #E2E8F0',
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
            {curHazard.headline}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {curHazard.bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: '#334155' }}>
                <CheckCircle2 size={15} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compact State Table */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '18px',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '1.25rem 1.25rem 0.75rem', borderBottom: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
            State-Wise Casualties &amp; Municipal Turnaround
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>State</th>
                <th style={{ padding: '0.75rem 1rem' }}>Deaths (MoRTH)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Potholes Logged</th>
                <th style={{ padding: '0.75rem 1rem' }}>Traditional Turnaround</th>
                <th style={{ padding: '0.75rem 1rem', color: '#16A34A' }}>CivicAI Target</th>
                <th style={{ padding: '0.75rem 1rem' }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {stateData.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F172A' }}>{row.state}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#DC2626', fontWeight: 700 }}>{row.deaths}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{row.potholes}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#94A3B8', textDecoration: 'line-through' }}>{row.oldDelay}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#16A34A', fontWeight: 700 }}>{row.civicAi}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      padding: '0.15rem 0.45rem',
                      borderRadius: '999px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      background: row.risk === 'Severe' ? '#FEE2E2' : row.risk === 'High' ? '#FEF3C7' : '#DCFCE7',
                      color: row.risk === 'Severe' ? '#991B1B' : row.risk === 'High' ? '#92400E' : '#166534',
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
