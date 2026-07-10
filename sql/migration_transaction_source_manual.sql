-- Allow 'manual' as a transaction source (manual input form).
-- The original constraint only permitted 'text', 'audio', 'image'.
alter table public.transactions
  drop constraint if exists transactions_source_check;

alter table public.transactions
  add constraint transactions_source_check
  check (source in ('text', 'audio', 'image', 'manual'));
