-- Add billing_cycle_start_day column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_cycle_start_day INTEGER DEFAULT 1;
