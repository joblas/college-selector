import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ScoreRing } from '../components/Specialized';
import { CheckCircle, DollarSign, Clock, Sparkles, Trophy, Target, BookOpen, Award, Rocket, Star, Lightbulb, Plus } from 'lucide-react';

const STEPS = [
  { id: 1, icon: Target, title: 'Add Schools', desc: 'Find your dream colleges', key: 'schools' },
  { id: 2, icon: BookOpen, title: 'Write Essays', desc: 'Craft your story', key: 'essays' },
  { id: 3, icon: Award, title: 'Find Scholarships', desc: 'Fund your future', key: 'schols' },
  { id: 4, icon: Trophy, title: 'Make Decision', desc: 'Choose your winner', key: 'decision' },
];

export default function Dashboard({ onSelectSchool, onOpenAI, onAddSchool }) {
  const { schools, schols, calcScore, getFinCalc, formatUSD, nudges, globalProgress, profile } = useAppContext();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleAddSchool = () => {
    if (onAddSchool) onAddSchool();
  };

  // Empty state - welcome flow
  if (schools.length === 0) {
    return (
      <div className="animate-fade-in" style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        {/* Welcome Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ 
            width: "80px", height: "80px", borderRadius: "50%", 
            background: "linear-gradient(135deg, var(--primary), #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", boxShadow: "0 8px 32px rgba(134, 59, 255, 0.3)"
          }}>
            <Sparkles size={36} color="#fff" />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "8px" }}>
            {getGreeting()}, {profile.name || 'Future Student'}! 🎓
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6" }}>
            Let's find your perfect college together. I'll guide you every step of the way!
          </p>
        </div>

        {/* Step Preview */}
        <div style={{ 
          background: "var(--bg-card)", borderRadius: "20px", padding: "24px", 
          marginBottom: "24px", border: "1px solid var(--border-color)"
        }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "16px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Your Journey
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {STEPS.map((step, i) => (
              <div key={step.id} style={{
                padding: "16px", borderRadius: "12px",
                background: i === 0 ? "var(--primary-light)" : "var(--bg-main)",
                border: i === 0 ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                opacity: i === 0 ? 1 : 0.6
              }}>
                <step.icon size={20} style={{ color: i === 0 ? "var(--primary)" : "var(--text-muted)", marginBottom: "8px" }} />
                <p style={{ fontSize: "13px", fontWeight: "700" }}>{step.title}</p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button 
            onClick={onOpenAI}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
              padding: "16px 24px", borderRadius: "14px",
              background: "var(--primary)", color: "#fff", border: "none",
              fontSize: "15px", fontWeight: "700", cursor: "pointer",
              boxShadow: "0 6px 20px rgba(134, 59, 255, 0.35)"
            }}
          >
            <Rocket size={20} />
            Start with AI Recommendation
          </button>
          <button 
            onClick={handleAddSchool}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "12px 20px", borderRadius: "12px",
              background: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-color)",
              fontSize: "14px", fontWeight: "600", cursor: "pointer"
            }}
          >
            <Plus size={18} />
            Add School Manually
          </button>
        </div>
      </div>
    );
  }

  // Dashboard with schools
  return (
    <div className="animate-fade-in" style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Progress Hero */}
      <div style={{ 
        padding: "24px", borderRadius: "20px", 
        background: "linear-gradient(135deg, var(--primary), #6366f1)", 
        color: "#fff", marginBottom: "24px",
        boxShadow: "0 8px 32px rgba(134, 59, 255, 0.25)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <div style={{ 
            width: "60px", height: "60px", borderRadius: "50%", 
            background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Trophy size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "800" }}>
              {globalProgress === 100 ? 'You did it! 🎉' : `${globalProgress}% Complete`}
            </h2>
            <p style={{ fontSize: "13px", opacity: 0.9 }}>
              {globalProgress === 100 ? "You're ready for admission day!" : "Keep going, you're doing amazing!"}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{ height: "8px", background: "rgba(255,255,255,0.2)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ width: `${globalProgress}%`, height: "100%", background: "#fff", borderRadius: "4px", transition: "width 0.5s ease" }} />
        </div>

        {/* Quick Stats */}
        <div style={{ display: "flex", gap: "20px", marginTop: "16px" }}>
          <div>
            <p style={{ fontSize: "11px", opacity: 0.7 }}>Schools</p>
            <p style={{ fontSize: "18px", fontWeight: "800" }}>{schools.length}</p>
          </div>
          <div>
            <p style={{ fontSize: "11px", opacity: 0.7 }}>Essays</p>
            <p style={{ fontSize: "18px", fontWeight: "800" }}>{profile.essays?.length || 0}</p>
          </div>
          <div>
            <p style={{ fontSize: "11px", opacity: 0.7 }}>Scholarships</p>
            <p style={{ fontSize: "18px", fontWeight: "800" }}>{schols.length}</p>
          </div>
        </div>
      </div>

      {/* Next Action Card */}
      <div style={{ 
        background: "var(--bg-card)", borderRadius: "16px", padding: "20px", 
        marginBottom: "24px", border: "1px solid var(--border-color)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <Star size={18} style={{ color: "var(--primary)" }} />
          <h3 style={{ fontSize: "15px", fontWeight: "700" }}>Your Next Step</h3>
        </div>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>
          {nudges[0]?.text || "Keep adding schools to build your list!"}
        </p>
        <button 
          onClick={onOpenAI}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 18px", borderRadius: "10px",
            background: "var(--primary-light)", color: "var(--primary)",
            border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer"
          }}
        >
          <Sparkles size={16} />
          Ask AI for help
        </button>
      </div>

      {/* Schools Section */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Your Schools ({schools.length})</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
          {schools.sort((a, b) => calcScore(b) - calcScore(a)).map((s) => {
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
              <Card 
                key={s.id} 
                onClick={() => onSelectSchool(s)} 
                hover 
                style={{ 
                  borderTop: `4px solid ${s.color || 'var(--primary)'}`, 
                  padding: "16px", borderRadius: "14px", cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", flex: 1 }}>{s.name}</h4>
                  <Badge bg={bg} color={fg} style={{ fontSize: "9px", padding: "3px 6px" }}>{s.status}</Badge>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <ScoreRing score={score} size={40} color={score > 80 ? "var(--success)" : score > 60 ? "var(--warning)" : "var(--primary)"} />
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {net > 0 && <p style={{ color: "var(--danger)", fontWeight: "600" }}>{formatUSD(net)}/yr</p>}
                    {s.deadline && <p style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={10} />{new Date(s.deadline).toLocaleDateString()}</p>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}