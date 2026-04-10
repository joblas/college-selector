import React, { useState } from 'react';
import { Search, X, BookOpen, Award, Target } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export function KnowledgeSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    
    try {
      const res = await fetch('http://localhost:8765/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: query, 
          wing: 'college_selector',
          limit: 5 
        })
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    { label: 'How to write essays', icon: BookOpen },
    { label: 'Scholarship tips', icon: Award },
    { label: 'Compare schools', icon: Target },
  ];

  return (
    <Modal onClose={onClose} title="Knowledge Search" mobileFullScreen>
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '2px solid var(--border-color)',
              fontSize: '15px',
              outline: 'none',
            }}
            placeholder="Search college tips..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search size={20} />
          </Button>
        </div>

        {!searched && (
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Try asking:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {sampleQueries.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(sq.label); }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <sq.icon size={14} />
                  {sq.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
            Searching knowledge base...
          </div>
        )}

        {searched && !loading && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
            No results found. Try a different question!
          </div>
        )}

        {results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: '14px',
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {r.room} • {r.source_file}
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  {r.text?.substring(0, 200)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}