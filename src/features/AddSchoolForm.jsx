import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Input, Select } from '../components/Input';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { celebrateQuick } from '../utils/celebrate';

export default function AddSchoolForm({ onClose }) {
  const { setSchools, COLORS, schools } = useAppContext();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", major: "", deadline: "", status: "Considering" });

  function submit() {
    if (!form.name.trim()) return;
    const newSchool = {
      ...form,
      id: Date.now(),
      color: COLORS[schools.length % COLORS.length],
      scores: {}, finances: {}, admissions: {}, documents: [], 
      pros: [], cons: [], checklist: [], notes: ""
    };
    setSchools(p => [...p, newSchool]);
    celebrateQuick();
    onClose();
  }

  return (
    <Modal title={`Step ${step} of 3`} onClose={onClose} footer={
      <div style={{ display: "flex", gap: "12px", width: "100%" }}>
        {step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)} style={{ flex: 1 }}>Back</Button>}
        <Button onClick={() => step < 3 ? setStep(step + 1) : submit()} style={{ flex: 2 }} disabled={step === 1 && !form.name}>
          {step === 3 ? "Finish Roadmap" : "Next Step"}
        </Button>
      </div>
    }>
      <div className="animate-fade-in" key={step} style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "10px 0" }}>
        {step === 1 && (
          <div className="animate-slide-in">
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>Where are you looking first? 🏢</h3>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>Add the name of the college you want to research.</p>
            <Input 
              placeholder="e.g. Stanford University" 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-in">
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>What's your current status? 🎯</h3>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>Choose how far along you are with this school.</p>
            <Select 
              value={form.status} 
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              {["Considering", "Applied", "Accepted", "Waitlisted", "Committed"].map(x => (
                <option key={x} value={x}>{x}</option>
              ))}
            </Select>
          </div>
        )}

        {step === 3 && (
          <div className="animate-slide-in">
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>Almost there! Any details? 📅</h3>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>Add your major and application deadline if you know it.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Input 
                label="Preferred Major" 
                placeholder="e.g. Computer Science" 
                value={form.major} 
                onChange={e => setForm({ ...form, major: e.target.value })} 
              />
              <Input 
                label="Application Deadline" 
                type="date" 
                value={form.deadline} 
                onChange={e => setForm({ ...form, deadline: e.target.value })} 
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
