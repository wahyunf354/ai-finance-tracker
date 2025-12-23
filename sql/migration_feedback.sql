-- Create feedback table
create table if not exists feedback (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_email text, -- Can be null if we allow anonymous feedback, or linked to next-auth email
  message text not null,
  rating integer -- Optional 1-5 rating
);

-- Disable RLS for now (we'll handle security via Server Action/API)
alter table feedback disable row level security;
