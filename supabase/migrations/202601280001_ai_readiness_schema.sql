-- Migration: AI readiness schema
-- Copy this into your Supabase project (CLI or SQL editor)
-- to create the core tables for the onboarding + report flow.

-- Optional: custom enum types (you can also store as text if preferred)
create type public.company_size as enum ('small', 'medium', 'large');
create type public.ai_adoption_level as enum ('none', 'experimenting', 'few_places', 'mature');
create type public.ai_talent as enum ('in_house', 'consultants', 'none');
create type public.readiness_status as enum ('pending', 'processing', 'completed', 'failed');

-- Table: ai_readiness_requests
create table if not exists public.ai_readiness_requests (
  id uuid primary key default gen_random_uuid(),

  -- Identity & consent
  email text not null,
  consent_accepted boolean not null default false,

  -- Business context
  industry text,
  website_url text,
  company_name text,
  company_size company_size,
  ai_adoption_level ai_adoption_level,
  ai_talent ai_talent,
  business_goals text[] default array[]::text[],
  response_speed_to_leads text,
  missed_calls text,
  additional_context text,

  -- Processing status
  status readiness_status not null default 'pending',

  -- Link to auth user (optional but recommended)
  user_id uuid references auth.users (id) on delete set null,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Keep updated_at fresh
create or replace function public.set_ai_readiness_requests_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_ai_readiness_requests_updated_at
on public.ai_readiness_requests;

create trigger trg_ai_readiness_requests_updated_at
before update on public.ai_readiness_requests
for each row
execute procedure public.set_ai_readiness_requests_updated_at();

-- Table: ai_readiness_reports
create table if not exists public.ai_readiness_reports (
  id uuid primary key default gen_random_uuid(),

  request_id uuid not null references public.ai_readiness_requests (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,

  summary text,
  detailed_report text,
  recommendations jsonb,

  completed_at timestamptz default timezone('utc', now())
);

-- Helpful indexes
create index if not exists idx_ai_readiness_requests_email
  on public.ai_readiness_requests (email);

create index if not exists idx_ai_readiness_requests_status
  on public.ai_readiness_requests (status);

create index if not exists idx_ai_readiness_reports_request_id
  on public.ai_readiness_reports (request_id);

