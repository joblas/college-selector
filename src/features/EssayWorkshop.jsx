import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TextArea, Input } from '../components/Input';
import { PenLine, Plus, Trash2, Lightbulb, ListChecks, Star, Zap, Bot, X } from 'lucide-react';
import { callAI } from '../services/ai';
import { Dots } from '../components/Specialized';
import { celebrateQuick } from '../utils/celebrate';

export default function EssayWorkshop() {
  const { profile, setProfile, ctx, apiKey } = useAppContext();
  const [essays, setEssays] = useState(profile.essays || []);
  const [selected, setSelected] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    setProfile(p => ({ ...p, essays }));
  }, [essays, setProfile]);

  const addEssay = () => {
    if (!newTitle.trim()) return;
    const e = { id: Date.now(), title: newTitle, prompt: "", draft: "", status: "Not Started", celebrated: false };
    setEssays(p => [...p, e]);
    setSelected(e);
    setNewTitle("");
  };

  const updateEssay = (id, updates) => {
    setEssays(p => p.map(e => {
      if (e.id === id) {
        const next = { ...e, ...updates };
        const wordCount = (next.draft || "").split(/\s+/).filter(Boolean).length;
        if (wordCount >= 250 && !next.celebrated) {
          celebrateQuick();
          next.celebrated = true;
        }
        return next;
      }
      return e;
    }));
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...updates }));
  };

  const deleteEssay = (id) => {
    setEssays(p => p.filter(e => e.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const getAIHelp = async (type) => {
    if (!selected) return;
    setLoading(true);
    setSuggestion(null);

    const prompts = {
      brainstorm: `Brainstorm 3-4 unique narrative angles for Kaylani's college essay. 
                  Title/Goal: "${selected.title}"
                  Prompt: "${selected.prompt || "Common App personal statement"}"
                  Profile Context: GPA ${profile.gpa}, Interests: ${profile.major}, ECs: ${profile.ecs}.`,
      outline: `Create a professional 3-part outline (Hook, Body, Conclusion) for: "${selected.title}".
                Draft context: ${selected.draft || "Not started yet"}.`,
      feedback: `Review this essay draft and provide structural feedback. 
                 Score it 1-10 on 'Narrative Strength'. 
                 Draft: "${selected.draft}"`,
      polish: `Suggest 3 specific ways to strengthen the descriptions and transitions in this draft:
               "${selected.draft}"`
    };

    const res = await callAI([{ role: 'user', content: prompts[type] }], ctx, apiKey);
    setSuggestion({ type, content: res });
    setLoading(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", gap: "20px", height: "calc(100vh - 120px)" }}>
      {/* Sidebar */}
      <div style={{ width: "240px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Your Essays</h2>
        
        <div style={{ display: "flex", gap: "8px" }}>
          <Input 
            placeholder="Essay title..." 
            value={newTitle} 
            onChange={e => setNewTitle(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <Button onClick={addEssay} style={{ padding: "8px" }}><Plus size={18} /></Button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          {essays.length === 0 ? (
            <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", marginTop: "20px" }}>
              No essays yet. Add one to start drafting.
            </p>
          ) : (
            essays.map(e => (
              <button
                key={e.id}
                onClick={() => { setSelected(e); setSuggestion(null); }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  background: selected?.id === e.id ? "var(--secondary)" : "var(--bg-card)",
                  color: selected?.id === e.id ? "#fff" : "var(--text-main)",
                  border: "1px solid var(--border-color)",
                  cursor: "pointer",
                  transition: "var(--transition)"
                }}
              >
                <div style={{ fontWeight: "700", fontSize: "13px", marginBottom: "4px" }}>{e.title}</div>
                <div style={{ fontSize: "10px", opacity: 0.7 }}>
                  {(e.draft || "").split(/\s+/).filter(Boolean).length} words • {e.status}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
        {selected ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700" }}>{selected.title}</h2>
              <Button variant="ghost" onClick={() => deleteEssay(selected.id)} style={{ color: "var(--danger)" }}>
                <Trash2 size={16} />
              </Button>
            </div>

            <Card style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
              <TextArea 
                label="The Prompt"
                placeholder="Paste the college essay prompt here..."
                value={selected.prompt}
                onChange={e => updateEssay(selected.id, { prompt: e.target.value })}
                style={{ height: "80px" }}
              />
              
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: "var(--text-muted)" }}>
                  Your Draft ({(selected.draft || "").split(/\s+/).filter(Boolean).length} words)
                </label>
                <textarea 
                  value={selected.draft}
                  onChange={e => updateEssay(selected.id, { draft: e.target.value })}
                  placeholder="Start telling your story..."
                  style={{
                    flex: 1,
                    width: "100%",
                    padding: "16px",
                    borderRadius: "var(--radius-sm)",
                    border: "1.5px solid var(--border-color)",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    fontFamily: "inherit",
                    resize: "none",
                    outline: "none"
                  }}
                />
              </div>

              {/* AI Controls */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                <Button variant="secondary" onClick={() => getAIHelp('brainstorm')} disabled={loading}>
                  <Lightbulb size={16} /> Brainstorm
                </Button>
                <Button variant="secondary" onClick={() => getAIHelp('outline')} disabled={loading}>
                  <ListChecks size={16} /> Outline
                </Button>
                {selected.draft.length > 100 && (
                  <>
                    <Button variant="secondary" onClick={() => getAIHelp('feedback')} disabled={loading}>
                      <Star size={16} /> Feedback
                    </Button>
                    <Button variant="secondary" onClick={() => getAIHelp('polish')} disabled={loading}>
                      <Zap size={16} /> Polish
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* AI Suggestion Area */}
            {(loading || suggestion) && (
              <Card style={{ background: "var(--secondary)", color: "#fff", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Bot size={18} style={{ color: "var(--primary)" }} />
                    <span style={{ fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.1em" }}>
                      AI Coach Suggestion
                    </span>
                  </div>
                  {suggestion && <button onClick={() => setSuggestion(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><X size={16} /></button>}
                </div>
                {loading ? <Dots /> : (
                  <div style={{ fontSize: "14px", lineHeight: "1.6", opacity: 0.9 }}>
                    {suggestion.content.split('\n').map((line, i) => <p key={i} style={{ marginBottom: "8px" }}>{line}</p>)}
                  </div>
                )}
              </Card>
            )}
          </>
        ) : (
          <Card style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            <PenLine size={48} style={{ marginBottom: "16px", opacity: 0.2 }} />
            <p>Select an essay or create a new one to start working.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
