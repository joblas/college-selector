import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Input, TextArea, Select } from '../components/Input';
import { ScoreRing } from '../components/Specialized';
import { 
  X, Trash2, Edit3, DollarSign, Award, CheckCircle, 
  AlertCircle, BookOpen, Clock, FileText, BarChart3, 
  Target, Bot, Star, Zap, Eye, ListChecks, History, 
  MoreVertical, Plus, Check, Building
} from 'lucide-react';

export default function SchoolDetails({ school: s, onClose, onUpdate, onDelete }) {
  const { 
    schols, calcScore, getFinCalc, formatUSD, CRITERIA, FIN 
  } = useAppContext();
  
  const [tab, setTab] = useState('score');
  const score = calcScore(s);
  const fin = getFinCalc(s, schols);

  const TABS = [
    { id: 'score', l: 'Score', icon: Target },
    { id: 'money', l: 'Money', icon: DollarSign },
    { id: 'tasks', l: 'Tasks', icon: ListChecks },
    { id: 'stats', l: 'Stats', icon: BarChart3 },
    { id: 'pros', l: 'P/C', icon: Star },
    { id: 'docs', l: 'Docs', icon: FileText },
    { id: 'notes', l: 'Notes', icon: Edit3 },
  ];

  function update(delta) {
    onUpdate({ ...s, ...delta });
  }

  const [newPro, setNewPro] = useState("");
  const [newCon, setNewCon] = useState("");

  return (
    <div className="animate-fade-in" style={{ paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", gap: "16px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <Button variant="ghost" onClick={onClose} style={{ padding: "6px", borderRadius: "50%" }}>
              <X size={20} />
            </Button>
            <h2 style={{ fontSize: "28px", fontWeight: "800", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>{s.name}</h2>
          </div>
          <div style={{ display: "flex", gap: "8px", marginLeft: "40px", flexWrap: "wrap" }}>
            <Badge bg="var(--secondary)" color="#fff">{s.status}</Badge>
            {s.major && <Badge bg="var(--border-color)" color="var(--text-main)">{s.major}</Badge>}
            {s.deadline && <Badge bg="#fef3c7" color="#d97706"><Clock size={12} style={{marginRight: "4px"}} />{new Date(s.deadline).toLocaleDateString()}</Badge>}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <ScoreRing score={score} size={64} color={score > 80 ? "var(--success)" : score > 60 ? "var(--warning)" : "var(--primary)"} />
          <Button variant="ghost" onClick={onDelete} style={{ color: "var(--danger)", fontSize: "11px", marginTop: "8px" }}>
            <Trash2 size={12} /> Remove School
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={() => {}}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            width: "100%", padding: "12px 16px",
            borderRadius: "10px", border: "1px solid var(--border-color)",
            background: "var(--primary-light)", color: "var(--primary)",
            fontSize: "13px", fontWeight: "600", cursor: "pointer"
          }}
        >
          <Bot size={16} />
          Deep Dive — {s.name}
        </button>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", overflowX: "auto", paddingBottom: "8px", borderBottom: "1px solid var(--border-color)" }}>
        {TABS.map(t => (
          <Button 
            key={t.id} 
            variant={tab === t.id ? "secondary" : "ghost"}
            onClick={() => setTab(t.id)}
            style={{ padding: "10px 16px", borderRadius: "var(--radius-md)", whiteSpace: "nowrap" }}
          >
            <t.icon size={16} />
            <span style={{ fontSize: "13px", fontWeight: "600" }}>{t.l}</span>
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in" key={tab}>
        {tab === 'score' && (
          <div className="grid-auto">
            {CRITERIA.map(c => (
              <Card key={c.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "700" }}>
                    <div style={{ color: "var(--primary)" }}><c.Icon size={16} /></div>
                    {c.label}
                  </div>
                  <strong style={{ fontSize: "18px", color: "var(--primary)" }}>{s.scores?.[c.id] || 0}</strong>
                </div>
                <input 
                  type="range" min="0" max="10" step="1" 
                  value={s.scores?.[c.id] || 0}
                  onChange={e => update({ scores: { ...(s.scores || {}), [c.id]: parseInt(e.target.value) } })}
                  style={{ width: "100%", accentColor: "var(--primary)", height: "6px" }}
                />
              </Card>
            ))}
          </div>
        )}

        {tab === 'money' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
              <Card style={{ borderTop: "4px solid var(--danger)", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>Annual Cost</div>
                <div style={{ fontSize: "20px", fontWeight: "800" }}>{formatUSD(fin.cost)}</div>
              </Card>
              <Card style={{ borderTop: "4px solid var(--success)", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>Total Aid</div>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--success)" }}>{formatUSD(fin.freeAid)}</div>
              </Card>
              <Card style={{ borderTop: "4px solid var(--secondary)", textAlign: "center", background: "var(--bg-main)" }}>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>Net Pocket</div>
                <div style={{ fontSize: "22px", fontWeight: "900" }}>{formatUSD(fin.net)}</div>
              </Card>
            </div>
            
            <Card>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Detailed Financials</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {FIN.map(f => (
                  <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--bg-main)" }}>
                    <span style={{ fontSize: "13px", color: "var(--text-main)", fontWeight: "500" }}>{f.l}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>$</span>
                      <input 
                        type="number" 
                        value={s.finances?.[f.id] || ""}
                        onChange={e => update({ finances: { ...(s.finances || {}), [f.id]: e.target.value } })}
                        placeholder="0"
                        style={{ width: "100px", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-sm)", padding: "6px 10px", textAlign: "right", fontSize: "14px", fontWeight: "600" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab === 'tasks' && (
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Next Actions</h3>
              <Button onClick={() => {
                const text = prompt("What needs to be done?");
                if (text) update({ checklist: [...(s.checklist || []), { id: Date.now(), text, done: false }] });
              }}>
                 <Plus size={16} /> Add Task
              </Button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(s.checklist || []).length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>
                  <CheckCircle size={32} style={{ opacity: 0.1, marginBottom: "8px" }} />
                  <p>All caught up!</p>
                </div>
              ) : (
                s.checklist.map(t => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "var(--radius-sm)", background: "var(--bg-main)", transition: "var(--transition)" }}>
                    <input 
                      type="checkbox" checked={t.done} 
                      onChange={() => update({ checklist: s.checklist.map(x => x.id === t.id ? { ...x, done: !x.done } : x) })}
                      style={{ width: "18px", height: "18px", accentColor: "var(--success)" }}
                    />
                    <span style={{ flex: 1, fontSize: "14px", fontWeight: "500", textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--text-muted)" : "var(--text-main)" }}>{t.text}</span>
                    <Button variant="ghost" onClick={() => update({ checklist: s.checklist.filter(x => x.id !== t.id) })} style={{ padding: "4px", color: "var(--danger)" }}>
                      <X size={14} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {tab === 'stats' && (
          <div className="grid-auto">
            {[
              { id: 'accept', l: 'Acceptance %', icon: Target },
              { id: 'gpa', l: 'Avg GPA', icon: BookOpen },
              { id: 'sat', l: 'Avg SAT', icon: Star },
              { id: 'act', l: 'Avg ACT', icon: Zap },
              { id: 'size', l: 'Campus Size', icon: Building },
              { id: 'ratio', l: 'Faculty Ratio', icon: History }
            ].map(f => (
              <Card key={f.id} style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: "700", textTransform: "uppercase" }}>
                  <f.icon size={12} /> {f.l}
                </div>
                <input 
                  placeholder="—"
                  value={s.admissions?.[f.id] || ""}
                  onChange={e => update({ admissions: { ...(s.admissions || {}), [f.id]: e.target.value } })}
                  style={{ width: "100%", fontSize: "20px", fontWeight: "800", textAlign: "center", border: "none", outline: "none", background: "transparent" }}
                />
              </Card>
            ))}
          </div>
        )}

        {tab === 'pros' && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Card>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--success)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Check size={16} /> Pros
              </h3>
              <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
                <Input placeholder="Add a pro..." value={newPro} onChange={e => setNewPro(e.target.value)} style={{ marginBottom: 0 }} />
                <Button onClick={() => { if(newPro) { update({ pros: [...(s.pros || []), { id: Date.now(), text: newPro }] }); setNewPro(""); } }}><Plus size={16} /></Button>
              </div>
              {(s.pros || []).map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "6px", fontSize: "13px" }}>
                  <span>• {p.text}</span>
                  <button onClick={() => update({ pros: s.pros.filter(x => x.id !== p.id) })} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}><X size={12} /></button>
                </div>
              ))}
            </Card>
            <Card>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--danger)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <X size={16} /> Cons
              </h3>
              <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
                <Input placeholder="Add a con..." value={newCon} onChange={e => setNewCon(e.target.value)} style={{ marginBottom: 0 }} />
                <Button variant="danger" onClick={() => { if(newCon) { update({ cons: [...(s.cons || []), { id: Date.now(), text: newCon }] }); setNewCon(""); } }}><Plus size={16} /></Button>
              </div>
              {(s.cons || []).map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "6px", fontSize: "13px" }}>
                  <span>• {p.text}</span>
                  <button onClick={() => update({ cons: s.cons.filter(x => x.id !== p.id) })} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}><X size={12} /></button>
                </div>
              ))}
            </Card>
          </div>
        )}

        {tab === 'docs' && (
          <Card>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Application Documents</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(s.documents || []).length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>No documents tracked yet.</div>
              ) : (
                s.documents.map(d => (
                  <div key={d.id} className="flex-center" style={{ justifyContent: "space-between", padding: "12px", background: "var(--bg-main)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <FileText size={18} style={{ color: "var(--info)" }} />
                      <span style={{ fontWeight: "600", fontSize: "14px" }}>{d.name}</span>
                    </div>
                    <Button variant="ghost" onClick={() => update({ documents: s.documents.filter(x => x.id !== d.id) })} style={{ color: "var(--danger)" }}><Trash2 size={14} /></Button>
                  </div>
                ))
              )}
               <Button variant="secondary" onClick={() => {
                const name = prompt("Document name:");
                if (name) update({ documents: [...(s.documents || []), { id: Date.now(), name }] });
              }}>
                 <Plus size={16} /> Add Document Reference
              </Button>
            </div>
          </Card>
        )}

        {tab === 'notes' && (
          <Card>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>Personal Notes</h3>
            <TextArea 
              placeholder="Jot down your impressions, questions for the recruiter, or campus visit notes..."
              value={s.notes || ""}
              onChange={e => update({ notes: e.target.value })}
              style={{ minHeight: "300px", fontSize: "15px", lineHeight: "1.6" }}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
