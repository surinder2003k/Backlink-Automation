# Xylos Backlinks

Cyberpunk-themed backlink automation dashboard that posts to Dev.to, Blogger, and Tumblr with AI-generated content.

## Tech Stack

- **Frontend:** Next.js 15, Tailwind CSS, Radix UI
- **Database:** Supabase (PostgreSQL)
- **AI Content:** OpenRouter API (Mistral 7B free tier) with local fallback
- **Hosting:** Netlify
- **Testing:** Playwright

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your keys
3. Run the SQL from `supabase/schema.sql` in your Supabase dashboard
4. `npm install && npm run dev`

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Description |
|----------|-------------|
| `XYLOS_SUPABASE_URL` | Supabase project URL |
| `XYLOS_SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `DEVTO_API_KEY` | Dev.to API key |
| `TUMBLR_*` | Tumblr OAuth credentials |
| `BLOGGER_*` | Blogger OAuth credentials |
| `OPENROUTER_API_KEY` | OpenRouter API key (optional, has local fallback) |

## Features

- Post to Dev.to, Blogger, Tumblr simultaneously
- AI-generated 500+ word articles with backlinks
- Schedule posts with calendar picker
- Inline posting progress in table rows
- Mobile responsive
