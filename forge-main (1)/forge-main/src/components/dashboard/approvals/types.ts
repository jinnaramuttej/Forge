export type ApprovalDepartment = 'legal' | 'hiring' | 'marketing' | 'finance';

export type ApprovalStatus = 'ready' | 'approved' | 'rejected' | 'in_review';

export interface ApprovalItem {
  id: string;
  department: ApprovalDepartment;
  departmentLabel: string;
  action: string;
  title: string;
  shortDescription: string;
  timeAgo: string;
  status: ApprovalStatus;
  statusLabel: string;
  priority?: 'normal' | 'high';
  
  // Review experience details
  whatForgePrepared: {
    summary: string;
    highlights: string[];
    confidenceScore?: string;
    guardrailsChecked: string[];
  };
  
  previewContent: {
    type: 'document' | 'candidate_shortlist' | 'social_post' | 'financial_run';
    heading: string;
    body: string;
    structuredData?: { [key: string]: string | number | boolean };
    tags?: string[];
  };
  
  metadata: {
    label: string;
    value: string;
  }[];
}

export interface CompletedApproval {
  id: string;
  title: string;
  department: ApprovalDepartment;
  departmentLabel: string;
  decision: 'approved' | 'rejected';
  decidedAt: string;
  actor: string;
  notes?: string;
}
