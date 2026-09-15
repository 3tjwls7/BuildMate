create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  feature_input text not null,
  analysis jsonb not null,
  selected_requirements jsonb not null,
  api_spec jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_user_created_idx on public.projects(user_id, created_at desc);
alter table public.projects enable row level security;
create policy "Users can read own projects" on public.projects for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can insert own projects" on public.projects for insert to authenticated with check ((select auth.uid()) = user_id);
