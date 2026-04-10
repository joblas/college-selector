# Deployment Guide

## Prerequisites
- Cloudflare account (free)
- GitHub repository access
- GitHub repository secrets configured

## Step 1: Get Cloudflare API Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Custom Token"
3. Configure:
   - **Name**: GitHub Actions Deploy
   - **Permissions**:
     - Account: Edit
     - Zone: Read
     - Workers: Edit
     - Pages: Edit
4. Copy the generated token

## Step 2: Add Secrets to GitHub

1. Go to: https://github.com/joblas/college-selector/settings/secrets/new
2. Add secret:
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Value**: Paste your Cloudflare API token

## Step 3: Automatic Deployment

The GitHub Actions workflow will now:
1. Trigger on every push to master
2. Build the frontend (`npm run build`)
3. Deploy to Cloudflare Pages automatically
