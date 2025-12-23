-- Create a table for users to track premium status and basic info
create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  image text,
  is_premium boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster email lookups
create index if not exists idx_users_email on public.users(email);

-- Enable RLS (Optional, but good practice)
alter table public.users enable row level security;

-- Simple policy: Users can only see their own profile
create policy "Users can see their own profile"
  on public.users for select
  using (email = auth.jwt() ->> 'email');

-- Grant access to service role for internal syncing
grant all on public.users to service_role;
