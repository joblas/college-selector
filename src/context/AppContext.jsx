import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CRITERIA, FIN, COLORS } from '../utils/constants';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [schools, setSchools] = useLocalStorage('college_schools', []);
  const [schols, setSchols] = useLocalStorage('college_schols', []);
  const [weights, setWeights] = useLocalStorage('college_weights', {});
  const [profile, setProfile] = useLocalStorage('college_profile', {
    name: "Kaylani", gpa: "", state: "", major: "", ecs: "", awards: "", essays: []
  });
  const [apiKey, setApiKey] = useLocalStorage('college_anthropic_key', '');

  const formatUSD = useCallback((v) => 
    (!v || isNaN(v)) ? "$0" : "$" + Number(v).toLocaleString(), 
  []);

  const getFinCalc = useCallback((s, sc) => {
    const f = s.finances || {};
    const cost = FIN.filter(x => x.c === "cost").reduce((a, x) => a + (Number(f[x.id]) || 0), 0);
    const grantAid = FIN.filter(x => x.c === "aid").reduce((a, x) => a + (Number(f[x.id]) || 0), 0);
    const linked = (sc || []).filter(x => x.awarded && x.schoolIds?.includes(s.id));
    const scholAmt = linked.reduce((a, x) => a + (Number(x.awardedAmt || x.amount) || 0), 0);
    const freeAid = grantAid + scholAmt;
    const loans = FIN.filter(x => x.c === "loan").reduce((a, x) => a + (Number(f[x.id]) || 0), 0);
    const net = Math.max(0, cost - freeAid);
    return { cost, grantAid, scholAmt, freeAid, loans, net, linked };
  }, []);

  const calcScore = useCallback((s) => {
    let t = 0, m = 0;
    CRITERIA.forEach(c => {
      const w = weights[c.id] || 5;
      t += (s.scores?.[c.id] || 0) * w;
      m += 10 * w;
    });
    return m > 0 ? Math.round((t / m) * 100) : 0;
  }, [weights]);

  const nudges = useMemo(() => {
    const n = [];
    if (schools.length === 0) return [{ id: 'add', type: 'info', text: 'Add your first school to start your journey.' }];
    
    const missingScores = schools.filter(s => Object.keys(s.scores || {}).length < CRITERIA.length);
    if (missingScores.length > 0) {
      n.push({ id: 'scores', type: 'warning', text: `Finish scoring ${missingScores[0].name} to get a better "Fit" comparison.` });
    }

    const today = new Date();
    schools.forEach(s => {
      if (s.deadline) {
        const days = Math.ceil((new Date(s.deadline) - today) / (1000 * 60 * 60 * 24));
        if (days >= 0 && days < 14) n.push({ id: `dl-${s.id}`, type: 'danger', text: `${s.name} deadline is in ${days} days!` });
      }
    });

    if (schols.length === 0) n.push({ id: 'schol-start', type: 'info', text: "Start your scholarship hunt." });
    if (!profile.gpa) n.push({ id: 'prof-gpa', type: 'warning', text: "Add your GPA for accurate AI advice." });

    const tips = [
      "Strategic Tip: Email a campus recruiter today.",
      "Goal Check: Are your 'Safety' schools actually safe?",
      "Essay Boost: Use a unique 'Hook' for your personal statement.",
      "Financial Win: Check institutional merit scholarships.",
      "Network: Reach out to one alum on LinkedIn."
    ];
    n.push({ id: 'daily-tip', type: 'info', text: tips[new Date().getDate() % tips.length] });

    return n;
  }, [schools, schols, profile.gpa]);

  const globalProgress = useMemo(() => {
    if (schools.length === 0) return 0;
    let total = schools.length * 3 + 2, done = 0;
    schools.forEach(s => {
      if (Object.keys(s.scores || {}).length >= CRITERIA.length) done++;
      if ((s.checklist || []).length > 0 && s.checklist.every(i => i.completed)) done++;
      if (['Applied', 'Accepted'].includes(s.status)) done++;
    });
    if ((profile.essays || []).length > 0) done++;
    if (schols.length > 0) done++;
    return Math.round((done / total) * 100);
  }, [schools, profile.essays, schols]);

  const value = { schools, setSchools, schols, setSchols, weights, setWeights, profile, setProfile, apiKey, setApiKey, formatUSD, getFinCalc, calcScore, nudges, globalProgress, COLORS, CRITERIA };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
