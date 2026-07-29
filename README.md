# Xylos Backlinks

A full-stack Next.js 15 backlink automation dashboard with cyberpunk noir theme.

## Tech Stack

- Next.js 15 (App Router)
- Supabase (PostgreSQL)
- Tailwind CSS + shadcn/ui
- Node-cron (scheduled posting)

## Quick Start

### 1. Apply Database Schema

Go to the Supabase Dashboard SQL Editor and paste `supabase/schema.sql`, then run it.

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values. See `VERCEL-ENV.txt` for all required variables.

### 3. Install & Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and login with `sunny` / `3424`.

## Deploy to Vercel

1. Push to GitHub
2. Import repo on [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.local`
4. Deploy

## Features

- Cookie-based authentication
- Dashboard with stats overview
- Posts table with clickable platform result URLs
- Posting progress bar with ETA
- Schedule posting with time slots and platform selection
- Manual "Post Now" button
- Windows-style hover outlines
- Cyberpunk Noir theme with glass-card panels
- Active platforms: Dev.to, Blogger, Tumblr
