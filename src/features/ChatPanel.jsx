import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { callAI } from '../services/ai';
import { Button } from '../components/Button';
import { Dots } from '../components/Specialized';
import { Bot, Send, X } from 'lucide-react';

export default function ChatPanel({ onClose }) {
  const { apiKey, ctx } = useAppContext();
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: "Hey! I'm your AI advisor. Ask me anything about your current schools, finances, or essays." }
  ]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  async function send() {
    if (!inp.trim() || loading) return;
    const text = inp.trim();
    const newMsgs = [...msgs, { role: "user", content: text }];
    setMsgs(newMsgs);
    setInp("");
    setLoading(true);

    // AI check logic handled in services/ai.js
    
    try {
      const response = await callAI(
        newMsgs.map(m => ({ role: m.role, content: m.content })).slice(-10),
        ctx,
        apiKey
      );
      setMsgs(p => [...p, { role: "assistant", content: response }]);
    } catch {
       setMsgs(p => [...p, { role: "assistant", content: "Sorry, I had trouble connecting. Check your API key or CORS settings." }]);
    } finally {
      setLoading(false);
    }
  }

  const SUGGESTIONS = [
    { l: "Best fit?", p: "Which school is my best academic fit?" },
    { l: "My chances?", p: "What are my admission chances at my top choices?" },
    { l: "Budget help", p: "Which school is the best deal financially?" }
  ];

  return (
    <div className="glass" style={{ 
      width: "350px", height: "calc(100vh - 100px)", position: "fixed", right: "20px", bottom: "20px",
      display: "flex", flexDirection: "column", borderRadius: "var(--radius-lg)", overflow: "hidden",
      boxShadow: "var(--shadow-lg)", zIndex: 1000, border: "1px solid var(--border-color)"
    }}>
      <div style={{ padding: "12px 16px", background: "var(--secondary)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Bot size={20} style={{ color: "var(--primary)" }} />
          <strong style={{ fontSize: "14px" }}>AI Coach</strong>
        </div>
        <Button variant="icon" onClick={onClose} style={{ color: "rgba(255,255,255,0.6)" }}><X size={18} /></Button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ 
            display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: "8px",
            alignItems: "flex-start"
          }}>
            {m.role === "assistant" && <Bot size={16} style={{ marginTop: "8px", color: "var(--primary)", flexShrink: 0 }} />}
            <div style={{ 
              maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
              background: m.role === "user" ? "var(--primary)" : "var(--bg-main)",
              color: m.role === "user" ? "#fff" : "var(--text-main)",
              fontSize: "13px", lineHeight: "1.6", boxShadow: "var(--shadow-sm)"
            }}>
              {m.content.split('\n').map((line, j) => <p key={j} style={{ margin: "2px 0" }}>{line}</p>)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Bot size={16} style={{ color: "var(--primary)" }} />
            <div style={{ padding: "8px 14px", background: "var(--bg-main)", borderRadius: "20px" }}><Dots /></div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "12px", borderTop: "1px solid var(--border-color)", background: "#fff" }}>
        <div style={{ display: "flex", gap: "4px", marginBottom: "8px", overflowX: "auto" }}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => { setInp(s.p); }} style={{ 
              whiteSpace: "nowrap", padding: "4px 10px", borderRadius: "10px", fontSize: "11px", 
              background: "var(--bg-main)", border: "1px solid var(--border-color)", cursor: "pointer"
            }}>
              {s.l}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input 
            style={{ 
              flex: 1, padding: "10px 14px", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)", 
              fontSize: "13px", outline: "none"
            }}
            placeholder="Ask me anything..."
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <Button onClick={send} disabled={loading} style={{ width: "40px", height: "40px", padding: 0 }}>
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
