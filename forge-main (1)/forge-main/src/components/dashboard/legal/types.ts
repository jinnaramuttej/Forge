export type DocumentStatus = 'Draft' | 'Awaiting Review' | 'Approved' | 'Rejected' | 'Complete';
export type ApprovalStep = 'draft' | 'review' | 'approval' | 'complete';

export interface LegalDocument {
  id: string;
  title: string;
  type: string;
  category: 'Commercial' | 'Employment' | 'Corporate' | 'Compliance';
  status: DocumentStatus;
  currentStep: ApprovalStep;
  counterparty: string;
  owner: string;
  lastUpdated: string;
  governingLaw: string;
  effectiveDate: string;
  summary: string;
  clauses: { title: string; content: string }[];
  riskRating: 'Clean' | 'Standard' | 'Attention Required';
}
