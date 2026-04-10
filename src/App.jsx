import React, { useState, useEffect } from 'react';
import { useAppContext } from './hooks/useAppContext';
import { 
  Home, User, PenLine, Target, Bot, 
  Plus, GraduationCap, Search, Sparkles, LogOut, Users, Moon, Sun
} from 'lucide-react';
import { Button } from './components/Button';
import { Modal } from './components/Modal';
import { KnowledgeSearch } from './components/KnowledgeSearch';
import { Recommendations } from './components/Recommendations';

// Import features
import Dashboard from './features/Dashboard';
import SchoolDetails from './features/SchoolDetails';
import Scholarships from './features/Scholarships';
import DecisionHQ from './features/DecisionHQ';
import Profile from './features/Profile';
import ChatPanel from './features/ChatPanel';
import AddSchoolForm from './features/AddSchoolForm';
import EssayWorkshop from './features/EssayWorkshop';

const NAV_ITEMS = [
  { id: "home", Icon: Home, l: "Home" },
  { id: "schol", Icon: Target, l: "Decisions" },
  { id: "essays", Icon: PenLine, l: "Essays" },
  { id: "profile", Icon: User, l: "Profile" },
];

export default function App({ currentUser, onLogout }) {
  const { profile, ready, globalProgress } = useAppContext();

  const [activeTab, setActiveTab] = useState('home');
  const [selSchool, setSelSchool] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showRecs, setShowRecs] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('college_dark_mode') === 'true';
  });
  const [modal, setModal] = useState(null);
  const [_headerExpanded] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('college_dark_mode', darkMode);
  }, [darkMode]);

  if (!ready) {
    return (
      <div className="flex-center" style={{ height: "100vh", background: "var(--bg-main)" }}>
        <GraduationCap size={48} className="animate-pulse" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)", color: "var(--text-main)" }}>
      {/* OnboardingTour temporarily disabled */}

      {/* Mobile Header - Collapsible */}
      <header className="glass mobile-header" style={{ 
        position: "sticky", top: 0, zIndex: 100,
        height: _headerExpanded ? "auto" : "56px",
        borderBottom: "1px solid var(--border-color)",
        overflow: "hidden"
      }}>
        <div style={{ 
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", gap: "12px", flexWrap: "nowrap"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} 
            onClick={() => { setActiveTab('home'); setSelSchool(null); }}>
            <div 
              id="tour-welcome"
              style={{ 
              width: "36px", height: "36px", borderRadius: "10px", 
              background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" 
            }}>
              <GraduationCap size={20} style={{ color: "white" }} />
            </div>
            <div className="mobile-only">
              <span style={{ fontSize: "15px", fontWeight: "700" }}>College Selector</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 1, minWidth: 0 }}>
            {/* Mobile: AI Chat toggle */}
            <Button 
              id="tour-advisor" 
              variant={showAI ? "primary" : "secondary"} 
              onClick={() => setShowAI(!showAI)}
              style={{ 
                height: "36px", padding: "0 12px", borderRadius: "20px",
                gap: "4px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap"
              }}
            >
              <Bot size={16} />
              <span className="mobile-only">Chat</span>
            </Button>
          </div>
        </div>

        {/* Expandable Header Content - Desktop only */}
        <div className="desktop-only" style={{ padding: "0 24px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ minWidth: "200px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em" }}>Welcome, {profile.name || "Kaylani"}</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>Here is your admissions roadmap today.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 16px", background: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)", flexShrink: 0 }}>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Progress</span>
                  <p style={{ fontSize: "20px", fontWeight: "800", color: "var(--primary)" }}>{globalProgress}%</p>
                </div>
                <div style={{ width: "8px", height: "40px", background: "var(--border-color)", borderRadius: "4px" }}>
                  <div style={{ width: "100%", height: `${globalProgress}%`, background: "var(--primary)", borderRadius: "4px", marginTop: "auto" }} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <Button id="tour-add-school" onClick={() => setModal("addSchool")}>
                  <Plus size={18} /> Add School
                </Button>
                <Button variant="secondary" onClick={() => setShowSearch(true)}>
                  <Search size={18} /> Search
                </Button>
                <Button variant="secondary" onClick={() => setShowRecs(true)}>
                  <Sparkles size={18} /> For You
                </Button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
                <Button variant="secondary" onClick={() => setModal("userMenu")}>
                  <Users size={18} /> {currentUser?.name || 'User'}
                </Button>
                <Button variant="secondary" onClick={() => setDarkMode(!darkMode)} title={darkMode ? "Light mode" : "Dark mode"}>
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav style={{ display: "flex", gap: "4px", paddingTop: "8px", borderTop: "1px solid var(--border-color)" }}>
            {[
              { id: "home", l: "Dashboard" },
              { id: "schol", l: "Scholarships" },
              { id: "essays", l: "Essay Workshop" },
              { id: "decide", l: "Decision HQ" },
              { id: "profile", l: "Profile" },
            ].map(n => (
              <Button 
                key={n.id} 
                variant={activeTab === n.id ? "secondary" : "ghost"}
                onClick={() => { setActiveTab(n.id); setSelSchool(null); }}
                style={{ padding: "10px 18px", gap: "6px" }}
              >
                <span style={{ fontSize: "13px", fontWeight: "600" }}>{n.l}</span>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Welcome Bar */}
      <div className="mobile-only" style={{ padding: "16px 16px 8px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Welcome, {profile.name || "Kaylani"}!</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "2px" }}>{globalProgress}% complete</p>
      </div>

      {/* Main Content */}
      <main 
        className="main-content"
        style={{ 
          padding: "24px", 
          maxWidth: "1200px", 
          margin: "0 auto",
          minHeight: "calc(100vh - var(--mobile-header-height) - var(--mobile-nav-height) - 48px)"
      }}>
        {/* Mobile: Add School FAB */}
        <button 
          className="mobile-only"
          onClick={() => setModal("addSchool")}
          aria-label="Add School"
          style={{
            position: "fixed", bottom: "90px", right: "20px",
            width: "60px", height: "60px", borderRadius: "50%",
            background: "var(--primary)", border: "none",
            boxShadow: "0 6px 24px rgba(134, 59, 255, 0.45)",
            zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#fff", transition: "transform 0.2s, box-shadow 0.2s"
          }}
        >
          <Plus size={26} />
        </button>

        {activeTab === 'home' && !selSchool && (
          <Dashboard onSelectSchool={setSelSchool} onOpenAI={() => setShowAI(true)} onAddSchool={() => setModal("addSchool")} />
        )}

        {selSchool && (
          <SchoolDetails 
            school={selSchool} 
            onClose={() => setSelSchool(null)} 
            onUpdate={(updated) => {
              const { setSchools } = window.__appContext || {};
              if (setSchools) setSchools(p => p.map(s => s.id === updated.id ? updated : s));
              setSelSchool(updated);
            }}
            onDelete={() => {
              const { setSchools } = window.__appContext || {};
              if (setSchools) setSchools(p => p.filter(s => s.id !== selSchool.id));
              setSelSchool(null);
            }}
            onOpenAI={() => setShowAI(true)}
          />
        )}

        {activeTab === 'schol' && <Scholarships />}
        {activeTab === 'essays' && <EssayWorkshop />}
        {activeTab === 'decide' && <DecisionHQ onSelectSchool={(s) => { setSelSchool(s); setActiveTab('home'); }} onOpenAI={() => setShowAI(true)} />}
        {activeTab === 'profile' && <Profile />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        height: "var(--mobile-nav-height)",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border-color)",
        display: "flex", justifyContent: "space-around", alignItems: "center",
        zIndex: 1000, padding: "0 8px", paddingBottom: "env(safe-area-inset-bottom, 8px)"
      }}>
        {NAV_ITEMS.map(n => (
          <button
            key={n.id}
            onClick={() => { setActiveTab(n.id); setSelSchool(null); }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "4px", padding: "8px 16px", border: "none", cursor: "pointer", borderRadius: "12px",
              background: activeTab === n.id ? "var(--primary-light)" : "transparent",
              color: activeTab === n.id ? "var(--primary)" : "var(--text-muted)",
              transition: "all 0.2s"
            }}
          >
            <n.Icon size={22} strokeWidth={2.5} />
            <span style={{ fontSize: "12px", fontWeight: "600" }}>{n.l}</span>
          </button>
        ))}
      </nav>

      {/* AI Chat Panel - Full screen modal on mobile */}
      {showAI && (
        <div className="mobile-only" style={{
          position: "fixed", inset: 0, zIndex: 2000,
          background: "var(--bg-main)"
        }}>
          <ChatPanel onClose={() => setShowAI(false)} />
        </div>
      )}

      {/* AI Chat - Side panel on desktop */}
      <div className="desktop-only">
        {showAI && <ChatPanel onClose={() => setShowAI(false)} />}
      </div>

      {/* Modals - Full screen on mobile */}
      {modal === "settings" && (
        <Modal 
          title="Settings" 
          onClose={() => setModal(null)}
          mobileFullScreen
          footer={<Button onClick={() => setModal(null)}>Close</Button>}
        >
          <div style={{ padding: "16px", background: "var(--bg-main)", borderRadius: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "8px" }}>AI Advisor</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              The AI advisor is powered by a secure backend. No API key required!
            </p>
          </div>
        </Modal>
      )}

      {modal === "addSchool" && (
        <Modal 
          title="Add School" 
          onClose={() => setModal(null)}
          mobileFullScreen
        >
          <AddSchoolForm onClose={() => setModal(null)} />
        </Modal>
      )}

      {showSearch && (
        <KnowledgeSearch 
          onClose={() => setShowSearch(false)} 
          onSelectSchool={(s) => { setSelSchool(s); setShowSearch(false); }}
        />
      )}

      {showRecs && (
        <Recommendations onClose={() => setShowRecs(false)} />
      )}

      {modal === "userMenu" && (
        <Modal title="Account" onClose={() => setModal(null)}>
          <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <p style={{ fontWeight: '700', fontSize: '18px' }}>{currentUser?.name}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Signed in</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => { setModal(null); onLogout(); }} style={{ width: '100%' }}>
              <LogOut size={18} /> Sign Out
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}