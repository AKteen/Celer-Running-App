-- Run this in your Supabase SQL Editor

-- Users table (mirrors auth.users, auto-populated via trigger)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  "createdAt" timestamptz default now()
);

-- Activities table
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references public.users(id) on delete cascade,
  "activityType" text not null check ("activityType" in ('run', 'walk')),
  "startedAt" timestamptz not null,
  "endedAt" timestamptz not null,
  "durationSeconds" integer not null,
  "distanceKm" numeric(8,3) not null,
  "averagePace" text not null,
  route jsonb not null default '[]',
  metadata jsonb not null default '{}',
  "createdAt" timestamptz default now()
);

-- Row Level Security
alter table public.users enable row level security;
alter table public.activities enable row level security;

-- Users: only own row
create policy "Users can read own profile"
  on public.users for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);

-- Activities: full CRUD on own activities
create policy "Users can read own activities"
  on public.activities for select using (auth.uid() = "userId");

create policy "Users can insert own activities"
  on public.activities for insert with check (auth.uid() = "userId");

create policy "Users can delete own activities"
  on public.activities for delete using (auth.uid() = "userId");

-- Trigger: auto-create user profile on sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
