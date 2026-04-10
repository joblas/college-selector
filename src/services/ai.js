const WORKER_URL = 'https://college-selector-ai.joe-184.workers.dev';

export const callAI = async (msgs, ctx, apiKey = "") => {
  const prunedCtx = {
    profile: { gpa: ctx.profile?.gpa, major: ctx.profile?.major, state: ctx.profile?.state },
    schools: (ctx.schools || []).map(s => ({ name: s.name, status: s.status, score: s.score, net: s.fin?.net })),
    scholarships: (ctx.scholarships || []).filter(s => s.status === 'Awarded').map(s => ({ name: s.name, amt: s.amount }))
  };

  const attempt = async (retryCount = 0) => {
    try {
      const r = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgs,
          context: prunedCtx
        })
      });

      const d = await r.json();
      
      if (d.error) {
        if (d.error.includes('overloaded') && retryCount < 2) {
          await new Promise(res => setTimeout(res, 1000 * (retryCount + 1)));
          return attempt(retryCount + 1);
        }
        return `AI Coach Error: ${d.error}`;
      }
      
      return d.content || "No response.";
    } catch {
      return "Network error. Please check your internet connection.";
    }
  };

  return attempt();
};
