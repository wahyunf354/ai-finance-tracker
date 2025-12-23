-- Create a table for application configurations
CREATE TABLE IF NOT EXISTS public.app_configs (
  key text PRIMARY KEY,
  value text NOT NULL,
  description text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default limits
INSERT INTO public.app_configs (key, value, description)
VALUES 
  ('free_image_limit', '3', 'Daily limit for receipt scanning for free users'),
  ('free_voice_limit', '10', 'Daily limit for voice input for free users')
ON CONFLICT (key) DO NOTHING;

-- Allow service role to read/write, and anon to read (if needed, but service role is better for API)
ALTER TABLE public.app_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access" ON public.app_configs
  USING (true)
  WITH CHECK (true);
