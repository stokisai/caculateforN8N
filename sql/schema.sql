-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Enum for input type
do $$
begin
  if not exists (select 1 from pg_type typ join pg_namespace nsp on nsp.oid = typ.typnamespace where typ.typname = 'input_type_enum') then
    create type public.input_type_enum as enum ('file', 'text', 'both');
  end if;
end $$;

-- profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz
);

-- services table
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text,
  webhook_url text not null,
  input_type input_type_enum not null default 'text',
  created_at timestamptz default timezone('utc', now()) not null
);

-- tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  input_text text,
  file_url text,
  status text default 'pending',
  created_at timestamptz default timezone('utc', now()) not null
);

-- Indexes
create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_service_id on public.tasks(service_id);

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

-- Automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, phone)
  values (new.id, new.email, new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Seed a starter service (n8n test)
insert into public.services (title, description, image_url, webhook_url, input_type)
values (
  'Keyword Extraction Agent',
  'Extracts keywords from your input text or spreadsheet and forwards to n8n.',
  'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1200&q=80',
  'https://primary-production-6672d.up.railway.app/webhook-test/test-hook',
  'both'
)
on conflict do nothing;

-- Storage bucket for task files
insert into storage.buckets (id, name, public)
values ('task-files', 'task-files', false)
on conflict (id) do nothing;

-- RLS
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.tasks enable row level security;

-- Policies
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Profiles are readable by owner') then
    create policy "Profiles are readable by owner" on public.profiles
      for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Profiles are updatable by owner') then
    create policy "Profiles are updatable by owner" on public.profiles
      for update using (auth.uid() = id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'services' and policyname = 'Services are readable by all') then
    create policy "Services are readable by all" on public.services
      for select using (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'tasks' and policyname = 'Tasks are readable by owner') then
    create policy "Tasks are readable by owner" on public.tasks
      for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'tasks' and policyname = 'Tasks are insertable by owner') then
    create policy "Tasks are insertable by owner" on public.tasks
      for insert with check (auth.uid() = user_id);
  end if;
end $$;

-- Storage policies for task-files bucket
do $$
begin
  if not exists (
    select 1
    from storage.policies p
    join storage.buckets b on b.id = p.bucket_id
    where p.name = 'Allow authenticated uploads to task-files'
      and b.id = 'task-files'
  ) then
    create policy "Allow authenticated uploads to task-files"
      on storage.objects for insert
      to authenticated
      with check (bucket_id = 'task-files' and auth.uid() = owner);
  end if;

  if not exists (
    select 1
    from storage.policies p
    join storage.buckets b on b.id = p.bucket_id
    where p.name = 'Allow owners to read task-files'
      and b.id = 'task-files'
  ) then
    create policy "Allow owners to read task-files"
      on storage.objects for select
      to authenticated
      using (bucket_id = 'task-files' and auth.uid() = owner);
  end if;
end $$;

-- Note: for phone auth, enable SMS in Supabase Auth settings and add an SMS provider.

