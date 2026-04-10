export const callAI = async (msgs, ctx, apiKey = "") => {
  if (!apiKey) return "Please add your Anthropic API Key in Settings.";
  
  // Minimal context pruning to save tokens
  const prunedCtx = {
    profile: { gpa: ctx.profile?.gpa, major: ctx.profile?.major, state: ctx.profile?.state },
    schools: (ctx.schools || []).map(s => ({ name: s.name, status: s.status, score: s.score, net: s.fin?.net })),
    scholarships: (ctx.scholarships || []).filter(s => s.status === 'Awarded').map(s => ({ name: s.name, amt: s.amount }))
  };

  const attempt = async (retryCount = 0) => {
    try {
      const sys = `You are Kaylani's elite AI college advisor. 
      VIBE: Warm, data-driven, strategic.
      CONTEXT: ${JSON.stringify(prunedCtx)}
      GOAL: Provide actionable, specific advice. If search is requested, synthesize 2025 trends.`;

      const body = {
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        system: sys,
        messages: msgs
      };

      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", 
        headers: { 
          "Content-Type": "application/json", 
          "x-api-key": apiKey, 
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true" 
        },
        body: JSON.stringify(body)
      });

      const d = await r.json();
      if (d.error) {
        if (d.error.type === "overloaded_error" && retryCount < 2) {
          await new Promise(res => setTimeout(res, 1000 * (retryCount + 1)));
          return attempt(retryCount + 1);
        }
        return `AI Coach Error: ${d.error.message}`;
      }
      return d.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "No response.";
    } catch (err) {
      return "Network error. Please ensure you have an active internet connection and CORS is handled (proxy suggested for production).";
    }
  };

  return attempt();
};
