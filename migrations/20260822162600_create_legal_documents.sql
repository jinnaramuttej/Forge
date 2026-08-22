-- Create legal_documents table
CREATE TABLE IF NOT EXISTS public.legal_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id text NOT NULL,
    document_type text NOT NULL,
    input_context jsonb NOT NULL,
    statutory_data jsonb,
    draft_content text,
    status text NOT NULL DEFAULT 'pending',
    error_message text,
    approval_status text NOT NULL DEFAULT 'pending_review',
    approved_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT legal_documents_status_check 
        CHECK (status IN ('pending', 'researching', 'drafting', 'done', 'error')),
    CONSTRAINT legal_documents_approval_status_check 
        CHECK (approval_status IN ('pending_review', 'approved', 'rejected'))
);

-- Enable RLS
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for hackathon
CREATE POLICY "Permissive policy for all operations on legal_documents"
ON public.legal_documents
FOR ALL
USING (true)
WITH CHECK (true);
