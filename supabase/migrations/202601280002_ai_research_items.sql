-- Migration: AI research scratchpad table
-- Creates a generic research_items table for AI agents to store
-- intermediate findings per AI readiness request.

create table if not exists public.ai_research_items (
  id uuid primary key default gen_random_uuid(),

  -- Link back to the original request
  request_id uuid not null
    references public.ai_readiness_requests (id)
    on delete cascade,

  -- What this piece of research is about
  category text not null,        -- e.g. 'services', 'competitors', 'reviews', 'local_seo'
  source_type text not null,     -- e.g. 'website', 'google_search', 'google_maps', 'reviews', 'social'
  source_url text,               -- page or API URL, if available

  -- Who/what produced it
  agent_name text not null,      -- e.g. 'services_extractor', 'competitor_finder'
  confidence numeric,            -- 0–1 or 0–100

  -- Payload
  raw_content text,              -- unstructured text, scrape, etc.
  structured jsonb,              -- structured data: services list, competitors, ratings, etc.

  created_at timestamptz not null default timezone('utc', now())
);

-- Helpful indexes
create index if not exists idx_ai_research_items_request_id
  on public.ai_research_items (request_id);

create index if not exists idx_ai_research_items_category
  on public.ai_research_items (category);

