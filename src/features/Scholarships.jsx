import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Input, Select } from '../components/Input';
import { AIBtn } from '../components/Specialized';
import { Award, Plus, Edit3, Trash2, CheckCircle, Search } from 'lucide-react';
import { celebrate } from '../utils/celebrate';

export default function Scholarships() {
  const { schols, setSchols, formatUSD, apiKey, ctx, schools } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ 
    name: "", amount: "", status: "Not Started", awarded: false, awardedAmt: "", schoolIds: [] 
  });

  const totAw = schols.filter(s => s.awarded).reduce((a, s) => a + (Number(s.awardedAmt || s.amount) || 0), 0);

  function resetForm() {
    setForm({ name: "", amount: "", status: "Not Started", awarded: false, awardedAmt: "", schoolIds: [] });
    setEditId(null);
    setShowForm(false);
  }

  function save() {
    if (!form.name) return;
    
    // Check if we just scored a win
    const wasAwarded = schols.find(s => s.id === editId)?.awarded;
    if (form.awarded && !wasAwarded) {
      celebrate();
    }

    if (editId) {
      setSchols(p => p.map(s => s.id === editId ? { ...form, id: editId } : s));
    } else {
      setSchols(p => [...p, { ...form, id: Date.now() }]);
      if (form.awarded) celebrate();
    }
    resetForm();
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "20px" }}>Scholarships</h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Total Awarded: <strong style={{ color: "var(--success)" }}>{formatUSD(totAw)}</strong></p>
        </div>
        <Button onClick={() => setShowForm(true)} style={{ padding: "8px 14px" }}>
          <Plus size={16} /> Add New
        </Button>
      </div>

      <AIBtn 
        ctx={ctx} 
        apiKey={apiKey} 
        label="Search for Matching Scholarships" 
        Icon={Search} 
        prompt="Search for real scholarships matching my profile and schools. Suggest 3-5 high-probability ones." 
        onClick={() => {}} 
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {schols.length === 0 ? (
          <Card style={{ textAlign: "center", color: "var(--text-light)", padding: "40px 0" }}>
            <Award size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <p>No scholarships added yet.</p>
          </Card>
        ) : (
          schols.map(s => (
            <Card key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <h3 style={{ fontSize: "15px" }}>{s.name}</h3>
                  {s.awarded && <Badge bg="var(--success)" color="#fff"><CheckCircle size={10} style={{ marginRight: 4 }} /> Awarded</Badge>}
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", fontWeight: "700" }}>{formatUSD(Number(s.awarded ? s.awardedAmt : s.amount))}</span>
                  <Badge bg="var(--border-color)" color="var(--text-muted)" style={{ fontSize: "10px" }}>{s.status}</Badge>
                </div>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                <Button variant="ghost" onClick={() => { setForm(s); setEditId(s.id); setShowForm(true); }} style={{ padding: "6px" }}><Edit3 size={16} /></Button>
                <Button variant="ghost" onClick={() => setSchols(p => p.filter(x => x.id !== s.id))} style={{ padding: "6px" }}><Trash2 size={16} /></Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {showForm && (
        <Modal title={editId ? "Edit Scholarship" : "Add Scholarship"} onClose={resetForm} footer={
          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="ghost" onClick={resetForm}>Cancel</Button>
            <Button onClick={save}>Save Scholarship</Button>
          </div>
        }>
          <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div style={{ display: "flex", gap: "12px" }}>
            <Input label="Amount ($)" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={{ flex: 1 }} />
            <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ flex: 1 }}>
              {["Not Started", "Researching", "Drafting", "Submitted", "Denied", "Waitlisted", "Awarded"].map(x => <option key={x}>{x}</option>)}
            </Select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0" }}>
            <input type="checkbox" id="isAwarded" checked={form.awarded} onChange={e => setForm({ ...form, awarded: e.target.checked })} />
            <label htmlFor="isAwarded" style={{ fontSize: "14px", fontWeight: "600" }}>Awarded?</label>
          </div>
          {form.awarded && <Input label="Final Award Amount ($)" type="number" value={form.awardedAmt} onChange={e => setForm({ ...form, awardedAmt: e.target.value })} />}
        </Modal>
      )}
    </div>
  );
}
