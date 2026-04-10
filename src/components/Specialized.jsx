import React from 'react';
import { Bot } from 'lucide-react';
import { Button } from './Button';

export function ScoreRing({ score, color, size = 48 }) {
  const r = size * 0.4;
  const circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;
  return (
    <div className="flex-center" style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8e5e0" strokeWidth="4" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4" 
                strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div style={{ position: "absolute", fontSize: size * 0.28, fontWeight: 800, color }}>{score}</div>
    </div>
  );
}

export function Dots() {
  return (
    <div style={{ display: "flex", gap: "4px", padding: "8px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} className="animate-pulse" style={{ width: "6px", height: "6px", background: "var(--primary)", borderRadius: "50%", animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  );
}

export function AIBtn({ label, Icon: Ic, onClick }) {
  return (
    <Button 
      variant="outline" 
      onClick={onClick}
      style={{ width: "100%", marginBottom: "12px", background: "var(--primary-light)", borderColor: "rgba(240, 100, 73, 0.2)" }}
    >
      {Ic ? <Ic size={16} style={{ color: "var(--primary)" }} /> : <Bot size={16} style={{ color: "var(--primary)" }} />}
      <span style={{ fontSize: "12px", color: "var(--primary)" }}>{label}</span>
    </Button>
  );
}
