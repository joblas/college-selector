# Cloudflare Worker Deployment

## AI Provider Options

### Option 1: Google Gemini Flash (FREE - Recommended)
1. Get free API key: https://aistudio.google.com/apikey
2. No credit card required
3. 15 requests/minute, 1M tokens/day free tier

### Option 2: Cloudflare Workers AI (FREE)
1. Built into Cloudflare
2. Uses Llama 3.1 8B
3. No external API key needed

### Option 3: Anthropic Claude (Paid)
1. Get API key: https://console.anthropic.com
2. Pay per use

## Setup

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy the worker:
```bash
cd worker
wrangler deploy
```

4. Add your API key (choose one):

**For Gemini (Free):**
```bash
wrangler secret put GEMINI_API_KEY
```

**For Anthropic (Paid):**
```bash
wrangler secret put ANTHROPIC_API_KEY
```

5. Switch providers (optional):
Edit `wrangler.toml` and change `AI_PROVIDER` to:
- `"gemini"` (default, free)
- `"cloudflare"` (free, no key needed)
- `"anthropic"` (paid)

6. Note your worker URL (e.g., `https://college-selector-ai.your-account.workers.dev`)

## Update Frontend

Update the `WORKER_URL` in `src/services/ai.js` with your worker URL.

## Testing

Test the worker:
```bash
curl -X POST https://your-worker.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"context":{}}'
```

## Free Tier Limits

| Provider | Requests | Tokens | Cost |
|----------|----------|--------|------|
| Gemini Flash | 15/min | 1M/day | Free |
| Cloudflare AI | 100k/day | 10M/day | Free |
| Anthropic | Pay per use | Pay per use | ~$3/1M tokens |
