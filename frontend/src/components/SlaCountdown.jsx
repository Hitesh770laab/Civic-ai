import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SlaCountdown({ deadline, status }) {
  const [state, setState] = useState({ h: 0, m: 0, s: 0, total: 0, overdue: false });

  useEffect(() => {
    function tick() {
      if (!deadline || status === 'RESOLVED' || status === 'VERIFIED_CLOSED') return;
      const diff = Math.floor((new Date(deadline) - Date.now()) / 1000);
      const abs = Math.abs(diff);
      setState({
        h: Math.floor(abs / 3600),
        m: Math.floor((abs % 3600) / 60),
        s: abs % 60,
        total: diff,
        overdue: diff <= 0,
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline, status]);

  const pad = (n) => String(n).padStart(2, '0');

  if (status === 'RESOLVED' || status === 'VERIFIED_CLOSED') {
    return (
      <span className="sla-ok">
        <CheckCircle2 size={12} />
        Resolved
      </span>
    );
  }

  const { h, m, s, total, overdue } = state;

  if (overdue) {
    return (
      <span className="sla-overdue">
        <AlertCircle size={12} />
        Overdue {h}h {pad(m)}m
      </span>
    );
  }

  if (total < 14400) { // < 4h
    return (
      <span className="sla-warning">
        <AlertTriangle size={12} />
        {h}h {pad(m)}m {pad(s)}s
      </span>
    );
  }

  return (
    <span className="sla-ok">
      <Clock size={12} />
      {h}h {pad(m)}m left
    </span>
  );
}
