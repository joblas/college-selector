import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { callAI } from '../services/ai';
import { Button } from '../components/Button';
import { Dots } from '../components/Specialized';
import { Bot, Send, X, ArrowLeft } from 'lucide-react';

export default function ChatPanel({ onClose }) {
  const { ctx } = useAppContext();
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: "Hey! I'm your AI advisor. Ask me anything about your colleges, finances, or essays." }
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

    try {
      const response = await callAI(
        newMsgs.map(m => ({ role: m.role, content: m.content })).slice(-10),
        ctx
      );
      setMsgs(p => [...p, { role: "assistant", content: response }]);
    } catch {
       setMsgs(p => [...p, { role: "assistant", content: "Sorry, I had trouble connecting. Please try again." }]);
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
    <div style={{ 
      height: "100%", display: "flex", flexDirection: "column",
      background: "#fff"
    }}>
      {/* Header */}
      <div style={{ 
        padding: "12px 16px", background: "var(--secondary)", color: "#fff", 
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexShrink: 0, paddingBottom: "calc(12px + env(safe-area-inset-top, 0px))",
        paddingTop: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Bot size={22} style={{ color: "var(--primary)" }} />
          <div>
            <strong style={{ fontSize: "15px", fontWeight: "700" }}>AI Coach</strong>
            <p style={{ fontSize: "11px", opacity: 0.7 }}>Your college advisor</p>
          </div>
        </div>
        <Button variant="icon" onClick={onClose} style={{ 
          color: "rgba(255,255,255,0.8)", width: "36px", height: "36px" 
        }}>
          <X size={22} />
        </Button>
      </div>

      {/* Messages */}
      <div style={{ 
        flex: 1, overflowY: "auto", padding: "16px", display: "flex", 
        flexDirection: "column", gap: "12px", background: "var(--bg-main)"
      }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ 
            display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", 
            gap: "8px", alignItems: "flex-start"
          }}>
            {m.role === "assistant" && (
              <div style={{ 
                width: "28px", height: "28px", borderRadius: "50%", 
                background: "var(--primary)", display: "flex", alignItems: "center", 
                justifyContent: "center", flexShrink: 0, marginTop: "4px"
              }}>
                <Bot size={14} style={{ color: "#fff" }} />
              </div>
            )}
            <div style={{ 
              maxWidth: "75%", padding: "12px 16px", 
              borderRadius: m.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
              background: m.role === "user" ? "var(--primary)" : "#fff",
              color: m.role === "user" ? "#fff" : "var(--text-main)",
              fontSize: "14px", lineHeight: "1.5", boxShadow: "var(--shadow-sm)",
              border: m.role === "assistant" ? "1px solid var(--border-color)" : "none"
            }}>
              {m.content.split('\n').map((line, j) => (
                <p key={j} style={{ margin: "2px 0" }}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ 
              width: "28px", height: "28px", borderRadius: "50%", 
              background: "var(--primary)", display: "flex", alignItems: "center", 
              justifyContent: "center"
            }}>
              <Bot size={14} style={{ color: "#fff" }} />
            </div>
            <div style={{ padding: "10px 16px", background: "#fff", borderRadius: "20px", boxShadow: "var(--shadow-sm)" }}>
              <Dots />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ 
        padding: "12px 16px", borderTop: "1px solid var(--border-color)", 
        background: "#fff", paddingBottom: "calc(12px + env(safe-area-inset-bottom, 8px))"
      }}>
        <div style={{ display: "flex", gap: "6px", marginBottom: "10px", overflowX: "auto" }}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => { setInp(s.p); }} style={{ 
              whiteSpace: "nowrap", padding: "6px 12px", borderRadius: "16px", fontSize: "12px", 
              background: "var(--primary-light)", border: "none", cursor: "pointer",
              color: "var(--primary)", fontWeight: "600"
            }}>
              {s.l}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input 
            style={{ 
              flex: 1, padding: "14px 16px", border: "2px solid var(--border-color)", 
              borderRadius: "24px", fontSize: "15px", outline: "none",
              minHeight: "48px"
            }}
            placeholder="Ask me anything..."
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <Button 
            onClick={send} 
            disabled={loading || !inp.trim()} 
            style={{ 
              width: "48px", height: "48px", padding: 0, borderRadius: "50%",
              flexShrink: 0
            }}
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}