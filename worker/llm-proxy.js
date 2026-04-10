export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    try {
      const { messages, context } = await request.json();
      
      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: 'Invalid messages array' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      const systemPrompt = `You are Kaylani's elite AI college advisor. 
VIBE: Warm, data-driven, strategic.
CONTEXT: ${JSON.stringify(context || {})}
GOAL: Provide actionable, specific advice. If search is requested, synthesize 2025 trends.`;

      const provider = env.AI_PROVIDER || 'gemini';
      
      if (provider === 'gemini') {
        return await callGemini(messages, systemPrompt, env);
      } else if (provider === 'cloudflare') {
        return await callCloudflareAI(messages, systemPrompt, env);
      } else {
        return await callAnthropic(messages, systemPrompt, env);
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};

async function callGemini(messages, systemPrompt, env) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Gemini API key not configured. Get free key at: https://aistudio.google.com/apikey' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: contents,
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.7
      }
    })
  });

  const data = await response.json();
  
  if (data.error) {
    return new Response(JSON.stringify({ error: data.error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
  
  return new Response(JSON.stringify({ content: text }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

async function callCloudflareAI(messages, systemPrompt, env) {
  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: fullMessages,
    max_tokens: 1500,
  });

  return new Response(JSON.stringify({ content: response.response || 'No response.' }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

async function callAnthropic(messages, systemPrompt, env) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      system: systemPrompt,
      messages: messages,
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    return new Response(JSON.stringify({ error: data.error.message }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const text = data.content?.filter(b => b.type === 'text').map(b => b.text).join('\n') || 'No response.';
  
  return new Response(JSON.stringify({ content: text }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
