-- Create budgets table
create table if not exists budgets (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_email text not null,
  category text not null,
  amount numeric not null default 0,
  constraint unique_user_category unique (user_email, category)
);

-- Enable RLS
alter table budgets enable row level security;

-- Setup Policies (Open for demo/all users as per existing schema pattern, or restricted)
-- For consistency with existing schema which uses "true" for all:
create policy "Enable read access for all users"
on budgets for select
using (true);

create policy "Enable all access for users"
on budgets for all
using (true)
with check (true);
