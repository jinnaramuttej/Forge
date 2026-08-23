import { DashboardNavId } from '../components/dashboard/types';
import { ApprovalItem, CompletedApproval, ApprovalDepartment } from '../components/dashboard/approvals/types';
import { Candidate, Role, CandidateStage } from '../components/dashboard/hiring/types';
import { LegalDocument, DocumentStatus } from '../components/dashboard/legal/types';
import { Campaign, ContentDraft, ContentStatus } from '../components/dashboard/marketing/types';
import { CalendarEvent } from '../components/dashboard/calendar/types';
import { ActivityEvent, ActivityDepartment } from '../components/dashboard/activity/types';
import { FounderProfile, StartupInfo } from '../components/dashboard/profile/types';

export interface FinanceData {
  cash: string;
  monthlyBurn: string;
  runway: string;
  monthlyRevenue: string;
  netBurn: string;
  runwayMonths: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  category: 'Legal' | 'Hiring' | 'Finance' | 'Marketing' | 'System';
  unread: boolean;
  targetNav?: DashboardNavId;
}

export interface ForgeState {
  founder: FounderProfile;
  startup: StartupInfo;
  finance: FinanceData;
  roles: Role[];
  candidates: Candidate[];
  legalDocuments: LegalDocument[];
  campaigns: Campaign[];
  contentDrafts: ContentDraft[];
  approvals: ApprovalItem[];
  completedApprovals: CompletedApproval[];
  calendarEvents: CalendarEvent[];
  activities: ActivityEvent[];
  notifications: NotificationItem[];
  toast: { message: string; type?: 'success' | 'info' | 'error' } | null;
}
