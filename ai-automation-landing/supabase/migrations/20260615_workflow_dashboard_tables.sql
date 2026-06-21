-- Workflow and dashboard persistence tables
-- Safe to run in Supabase Postgres.

create extension if not exists pgcrypto;

create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  client text not null,
  stage text not null check (stage in ('discovery', 'implementation', 'testing', 'live', 'paused')),
  status text not null check (status in ('active', 'paused', 'archived')),
  estimated_minutes_saved_per_run integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  steps_json jsonb not null default '[]'::jsonb,
  stage_history_json jsonb not null default '[]'::jsonb
);

alter table if exists public.workflows
  add column if not exists estimated_minutes_saved_per_run integer not null default 0;

create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  status text not null check (status in ('queued', 'running', 'succeeded', 'failed')),
  triggered_at timestamptz not null default timezone('utc', now()),
  started_at timestamptz null,
  completed_at timestamptz null,
  summary text not null,
  constraint workflow_runs_completion_order_chk
    check (completed_at is null or completed_at >= triggered_at),
  constraint workflow_runs_start_order_chk
    check (started_at is null or started_at >= triggered_at)
);

create index if not exists workflows_updated_at_idx
  on public.workflows (updated_at desc);

create index if not exists workflows_stage_idx
  on public.workflows (stage);

create index if not exists workflows_status_idx
  on public.workflows (status);

create index if not exists workflow_runs_workflow_id_idx
  on public.workflow_runs (workflow_id);

create index if not exists workflow_runs_triggered_at_idx
  on public.workflow_runs (triggered_at desc);

create index if not exists workflow_runs_status_idx
  on public.workflow_runs (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists workflows_set_updated_at on public.workflows;
create trigger workflows_set_updated_at
before update on public.workflows
for each row
execute function public.set_updated_at();

-- RLS policies are optional for these tables because serverless endpoints
-- use service-role credentials. Keep RLS disabled unless direct client access is needed.
