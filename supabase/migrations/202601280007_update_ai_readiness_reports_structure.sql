-- Migration: Update ai_readiness_reports structure
-- Aligns the report table with the structured AI agent output
-- (business_summary, recommendations, implementation_roadmap,
--  priority_matrix, strategic_summary, and optional raw_message).

alter table public.ai_readiness_reports
  add column if not exists business_summary jsonb,        -- e.g. message.business_summary
  add column if not exists implementation_roadmap jsonb,  -- e.g. message.implementation_roadmap
  add column if not exists priority_matrix jsonb,         -- e.g. message.priority_matrix
  add column if not exists strategic_summary text,        -- e.g. message.strategic_summary
  add column if not exists raw_message jsonb;             -- full agent payload for future-proofing

