export type PipelineStage = 'new' | 'screening' | 'interview' | 'final' | 'offer';
export type CandidateStage = PipelineStage;

export interface Candidate {
  id: string;
  name: string;
  roleId: string;
  roleTitle: string;
  stage: PipelineStage;
  experience: string;
  skills: string[];
  matchScore: number;
  matchReason: string;
  lastActivity: string;
  rating: string;
  currentCompany: string;
  education: string;
  notes: string;
}

export interface Role {
  id: string;
  title: string;
  department: string;
  candidatesCount: number;
  currentStage: string;
  lastActivity: string;
  status: 'Active' | 'Interviewing' | 'Reviewing' | 'Sourcing';
  targetDate: string;
}
