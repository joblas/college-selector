import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppProvider } from './context/AppContext'
import { LoginScreen } from './components/LoginScreen'

const API_URL = 'http://localhost:8766'

function Main() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const stored = localStorage.getItem('college_current_user')
        if (stored) {
          const user = JSON.parse(stored)
          const users = JSON.parse(localStorage.getItem('college_users') || '[]')
          if (users.find(u => u.id === user.id)) {
            setCurrentUser(user)
            await syncFromDB(user.id)
          }
        }
      } catch (e) {
        console.log('No stored user')
      }
      setLoading(false)
    }
    init()
  }, [])

  const syncFromDB = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/sync?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.schools?.length) localStorage.setItem(`college_${userId}_schools`, JSON.stringify(data.schools))
        if (data.scholarships?.length) localStorage.setItem(`college_${userId}_schols`, JSON.stringify(data.scholarships))
        if (data.profile) localStorage.setItem(`college_${userId}_profile`, JSON.stringify(data.profile))
        if (data.weights) localStorage.setItem(`college_${userId}_weights`, JSON.stringify(data.weights))
        console.log('Synced from DB')
      }
    } catch (e) {
      console.log('DB sync failed, using localStorage')
    }
  }

  const handleLogin = async (user) => {
    localStorage.setItem('college_current_user', JSON.stringify(user))
    localStorage.setItem('college_users', JSON.stringify([...new Set([...JSON.parse(localStorage.getItem('college_users') || '[]'), user])]))
    setCurrentUser(user)
    await syncFromDB(user.id)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('college_current_user')
  }

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-main)'
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
        </svg>
      </div>
    )
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <AppProvider currentUser={currentUser}>
      <App currentUser={currentUser} onLogout={handleLogout} />
    </AppProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)