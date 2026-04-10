import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppProvider } from './context/AppContext'
import { LoginScreen } from './components/LoginScreen'

function Main() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('college_current_user');
      if (stored) {
        const user = JSON.parse(stored);
        const users = JSON.parse(localStorage.getItem('college_users') || '[]');
        if (users.find(u => u.id === user.id)) {
          return user;
        }
      }
    } catch (e) {
      console.log('No stored user');
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('college_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('college_current_user');
  };

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f7f6f3'
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#863bff" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
        </svg>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <AppProvider currentUser={currentUser}>
      <App currentUser={currentUser} onLogout={handleLogout} />
    </AppProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)