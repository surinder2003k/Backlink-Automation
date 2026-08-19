-- Xylos Backlinks - Supabase Schema

-- Drop old tables if they exist
DROP TABLE IF EXISTS public.posts;
DROP TABLE IF EXISTS public.schedules;
DROP TABLE IF EXISTS public.settings;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.used_urls;
DROP TABLE IF EXISTS public.automation_config;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Posts table (no user_id)
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  excerpt TEXT,
  platforms TEXT[] NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed')),
  platform_results JSONB DEFAULT '{}',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  source_type TEXT DEFAULT 'manual' CHECK (source_type IN ('manual', 'automated')),
  automation_batch_id UUID
);

-- Schedules table (no user_id)
CREATE TABLE public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  time_slot TEXT NOT NULL,
  platforms TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table (no user_id)
CREATE TABLE public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  twitter_api_key TEXT DEFAULT '',
  twitter_api_secret TEXT DEFAULT '',
  twitter_access_token TEXT DEFAULT '',
  twitter_access_secret TEXT DEFAULT '',
  linkedin_access_token TEXT DEFAULT '',
  reddit_client_id TEXT DEFAULT '',
  reddit_client_secret TEXT DEFAULT '',
  reddit_username TEXT DEFAULT '',
  medium_access_token TEXT DEFAULT '',
  devto_api_key TEXT DEFAULT '',
  blog_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Used URLs table - tracks URLs that have been used for backlinks to prevent repetition
CREATE TABLE public.used_urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  source_sitemap TEXT,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL
);

-- Automation config table - stores automation settings
CREATE TABLE public.automation_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  is_enabled BOOLEAN DEFAULT false,
  interval_hours INTEGER DEFAULT 6,
  max_posts_per_run INTEGER DEFAULT 3,
  platforms TEXT[] NOT NULL DEFAULT '{"devto", "blogger", "tumblr"}',
  sitemap_urls TEXT[] NOT NULL DEFAULT '{"https://xylosai.vercel.app/sitemap.xml", "https://pathseekers.vercel.app/sitemap.xml", "https://surinder-web-dev.vercel.app/sitemap.xml"}',
  current_sitemap_index INTEGER DEFAULT 0,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for simplicity
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.used_urls DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_config DISABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_source_type ON public.posts(source_type);
CREATE INDEX IF NOT EXISTS idx_used_urls_url ON public.used_urls(url);
CREATE INDEX IF NOT EXISTS idx_used_urls_used_at ON public.used_urls(used_at DESC);
