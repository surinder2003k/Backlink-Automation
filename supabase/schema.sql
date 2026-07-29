-- Xylos Backlinks - Supabase Schema

-- Drop old tables if they exist
DROP TABLE IF EXISTS public.posts;
DROP TABLE IF EXISTS public.schedules;
DROP TABLE IF EXISTS public.settings;
DROP TABLE IF EXISTS public.profiles;
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
  created_at TIMESTAMPTZ DEFAULT NOW()
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

-- Disable RLS for simplicity
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
