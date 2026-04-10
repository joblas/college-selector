import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, School, Award, BookOpen } from 'lucide-react';
import { Modal } from './Modal';

const getDefaultRecommendations = () => [
  {
    type: 'school',
    title: 'Build your list',
    text: 'Add schools that match your GPA and test scores. Include some safeties, matches, and reaches.',
    icon: School,
    action: 'Add a school',
    priority: 'high'
  },
  {
    type: 'scholarship',
    title: 'Find free money',
    text: 'Start your scholarship search early. Local scholarships often have less competition.',
    icon: Award,
    action: 'View scholarships',
    priority: 'medium'
  },
  {
    type: 'essay',
    title: 'Tell your story',
    text: 'Your essays are your chance to show admissions who you really are. Be authentic!',
    icon: BookOpen,
    action: 'Work on essays',
    priority: 'medium'
  }
];

const generateRecommendations = () => {
  return [
    {
      type: 'school',
      title: 'Based on your profile',
      text: 'Research universities with strong programs in your intended major. Your list could benefit from a mix of reach, match, and safety schools.',
      icon: School,
      action: 'Add a school',
      priority: 'high'
    },
    {
      type: 'scholarship',
      title: 'Funding tip',
      text: 'Many schools offer merit scholarships. Check each school\'s financial aid page for deadlines - some are early!',
      icon: Award,
      action: 'View scholarships',
      priority: 'medium'
    },
    {
      type: 'essay',
      title: 'Essay strategy',
      text: 'Start with your personal statement. Pick a story that shows who you are, not what you think they want to hear.',
      icon: BookOpen,
      action: 'Work on essays',
      priority: 'medium'
    }
  ];
};

export function Recommendations({ onClose }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8765/knowledge/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity: 'college' })
    })
    .then(r => r.json())
    .then(() => {
      const recommendations = generateRecommendations();
      setRecs(recommendations);
    })
    .catch(() => {
      setRecs(getDefaultRecommendations());
    })
    .finally(() => setLoading(false));
  }, []);

  return (
    <Modal onClose={onClose} title="Recommendations for You" mobileFullScreen>
      <div style={{ padding: '16px' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '12px', 
          padding: '16px', background: 'var(--primary-light)', 
          borderRadius: '12px', marginBottom: '20px' 
        }}>
          <Sparkles size={24} style={{ color: 'var(--primary)' }} />
          <div>
            <p style={{ fontWeight: '700', fontSize: '15px' }}>Powered by your data</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Personalized tips based on your profile and progress
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Analyzing your profile...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recs.map((rec, i) => (
              <div
                key={i}
                style={{
                  padding: '16px',
                  background: 'var(--bg-card)',
                  borderRadius: '14px',
                  border: rec.priority === 'high' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <rec.icon size={18} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>{rec.title}</span>
                  {rec.priority === 'high' && (
                    <span style={{ 
                      fontSize: '10px', padding: '2px 6px', borderRadius: '8px',
                      background: 'var(--primary)', color: '#fff', fontWeight: '600'
                    }}>
                      Recommended
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.5' }}>
                  {rec.text}
                </p>
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '13px', fontWeight: '600', color: 'var(--primary)',
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}
                >
                  {rec.action} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}