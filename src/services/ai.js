const WORKER_URL = 'https://college-selector-ai.joe-184.workers.dev';

export const callAI = async (msgs, ctx) => {
  const prunedCtx = {
    profile: { gpa: ctx.profile?.gpa, major: ctx.profile?.major, state: ctx.profile?.state },
    schools: (ctx.schools || []).map(s => ({ name: s.name, status: s.status, score: s.score })),
    scholarships: (ctx.scholarships || []).filter(s => s.status === 'Awarded').map(s => ({ name: s.name, amt: s.amount }))
  };

  console.log('Calling AI with messages:', msgs.length);
  console.log('Worker URL:', WORKER_URL);

  const attempt = async (retryCount = 0) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const r = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgs,
          context: prunedCtx
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('AI response status:', r.status);

      if (!r.ok) {
        return `Server error: ${r.status}`;
      }

      const d = await r.json();
      console.log('AI response data:', d);
      
      if (d.error) {
        if (d.error.includes('overloaded') && retryCount < 2) {
          await new Promise(res => setTimeout(res, 1000 * (retryCount + 1)));
          return attempt(retryCount + 1);
        }
        return `AI Coach Error: ${d.error}`;
      }
      
      return d.content || "No response.";
    } catch (err) {
      console.error('AI call error:', err.message);
      return `Connection error: ${err.message}`;
    }
  };

  return attempt();
};