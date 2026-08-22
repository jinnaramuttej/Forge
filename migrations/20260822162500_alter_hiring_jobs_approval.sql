-- Alter hiring_jobs table to add approval workflow columns
ALTER TABLE public.hiring_jobs 
ADD COLUMN approval_status text NOT NULL DEFAULT 'pending_review',
ADD COLUMN approved_at timestamptz;

-- Add check constraint for approval_status
ALTER TABLE public.hiring_jobs 
ADD CONSTRAINT hiring_jobs_approval_status_check 
CHECK (approval_status IN ('pending_review', 'approved', 'rejected'));
