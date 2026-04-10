import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppProvider } from './context/AppContext'
import { LoginScreen } from './components/LoginScreen'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('React Error:', error, info); }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 40, textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <pre style={{ fontSize: 12, textAlign: 'left', maxWidth: '100%', overflow: 'auto' }}>
          {this.state.error?.message || 'Unknown error'}
        </pre>
      </div>;
    }
    return this.props.children;
  }
}

function Main() {
  const storedUser = localStorage.getItem('college_current_user');
  let initialUser = null;
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const users = JSON.parse(localStorage.getItem('college_users') || '[]');
      if (users.find(u => u.id === user.id)) {
        initialUser = user;
      }
    } catch { /* ignore */ }
  }
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('college_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('college_current_user');
  };

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <GraduationCap size={48} className="animate-pulse" style={{ color: 'var(--primary)' }} />
    </div>;
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

import { GraduationCap } from 'lucide-react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Main />
    </ErrorBoundary>
  </React.StrictMode>,
)