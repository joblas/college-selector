# Deployment Guide

## Prerequisites
- Cloudflare account (free)
- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)

## Step 1: Get Free AI API Key

**Recommended: Google Gemini Flash (FREE)**
1. Go to: https://aistudio.google.com/apikey
2. Create free API key (no credit card)
3. Free tier: 15 requests/min, 1M tokens/day

**Alternative: Cloudflare Workers AI (FREE)**
- Built into Cloudflare
- No API key needed
- Uses Llama 3.1 8B

## Step 2: Deploy the AI Worker

```bash
cd worker
wrangler login
wrangler deploy
```

Add your Gemini API key:
```bash
wrangler secret put GEMINI_API_KEY
```

Note your worker URL (e.g., `https://college-selector-ai.your-account.workers.dev`)

## Step 3: Update Frontend

Edit `src/services/ai.js` and update the `WORKER_URL`:

```javascript
const WORKER_URL = 'https://college-selector-ai.your-account.workers.dev';
```

## Step 4: Build and Deploy Frontend

```bash
npm run build
```

### Option A: Cloudflare Pages (Recommended)

1. Push to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

### Option B: Manual Upload

Upload the `dist/` folder to Cloudflare Pages.

## Step 5: Configure Custom Domain (Optional)

In Cloudflare Pages dashboard:
1. Go to Custom domains
2. Add your domain
3. Update DNS records

## Switching AI Providers

Edit `worker/wrangler.toml`:

```toml
[vars]
AI_PROVIDER = "gemini"      # Free, best quality
# AI_PROVIDER = "cloudflare" # Free, no key needed
# AI_PROVIDER = "anthropic"   # Paid, highest quality
```

## Cost Summary

| Component | Cost |
|-----------|------|
| Cloudflare Pages | Free |
| Cloudflare Worker | Free (100k requests/day) |
| Gemini Flash API | Free (1M tokens/day) |
| **Total** | **$0/month** |

## Testing

1. Open deployed app
2. Click AI Advisor button (Bot icon)
3. Send a message to test AI integration

## Troubleshooting

- **CORS errors**: Worker handles CORS automatically
- **AI not responding**: Check worker logs in Cloudflare dashboard
- **Build errors**: Run `npm install` to ensure dependencies
- **API key error**: Verify secret is set with `wrangler secret list`
