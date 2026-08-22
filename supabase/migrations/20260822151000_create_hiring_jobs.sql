-- Create hiring_jobs table
CREATE TABLE IF NOT EXISTS public.hiring_jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id text NOT NULL,
    role text NOT NULL,
    budget text NOT NULL,
    location text NOT NULL,
    work_mode text NOT NULL,
    market_data jsonb,
    jd_content text,
    screening_questions jsonb,
    error_message text,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT status_check CHECK (status IN ('pending', 'market_check', 'drafting', 'questions', 'done', 'error'))
);

-- Enable RLS
ALTER TABLE public.hiring_jobs ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for hackathon
CREATE POLICY "Permissive policy for all operations on hiring_jobs"
ON public.hiring_jobs
FOR ALL
USING (true)
WITH CHECK (true);
