-- Add source column to transactions to track how it was created
alter table public.transactions add column if not exists source text default 'text' check (source in ('text', 'audio', 'image'));

-- Index for faster filtering by source and date
create index if not exists idx_transactions_source_date on public.transactions(user_email, source, date);
