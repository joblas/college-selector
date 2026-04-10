import React, { useState } from 'react';
import { useAppContext } from './hooks/useAppContext';
import { 
  Home, User, Search, Award, Scale, PenLine, Target, Bot, 
  Settings, GraduationCap, X, ChevronRight, Plus
} from 'lucide-react';
import { Button } from './components/Button';
import { Modal } from './components/Modal';
import { Input } from './components/Input';

// Import features
import Dashboard from './features/Dashboard';
import SchoolDetails from './features/SchoolDetails';
import Scholarships from './features/Scholarships';
import DecisionHQ from './features/DecisionHQ';
import Profile from './features/Profile';
import ChatPanel from './features/ChatPanel';
import AddSchoolForm from './features/AddSchoolForm';
import EssayWorkshop from './features/EssayWorkshop';
import OnboardingTour from './components/OnboardingTour';

export default function App() {
  const { 
    setSchools, profile, 
    ready, globalProgress 
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('home');
  const [selSchool, setSelSchool] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const [modal, setModal] = useState(null);

  const NAV = [
    { id: "home", Icon: Home, l: "Dashboard" },
    { id: "schol", Icon: Award, l: "Scholarships" },
    { id: "essays", Icon: PenLine, l: "Essay Workshop" },
    { id: "decide", Icon: Target, l: "Decision HQ" },
    { id: "profile", Icon: User, l: "Profile" },
  ];

  if (!ready) {
    return (
      <div className="flex-center" style={{ height: "100vh" }}>
        <GraduationCap size={48} className="animate-pulse" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)", color: "var(--text-main)" }}>
      <OnboardingTour activeTab={activeTab} />

      {/* Premium Header */}
      <header className="glass" style={{ 
        position: "sticky", top: 0, zIndex: 100, height: "72px", 
        display: "flex", alignItems: "center", justifyContent: "space-between", 
        padding: "0 24px", borderBottom: "1px solid var(--border-color)" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => { setActiveTab('home'); setSelSchool(null); }}>
          <GraduationCap size={28} style={{ color: "var(--primary)" }} />
          <div>
            <h1 id="tour-welcome" style={{ fontSize: "16px", fontWeight: "800", letterSpacing: "-0.01em" }}>College Selector</h1>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Advisory Suite</p>
          </div>
        </div>

        {/* Global Progress Tracking */}
        <div id="tour-progress" style={{ flex: 1, maxWidth: "300px", margin: "0 40px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
            <span>Roadmap Progress</span>
            <span style={{ color: "var(--primary)" }}>{globalProgress}%</span>
          </div>
          <div style={{ width: "100%", height: "6px", background: "var(--border-color)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ width: `${globalProgress}%`, height: "100%", background: "var(--primary)", transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
          </div>
        </div>

        <nav style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {NAV.map(n => (
            <Button 
              key={n.id} 
              variant={activeTab === n.id ? "secondary" : "ghost"}
              onClick={() => { setActiveTab(n.id); setSelSchool(null); }}
              id={n.id === 'profile' ? 'tour-profile' : undefined}
              style={{ padding: "8px 12px", gap: "6px" }}
            >
              <n.Icon size={16} />
              <span style={{ fontSize: "13px", fontWeight: "600" }}>{n.l}</span>
            </Button>
          ))}
          <div style={{ width: "1px", height: "24px", background: "var(--border-color)", margin: "0 12px" }} />
          <Button variant="ghost" onClick={() => setModal("settings")} style={{ width: "36px", height: "36px", padding: 0, borderRadius: "50%" }}>
            <Settings size={18} />
          </Button>
          <Button id="tour-advisor" variant={showAI ? "primary" : "ghost"} onClick={() => setShowAI(!showAI)} style={{ width: "36px", height: "36px", padding: 0, borderRadius: "50%" }}>
            <Bot size={18} />
          </Button>
        </nav>
      </header>

      {/* Main Content Area */}
      <div style={{ display: "flex", width: "100%", maxWidth: "1250px", margin: "0 auto" }}>
        <main style={{ 
          flex: 1, padding: "32px 24px", 
          transition: "var(--transition)",
          marginRight: showAI ? "370px" : "0" 
        }}>
          {activeTab === 'home' && !selSchool && (
            <div className="animate-fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "32px" }}>
                <div>
                  <h2 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em" }}>Welcome, {profile.name || "Kaylani"}</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "4px" }}>Here is your admissions roadmap today.</p>
                </div>
                <Button id="tour-add-school" onClick={() => setModal("addSchool")} className="shadow-lg">
                  <Plus size={18} /> Add School
                </Button>
              </div>
              <Dashboard onSelectSchool={setSelSchool} />
            </div>
          )}

          {selSchool && (
            <SchoolDetails 
              school={selSchool} 
              onClose={() => setSelSchool(null)} 
              onUpdate={(updated) => {
                setSchools(p => p.map(s => s.id === updated.id ? updated : s));
                setSelSchool(updated);
              }}
              onDelete={() => {
                if (confirm(`Remove ${selSchool.name}?`)) {
                  setSchools(p => p.filter(s => s.id !== selSchool.id));
                  setSelSchool(null);
                }
              }}
            />
          )}

          {activeTab === 'schol' && <Scholarships />}
          {activeTab === 'essays' && <EssayWorkshop />}
          {activeTab === 'decide' && <DecisionHQ onSelectSchool={(s) => { setSelSchool(s); setActiveTab('home'); }} />}
          {activeTab === 'profile' && <Profile />}
        </main>

        {/* Floating AI Chat Panel */}
        {showAI && <ChatPanel onClose={() => setShowAI(false)} />}
      </div>

      {/* Modals */}
      {modal === "settings" && (
        <Modal title="Settings" onClose={() => setModal(null)} footer={
          <Button onClick={() => setModal(null)}>Close</Button>
        }>
          <div style={{ padding: "12px", background: "var(--bg-main)", borderRadius: "8px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>AI Advisor</h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              The AI advisor is powered by a secure backend proxy. No API key required from you — just start chatting!
            </p>
          </div>
        </Modal>
      )}

      {modal === "addSchool" && <AddSchoolForm onClose={() => setModal(null)} />}
    </div>
  );
}
