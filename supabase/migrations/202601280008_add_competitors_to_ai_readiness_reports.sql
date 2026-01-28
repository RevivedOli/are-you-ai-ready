-- Migration: add competitors JSON column to ai_readiness_reports
-- Purpose: store structured competitor analysis per report

alter table public.ai_readiness_reports
  add column if not exists competitors jsonb;

-- Optional: enable this if you plan to query/filter by competitors a lot.
-- This adds a GIN index for faster JSONB lookups.

-- create index if not exists idx_ai_readiness_reports_competitors_gin
--   on public.ai_readiness_reports
--   using gin (competitors);

