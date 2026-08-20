# Xylos Backlinks

Cyberpunk-themed backlink automation dashboard that posts to Dev.to, Blogger, and Tumblr with AI-generated content.

## Tech Stack

- **Frontend:** Next.js 15, Tailwind CSS, Radix UI
- **Database:** Supabase (PostgreSQL)
- **AI Content:** OpenRouter API (Mistral 7B free tier) with local fallback
- **Hosting:** Vercel
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
| `XYLOS_AUTH_USERNAME` | Server-side dashboard username |
| `XYLOS_AUTH_PASSWORD` | Server-side dashboard password |
| `XYLOS_AUTH_SECRET` | Long random secret used to sign the HttpOnly session cookie |
| `XYLOS_SUPABASE_URL` | Supabase project URL |
| `XYLOS_SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `DEVTO_API_KEY` | Dev.to API key |
| `TUMBLR_*` | Tumblr OAuth credentials |
| `BLOGGER_*` | Blogger OAuth credentials |
| `OPENROUTER_API_KEY` | OpenRouter API key (optional, has local fallback) |
| `CRON_SECRET` | Secret for automation cron endpoint |

## Features

- Post to Dev.to, Blogger, Tumblr simultaneously
- AI-generated 500+ word articles with backlinks
- Schedule posts with calendar picker
- Inline posting progress in table rows
- **Automation:** Runs on the configured cron interval, rotating through 3 sitemaps
- **URL Tracking:** Prevents duplicate backlinks to the same URL
- **Blog Verification:** Verifies blogs are actually created on platforms
- **Sitemap Rotation:** Cycles through XylosAI, Pathseekers, Surinder Web Dev
- Mobile responsive with cyberpunk theme

## Automation

The automation system:
1. Runs every 6 hours (configurable)
2. Picks the next sitemap in rotation (XylosAI → Pathseekers → Surinder Web Dev)
3. Fetches blog URLs from the sitemap
4. Filters out already-used URLs
5. Generates AI content with backlinks
6. Posts to configured platforms
7. Verifies each blog post was created successfully
8. Marks URLs as used to prevent repetition

### Sitemaps in Rotation
- `https://xylosai.vercel.app/sitemap.xml`
- `https://pathseekers.vercel.app/sitemap.xml`
- `https://surinder-web-dev.vercel.app/sitemap.xml`

### Cron Setup

For Vercel Hobby deployments, the included cron runs once per day because Hobby projects do not allow multiple cron executions per day. To run every 6 hours, use Vercel Pro or an external scheduler that sends the `CRON_SECRET` header:

```bash
# Vercel Cron (vercel.json)
{
  "crons": [{
    "path": "/api/automation/cron",
    "schedule": "0 0 * * *"
  }]
}
```

Or use GitHub Actions, cron-job.org, etc. with the `CRON_SECRET` header.

## Database Schema

Run `supabase/schema.sql` in your Supabase SQL editor. Creates:
- `posts` - Backlink posts with status, platforms, results
- `schedules` - Scheduled posting times
- `settings` - API keys and configuration
- `used_urls` - Tracks URLs that have been used (prevents duplicates)
- `automation_config` - Automation settings (interval, platforms, sitemap rotation)

## Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run local Playwright tests (remote live-site tests are opt-in)
npm run test:property # Run property-based authentication tests
npm run test:ui      # Run tests with UI
npm run test:headed  # Run tests headed
```

## Testing

Playwright tests cover:
- Dashboard stats and automation status
- Posts page with filtering
- Schedule page with create dialog
- Settings page with automation config
- Responsive design (mobile, tablet, desktop)
- API endpoints

Run tests: `npm run test`. The legacy remote deployment suite is intentionally ignored unless `RUN_LIVE_SITE=1` is set, because it performs mutating actions against a real site.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── automation/
│   │   │   ├── config/route.ts     # Automation settings API
│   │   │   └── cron/route.ts       # Automation cron endpoint
│   │   ├── generate-content/       # AI content generation
│   │   ├── post-now/               # Immediate posting
│   │   ├── posts/                  # Posts CRUD
│   │   ├── settings/               # Settings API
│   │   └── webhook/                # Legacy scheduled posting
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard layout with sidebar
│   │   ├── page.tsx                # Dashboard overview
│   │   ├── client.tsx              # Dashboard client component
│   │   ├── posts/                  # Posts management
│   │   ├── schedule/               # Schedule management
│   │   └── settings/               # Settings page
│   ├── login/                      # Login page
│   ├── globals.css                 # Global styles with cyberpunk theme
│   └── layout.tsx                  # Root layout
├── components/
│   ├── dashboard/
│   │   ├── stats-cards.tsx         # Stats cards
│   │   ├── recent-posts.tsx        # Recent posts widget
│   │   ├── automation-status.tsx   # Automation status widget
│   │   └── posts-table.tsx         # Posts table with expandable rows
│   ├── layout/
│   │   ├── sidebar.tsx             # Responsive sidebar
│   │   ├── header.tsx              # Top header
│   │   └── dashboard-providers.tsx # Theme provider
│   └── ui/                         # Radix UI components
├── lib/
│   ├── platforms/
│   │   ├── ai-content.ts           # AI content generation + sitemap fetching
│   │   ├── devto.ts                # Dev.to posting
│   │   ├── blogger.ts              # Blogger posting
│   │   └── tumblr.ts               # Tumblr posting
│   ├── supabase/
│   │   └── server.ts               # Supabase server client
│   └── utils.ts                    # Utility functions
├── supabase/
│   └── schema.sql                  # Database schema
├── tests/
│   └── dashboard.spec.ts           # Playwright tests
└── playwright.config.ts            # Playwright configuration
```

## License

MIT
