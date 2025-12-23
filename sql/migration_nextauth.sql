-- 1. Disable RLS on transactions table (since we handle auth in API)
alter table transactions disable row level security;

-- 2. Add user_email column to identify users from Google Auth
alter table transactions add column if not exists user_email text;

-- 3. (Optional) Make user_id nullable or drop it if not needed anymore
alter table transactions alter column user_id drop not null;
-- OR: alter table transactions drop column user_id;

-- 4. Create an index on user_email for faster queries
create index if not exists idx_transactions_user_email on transactions(user_email);
