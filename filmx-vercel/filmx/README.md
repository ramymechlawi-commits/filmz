# FILMx — AI Faceless Reel Generator

## Deploy to Vercel in 5 Steps

### Step 1 — Create a GitHub account (if you don't have one)
Go to github.com and sign up free.

### Step 2 — Upload this project to GitHub
1. Go to github.com/new
2. Name it: filmx
3. Click "Create repository"
4. Upload all files from this folder (drag & drop)

### Step 3 — Connect to Vercel
1. Go to vercel.com
2. Click "Sign up" → "Continue with GitHub"
3. Click "Add New Project"
4. Select your filmx repository
5. Click "Deploy"

### Step 4 — Done!
Vercel gives you a live URL like: https://filmx.vercel.app

### Step 5 — Use the app
1. Open your live URL
2. Sign up with any email
3. Go to Settings → paste your Shotstack sandbox key
4. Create your first real reel!

## How It Works
- React frontend (no CORS issues via Vercel serverless functions)
- /api/render.js → submits render to Shotstack
- /api/status.js → polls render status
- Shotstack renders real MP4 with stock footage + AI voice + captions

## Support
Built with FILMx AI Studio
