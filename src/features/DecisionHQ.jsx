import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { 
  Target, Award, DollarSign, Star, AlertCircle, 
  Check, X, BarChart3, TrendingUp, Trophy 
} from 'lucide-react';

export default function DecisionHQ({ onSelectSchool, onOpenAI }) {
  const { schools, schols, calcScore, getFinCalc, formatUSD, CRITERIA } = useAppContext();

  if (schools.length < 2) {
    return (
      <Card style={{ textAlign: "center", padding: "40px 20px" }}>
        <Target size={32} style={{ margin: "0 auto 12px", color: "var(--text-light)" }} />
        <h2 style={{ marginBottom: "12px" }}>Decision Headquarters</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
          Add at least two schools to see detailed comparisons and rankings.
        </p>
      </Card>
    );
  }

  const ranked = [...schools].sort((a, b) => calcScore(b) - calcScore(a));
  const cheapest = [...schools].sort((a, b) => getFinCalc(a, schols).net - getFinCalc(b, schols).net);

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Decision Headquarters</h2>
        <button 
          onClick={() => onOpenAI && onOpenAI()}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 16px",
            borderRadius: "10px", border: "1px solid var(--border-color)",
            background: "var(--primary-light)", color: "var(--primary)",
            fontSize: "13px", fontWeight: "600", cursor: "pointer"
          }}
        >
          <Trophy size={16} />
          Generate Full Decision Report
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <Card style={{ borderTop: "4px solid var(--primary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Target size={18} style={{ color: "var(--primary)" }} />
            <strong style={{ fontSize: "14px" }}>Top Ranked Fit</strong>
          </div>
          {ranked.slice(0, 3).map((s, i) => (
            <div key={s.id} onClick={() => onSelectSchool(s)} style={{ 
              display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", 
              borderBottom: i < 2 ? "1px solid var(--border-color)" : "none", cursor: "pointer" 
            }}>
              <span style={{ fontSize: "16px", fontWeight: "800", color: i === 0 ? "var(--primary)" : "var(--text-light)", minWidth: "24px" }}>#{i + 1}</span>
              <div style={{ width: "4px", height: "16px", borderRadius: "2px", background: s.color }} />
              <div style={{ flex: 1, fontSize: "13px", fontWeight: "600" }}>{s.name}</div>
              <div style={{ fontWeight: "800", color: "var(--text-muted)" }}>{calcScore(s)}</div>
            </div>
          ))}
        </Card>

        <Card style={{ borderTop: "4px solid var(--info)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <DollarSign size={18} style={{ color: "var(--info)" }} />
            <strong style={{ fontSize: "14px" }}>Most Affordable</strong>
          </div>
          {cheapest.slice(0, 3).map((s, i) => (
            <div key={s.id} onClick={() => onSelectSchool(s)} style={{ 
              display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", 
              borderBottom: i < 2 ? "1px solid var(--border-color)" : "none", cursor: "pointer" 
            }}>
              <span style={{ fontSize: "16px", fontWeight: "800", color: i === 0 ? "var(--info)" : "var(--text-light)", minWidth: "24px" }}>#{i + 1}</span>
              <div style={{ width: "4px", height: "16px", borderRadius: "2px", background: s.color }} />
              <div style={{ flex: 1, fontSize: "13px", fontWeight: "600" }}>{s.name}</div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)" }}>{formatUSD(getFinCalc(s, schols).net)}</div>
            </div>
          ))}
        </Card>
      </div>

      <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>Side-by-Side Comparison</h3>
      <Card style={{ overflowX: "auto", padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "var(--bg-main)" }}>
              <th style={{ textAlign: "left", padding: "12px 16px", borderBottom: "1px solid var(--border-color)" }}>Metric</th>
              {ranked.slice(0, 4).map(s => (
                <th key={s.id} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-color)", textAlign: "center" }}>
                   <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                     <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color }} />
                     {s.name.split(' ')[0]}
                   </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-color)", fontWeight: "600" }}>Overall Score</td>
              {ranked.slice(0, 4).map(s => (
                <td key={s.id} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-color)", textAlign: "center" }}>
                  <strong style={{ fontSize: "16px", color: "var(--primary)" }}>{calcScore(s)}</strong>
                </td>
              ))}
            </tr>
            {CRITERIA.slice(0, 5).map(c => (
              <tr key={c.id}>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <c.Icon size={12} /> {c.label}
                  </div>
                </td>
                {ranked.slice(0, 4).map(s => (
                  <td key={s.id} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-color)", textAlign: "center" }}>
                    {s.scores?.[c.id] || 0}
                  </td>
                ))}
              </tr>
            ))}
            <tr style={{ background: "var(--primary-light)" }}>
              <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-color)", fontWeight: "600" }}>Net Cost / Year</td>
              {ranked.slice(0, 4).map(s => (
                <td key={s.id} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-color)", textAlign: "center", color: "var(--danger)", fontWeight: "700" }}>
                  {formatUSD(getFinCalc(s, schols).net)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
