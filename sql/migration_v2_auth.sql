-- Add user_id to transactions table
alter table transactions add column if not exists user_id uuid references auth.users(id);

-- Enable RLS (if not already enabled)
alter table transactions enable row level security;

-- Drop insecure public policies if they exist
drop policy if exists "Enable read access for all users" on transactions;
drop policy if exists "Enable insert for all users" on transactions;
drop policy if exists "Enable update for all users" on transactions;
drop policy if exists "Enable delete for all users" on transactions;

-- Create secure policies linked to auth.uid()
create policy "Users can only see their own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on transactions for delete
  using (auth.uid() = user_id);
