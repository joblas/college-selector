import React, { useState } from 'react';
import { GraduationCap, Users, Plus, ArrowRight, LogIn } from 'lucide-react';
import { Button } from './Button';

const API_URL = 'http://localhost:8766';

export function LoginScreen({ onLogin }) {
  const storedUsers = JSON.parse(localStorage.getItem('college_users') || '[]');
  const [users, setUsers] = useState(storedUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pin, setPin] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (userId) => {
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    const user = users.find(u => u.id === userId);
    if (user && user.pin === pin) {
      onLogin(user);
    } else {
      setError('Incorrect PIN');
    }
  };

  const handleCreate = async () => {
    if (!newName.trim() || newPin.length < 4) {
      setError('Name required and PIN must be 4+ digits');
      return;
    }

    let dbUser = null;
    try {
      const res = await fetch(`${API_URL}/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), pin: newPin })
      });
      if (res.ok) {
        dbUser = await res.json();
        dbUser = dbUser.user;
      }
    } catch {
      console.log('DB not available, using local only');
    }

    const newUser = {
      id: dbUser?.id?.toString() || Date.now().toString(),
      name: newName.trim(),
      pin: newPin,
      created: new Date().toISOString()
    };
    
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('college_users', JSON.stringify(updated));
    onLogin(newUser);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'var(--bg-main)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '24px',
          background: 'var(--primary)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
        }}>
          <GraduationCap size={40} color="white" />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          College Selector
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
          Track your college journey
        </p>
      </div>

      {!showCreate ? (
        <div style={{ width: '100%', maxWidth: '340px' }}>
          {users.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '8px' }}>
                Who's using the app?
              </p>
              {users.map(user => (
                <div key={user.id} style={{
                  background: 'var(--bg-card)', borderRadius: '16px', padding: '16px',
                  border: selectedUser === user.id ? '2px solid var(--primary)' : '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Users size={20} style={{ color: 'var(--primary)' }} />
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '16px' }}>{user.name}</span>
                    </div>
                  </div>
                  {selectedUser === user.id && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="password"
                        placeholder="Enter PIN"
                        value={pin}
                        onChange={e => { setPin(e.target.value); setError(''); }}
                        style={{
                          flex: 1, padding: '12px', borderRadius: '10px',
                          border: '1px solid var(--border-color)', fontSize: '16px', letterSpacing: '4px'
                        }}
                      />
                      <Button onClick={() => handleLogin(user.id)}>
                        <ArrowRight size={20} />
                      </Button>
                    </div>
                  )}
                  {selectedUser !== user.id && (
                    <Button variant="secondary" onClick={() => { setSelectedUser(user.id); setPin(''); setError(''); }} style={{ width: '100%' }}>
                      Sign In
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Welcome! Create an account to get started.
              </p>
            </div>
          )}
          
          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>
              {error}
            </p>
          )}

          {users.length > 0 && (
            <Button 
              variant="ghost"
              onClick={() => { setShowCreate(true); setError(''); }} 
              style={{ width: '100%', marginTop: '16px' }}
            >
              <Plus size={18} /> Create New Account
            </Button>
          )}
          
          <Button 
            onClick={() => { setShowCreate(true); setError(''); }} 
            style={{ width: '100%', marginTop: users.length > 0 ? '8px' : '16px' }}
          >
            <Plus size={20} /> {users.length === 0 ? 'Create Account' : 'Add Another User'}
          </Button>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '340px' }}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: '16px', padding: '24px',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', textAlign: 'center' }}>
              {users.length === 0 ? 'Create Your Account' : 'Add New User'}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                placeholder="Your name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                style={{
                  padding: '14px', borderRadius: '12px',
                  border: '1px solid var(--border-color)', fontSize: '16px'
                }}
              />
              <input
                type="password"
                placeholder="Create a PIN (4+ digits)"
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
                style={{
                  padding: '14px', borderRadius: '12px',
                  border: '1px solid var(--border-color)', fontSize: '16px', letterSpacing: '4px'
                }}
              />
            </div>

            {error && (
              <p style={{ color: 'var(--danger)', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>
                {error}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <Button variant="secondary" onClick={() => { setShowCreate(false); setError(''); }} style={{ flex: 1 }}>
                Back
              </Button>
              <Button onClick={handleCreate} style={{ flex: 1 }}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}