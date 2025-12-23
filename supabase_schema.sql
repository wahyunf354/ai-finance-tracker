-- Create a table for public transactions
create table transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date date not null default CURRENT_DATE,
  description text not null,
  amount numeric not null,
  category text not null,
  type text check (type in ('income', 'expense')) not null
);

-- Set up Row Level Security (RLS)
-- For a simple personal app, we might check if the user is authenticated, 
-- or if it's just a local demo, we can allow public access (NOT RECOMMENDED for production).
-- Assuming we want to allow anyone with the anon key to read/write for this demo:

alter table transactions enable row level security;

create policy "Enable read access for all users"
on transactions for select
using (true);

create policy "Enable insert for all users"
on transactions for insert
with check (true);

create policy "Enable update for all users"
on transactions for update
using (true);

create policy "Enable delete for all users"
on transactions for delete
using (true);
