-- Add nda_content to hiring_jobs
ALTER TABLE public.hiring_jobs
ADD COLUMN IF NOT EXISTS nda_content text;
