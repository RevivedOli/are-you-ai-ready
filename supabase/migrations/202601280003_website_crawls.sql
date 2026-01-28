-- Migration: Website crawls cache
-- Stores raw Firecrawl output per website and links requests to crawls.

create table if not exists public.website_crawls (
  id uuid primary key default gen_random_uuid(),

  -- Identity
  website_url text not null,          -- normalized root URL (e.g. https://example.com)
  url_hash text,                      -- optional hash of website_url for fast lookups

  -- Raw crawler payload
  raw_crawl jsonb not null,          -- full Firecrawl JSON (or subset)
  crawled_at timestamptz not null default timezone('utc', now()),

  -- Metadata
  source text default 'firecrawl',
  notes text
);

create index if not exists idx_website_crawls_website_url
  on public.website_crawls (website_url);

-- Link AI readiness requests to a website crawl (optional per request)
alter table public.ai_readiness_requests
  add column if not exists website_crawl_id uuid
    references public.website_crawls (id) on delete set null;

