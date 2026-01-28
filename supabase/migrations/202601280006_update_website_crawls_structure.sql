-- Migration: Update website_crawls structure
-- Replace single raw_crawl field with separate company_info and competitor_info JSON blobs.

alter table public.website_crawls
  drop column if exists raw_crawl,
  add column if not exists company_info jsonb,
  add column if not exists competitor_info jsonb;

