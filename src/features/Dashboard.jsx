import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ScoreRing, AIBtn } from '../components/Specialized';
import { CheckCircle, DollarSign, Clock, Sparkles, AlertCircle, Info, Check, GraduationCap } from 'lucide-react';

export default function Dashboard({ onSelectSchool }) {
  const { schools, schols, calcScore, getFinCalc, formatUSD, nudges, globalProgress } = useAppContext();

  if (schools.length === 0) {
    return (
      <div className="animate-fade-in" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ 
          display: "inline-flex", padding: "24px", borderRadius: "50%", 
          background: "linear-gradient(135deg, #fff, #f3edff)", marginBottom: "24px", 
          boxShadow: "var(--shadow-md)"
        }}>
          <Sparkles size={40} style={{ color: "var(--primary)" }} />
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "12px" }}>Ready to Start?</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "24px" }}>
          Add your first school to unlock your AI Admissions Roadmap.
        </p>
        <AIBtn 
          ctx={{}} 
          label="Help me find a school" 
          Icon={Sparkles} 
          prompt="I'm just starting. Based on my profile, suggest 3 schools I should look into first." 
          onClick={() => {}} 
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Card - Full width on mobile */}
      <section style={{ marginBottom: "24px" }}>
        <div style={{ 
          padding: "20px", 
          borderRadius: "16px", 
          background: "linear-gradient(135deg, var(--primary), #6366f1)", 
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "4px" }}>Good Morning! ✨</h2>
          <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "16px" }}>
            <strong>{globalProgress}%</strong> complete
          </p>
          
          {/* Mobile-friendly nudges */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {nudges.slice(0, 2).map((n, i) => (
              <div 
                key={n.id} 
                style={{ 
                  background: "rgba(255,255,255,0.15)", 
                  padding: "12px", 
                  borderRadius: "10px", 
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <p style={{ fontSize: "13px", fontWeight: "600", lineHeight: "1.4" }}>{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Your Schools</h2>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{schools.length} schools</span>
      </div>

      {/* School Cards - Single column on mobile */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: "12px" 
      }}>
        {schools.sort((a, b) => calcScore(b) - calcScore(a)).map((s, i) => {
          const score = calcScore(s);
          const { net } = getFinCalc(s, schols);
          const statusColors = {
            'Considering': ['#f3f4f6', '#4b5563'],
            'Applied': ['#eff6ff', '#2563eb'],
            'Accepted': ['#ecfdf5', '#059669'],
            'Waitlisted': ['#fffbeb', '#d97706'],
            'Committed': ['#f5f3ff', '#7c3aed']
          };
          const [bg, fg] = statusColors[s.status] || ['#f3f4f6', '#4b5563'];

          return (
            <div key={s.id}>
              <Card 
                onClick={() => onSelectSchool(s)} 
                hover 
                style={{ 
                  borderTop: `4px solid ${s.color || 'var(--primary)'}`, 
                  padding: "16px",
                  borderRadius: "14px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", flex: 1, minWidth: 0 }}>{s.name}</h3>
                  <Badge bg={bg} color={fg} style={{ fontSize: "10px", padding: "4px 8px" }}>{s.status}</Badge>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <ScoreRing 
                    score={score} 
                    size={48} 
                    color={score > 80 ? "var(--success)" : score > 60 ? "var(--warning)" : "var(--primary)"} 
                  />
                  
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckCircle size={12} style={{ color: Object.keys(s.scores || {}).length >= 10 ? "var(--success)" : "var(--text-light)" }} />
                      {Object.keys(s.scores || {}).length}/10
                    </span>
                    {net > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--danger)", fontWeight: "600", fontSize: "11px" }}>
                        <DollarSign size={12} />
                        {formatUSD(net)}/yr
                      </span>
                    )}
                    {s.deadline && (
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Clock size={12} />
                        {new Date(s.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}