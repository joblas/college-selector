import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Card } from '../components/Card';
import { Input, TextArea, Select } from '../components/Input';
import { Button } from '../components/Button';
import { User, MapPin, BookOpen, Star, PenLine, Settings } from 'lucide-react';

export default function Profile() {
  const { profile, setProfile } = useAppContext();

  function update(k, v) {
    setProfile(p => ({ ...p, [k]: v }));
  }

  const STATES = ["", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px" }}>My Academic Profile</h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>This information helps the AI provide more accurate matching and advice.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <User size={18} style={{ color: "var(--primary)" }} />
            <strong style={{ fontSize: "15px" }}>Basics</strong>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Input label="Name" value={profile.name} onChange={e => update("name", e.target.value)} />
            <Select label="Home State" value={profile.state} onChange={e => update("state", e.target.value)}>
              {STATES.map(s => <option key={s} value={s}>{s || "Select State..."}</option>)}
            </Select>
          </div>
          <Input label="Intended Major" value={profile.major} onChange={e => update("major", e.target.value)} />
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Star size={18} style={{ color: "var(--warning)" }} />
            <strong style={{ fontSize: "15px" }}>Stats</strong>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <Input label="GPA (weighted)" type="number" step="0.01" value={profile.gpa} onChange={e => update("gpa", e.target.value)} />
            <Input label="SAT Score" type="number" value={profile.sat} onChange={e => update("sat", e.target.value)} />
            <Input label="ACT Score" type="number" value={profile.act} onChange={e => update("act", e.target.value)} />
          </div>
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <PenLine size={18} style={{ color: "var(--info)" }} />
            <strong style={{ fontSize: "15px" }}>Activities & Awards</strong>
          </div>
          <TextArea label="Extracurriculars" placeholder="List your key clubs, sports, or hobbies..." value={profile.ecs} onChange={e => update("ecs", e.target.value)} />
          <TextArea label="Awards & Honors" placeholder="List any notable achievements..." value={profile.awards} onChange={e => update("awards", e.target.value)} />
        </Card>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
           <Button onClick={() => alert("Profile auto-saved to local storage!")}>Save Profile</Button>
        </div>
      </div>
    </div>
  );
}
