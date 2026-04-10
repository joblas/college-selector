import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ScoreRing, AIBtn } from '../components/Specialized';
import { CheckCircle, DollarSign, Clock, Sparkles, AlertCircle, Info, Check } from 'lucide-react';

export default function Dashboard({ onSelectSchool }) {
  const { schools, schols, calcScore, getFinCalc, formatUSD, apiKey, ctx, nudges, globalProgress } = useAppContext();

  if (schools.length === 0) {
    return (
      <div className="animate-fade-in" style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ display: "inline-flex", padding: "24px", borderRadius: "50%", background: "linear-gradient(135deg, #fff, #f0644910)", marginBottom: "24px", boxShadow: "var(--shadow-md)" }}>
          <Sparkles size={48} style={{ color: "var(--primary)" }} />
        </div>
        <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "12px", letterSpacing: "-0.02em" }}>Ready to Start, Kaylani?</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
          Your dream college is waiting. Add your first school to begin your journey and unlock your AI Admissions Roadmap.
        </p>
        <AIBtn 
          ctx={ctx} 
          apiKey={apiKey} 
          label="Help me find a school" 
          Icon={Sparkles} 
          prompt="I'm just starting. Based on my profile (if any), suggest 3 schools I should look into first." 
          onClick={() => {}} 
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Morning Digest / Roadmap Card */}
      <section style={{ marginBottom: "40px" }}>
        <div className="glass" style={{ 
          padding: "32px", 
          borderRadius: "var(--radius-lg)", 
          background: "linear-gradient(135deg, #f06449, #6366f1)", 
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)"
        }}>
          {/* Subtle Background Icon */}
          <GraduationCap size={160} style={{ position: "absolute", right: "-20px", bottom: "-40px", opacity: 0.1, transform: "rotate(-15deg)" }} />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>Good Morning, Kaylani! ✨</h2>
            <p style={{ fontSize: "15px", opacity: 0.9, marginBottom: "24px" }}>You've completed <strong>{globalProgress}%</strong> of your admissions roadmap. Let's keep the momentum going!</p>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {nudges.slice(0, 3).map((n, i) => (
                <div 
                  key={n.id} 
                  className="animate-slide-in"
                  style={{ 
                    flex: "1 1 200px",
                    background: "rgba(255,255,255,0.15)", 
                    padding: "16px", 
                    borderRadius: "var(--radius-md)", 
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    animationDelay: `${i * 0.1}s`
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <div style={{ padding: "4px", borderRadius: "50%", background: "#fff", color: "var(--primary)" }}>
                      {n.type === 'danger' ? <AlertCircle size={14} /> : n.type === 'warning' ? <Info size={14} /> : <Check size={14} />}
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em" }}>Priority</span>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: "600", lineHeight: "1.4" }}>{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Your Contenders</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-muted)" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)" }} />
          <span>Active Roadmap</span>
        </div>
      </div>

      <div className="grid-auto">
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
            <div key={s.id} className="animate-scale-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <Card onClick={() => onSelectSchool(s)} hover style={{ borderTop: `4px solid ${s.color || 'var(--primary)'}`, padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: "700", flex: 1, minWidth: 0 }}>{s.name}</h3>
                  <Badge bg={bg} color={fg}>{s.status}</Badge>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <div style={{ position: "relative" }}>
                    <ScoreRing score={score} size={54} color={score > 80 ? "var(--success)" : score > 60 ? "var(--warning)" : "var(--primary)"} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: "var(--text-muted)" }}>FIT</div>
                  </div>
                  
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <CheckCircle size={14} style={{ color: Object.keys(s.scores || {}).length >= 10 ? "var(--success)" : "var(--text-light)" }} />
                      {Object.keys(s.scores || {}).length}/10 Scored
                    </span>
                    {net > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--danger)", fontWeight: "600" }}>
                        <DollarSign size={14} />
                        {formatUSD(net)}/yr Net
                      </span>
                    )}
                    {s.deadline && (
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Clock size={14} />
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
