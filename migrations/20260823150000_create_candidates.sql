-- Create candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role_id TEXT NOT NULL,
    role_title TEXT NOT NULL,
    stage TEXT NOT NULL,
    experience TEXT,
    skills JSONB,
    match_score INTEGER,
    match_reason TEXT,
    last_activity TEXT,
    rating TEXT,
    current_company TEXT,
    education TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to candidates" 
ON public.candidates FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access to candidates" 
ON public.candidates FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to candidates" 
ON public.candidates FOR UPDATE USING (true);

-- Seed initial mock candidates data
INSERT INTO public.candidates (id, name, role_id, role_title, stage, experience, skills, match_score, match_reason, last_activity, rating, current_company, education, notes)
VALUES 
(
    'cand-theo',
    'Theo Dumas',
    'role-fe',
    'Senior Frontend Engineer',
    'screening',
    '8 yrs exp',
    '["React", "TypeScript", "System Design", "Three.js"]',
    98,
    'Built collaborative canvas engine at Figma. Perfect alignment with Acme''s interaction requirements.',
    '45m ago',
    'Top Recommendation',
    'Linear Ecosystem',
    'B.S. CS, Stanford University',
    'Exceeds 90th percentile technical rubric. Highly recommended for founder loop.'
),
(
    'cand-aisha',
    'Aisha Khan',
    'role-fe',
    'Senior Frontend Engineer',
    'interview',
    '7 yrs exp',
    '["React", "Next.js", "Design Systems", "Architecture"]',
    96,
    'Lead architect for core web client performance at previous unicorn.',
    '2h ago',
    'Strong Fit',
    'Fintech Unicorn',
    'M.S. Software Engineering, CMU',
    'Final technical loop scheduled for Friday 3:00 PM.'
),
(
    'cand-marcus',
    'Marcus Chen',
    'role-fe',
    'Senior Frontend Engineer',
    'new',
    '5 yrs exp',
    '["React", "TypeScript", "Tailwind", "Next.js"]',
    91,
    'Strong open-source UI component author. High alignment with FORGE web client requirements.',
    '1h ago',
    'Strong Fit',
    'Vercel Ecosystem',
    'B.S. CS, UC Berkeley',
    'Excellently structured GitHub portfolio.'
),
(
    'cand-elena',
    'Elena Rostov',
    'role-growth',
    'Growth Lead',
    'final',
    '6 yrs exp',
    '["PLG Funnels", "SQL", "Lifecycle", "Experimentation"]',
    94,
    'Scaled B2B developer tool self-serve revenue from $500K to $6M ARR.',
    'Yesterday',
    'Top Recommendation',
    'DevOps Scaleup',
    'B.A. Economics, NYU',
    'Portfolio review completed with 4/4 unanimous team scorecards.'
)
ON CONFLICT (id) DO NOTHING;
