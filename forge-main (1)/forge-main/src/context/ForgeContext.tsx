import React, { createContext, useContext, useState, useEffect } from 'react';
import { DashboardNavId } from '../components/dashboard/types';
import { ApprovalItem, CompletedApproval } from '../components/dashboard/approvals/types';
import { Candidate, Role, CandidateStage } from '../components/dashboard/hiring/types';
import { LegalDocument, DocumentStatus } from '../components/dashboard/legal/types';
import { Campaign, ContentDraft, ContentStatus } from '../components/dashboard/marketing/types';
import { CalendarEvent } from '../components/dashboard/calendar/types';
import { ActivityEvent, ActivityDepartment } from '../components/dashboard/activity/types';
import { FounderProfile, StartupInfo } from '../components/dashboard/profile/types';
import { FinanceData, NotificationItem, ForgeState } from '../types/forge';

// Initial Centralized Data
const initialFounder: FounderProfile = {
  name: 'Sarah Lin',
  email: 'founder@acme.com',
  role: 'Founder & Chief Executive Officer',
  avatarInitials: 'SL',
  location: 'San Francisco, CA',
  bio: 'Building autonomous company operations. Former VP of Product Engineering with 10+ years in distributed systems.',
};

const initialStartup: StartupInfo = {
  name: 'Acme Inc.',
  industry: 'Enterprise Software & Autonomous Ops',
  stage: 'Seed Stage ($2.4M Raised)',
  website: 'https://acme.build',
  description:
    'Building the unified operating system for high-velocity tech companies. Orchestrating finance, hiring loops, legal compliance, and launch campaigns into a single synchronized graph.',
  foundedYear: '2026',
  headquarters: 'San Francisco, CA',
  entityType: 'Delaware C-Corporation',
};

const initialFinance: FinanceData = {
  cash: '$284.5K',
  monthlyBurn: '$19.2K',
  runway: '14.8 months',
  monthlyRevenue: '$42.8K',
  netBurn: '$34.2K / mo',
  runwayMonths: 14.8,
};

const initialRoles: Role[] = [
  {
    id: 'role-fe',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    candidatesCount: 11,
    currentStage: 'Final loops (2 candidates)',
    lastActivity: '45m ago',
    status: 'Interviewing',
    targetDate: 'Nov 15, 2026',
  },
  {
    id: 'role-des',
    title: 'Product Designer',
    department: 'Design',
    candidatesCount: 8,
    currentStage: 'Design portfolio review',
    lastActivity: '2h ago',
    status: 'Interviewing',
    targetDate: 'Dec 01, 2026',
  },
  {
    id: 'role-growth',
    title: 'Growth Lead',
    department: 'Growth',
    candidatesCount: 5,
    currentStage: 'Offer stage (1 candidate)',
    lastActivity: 'Yesterday',
    status: 'Reviewing',
    targetDate: 'Nov 20, 2026',
  },
  {
    id: 'role-be',
    title: 'Backend Engineer',
    department: 'Engineering',
    candidatesCount: 4,
    currentStage: 'Initial technical screens',
    lastActivity: 'Oct 20',
    status: 'Active',
    targetDate: 'Dec 15, 2026',
  },
];

const initialCandidates: Candidate[] = [
  {
    id: 'cand-theo',
    name: 'Theo Dumas',
    roleId: 'role-fe',
    roleTitle: 'Senior Frontend Engineer',
    stage: 'screening',
    experience: '6 yrs exp',
    skills: ['React', 'TypeScript', 'Tailwind', 'WebGL', 'Performance'],
    matchScore: 98,
    matchReason: 'Staff UI engineer at Linear alum. Exceptional component craftsmanship and browser rendering optimization.',
    lastActivity: '45m ago',
    rating: 'Top Recommendation',
    currentCompany: 'Linear Ecosystem',
    education: 'B.S. CS, Stanford University',
    notes: 'Exceeds 90th percentile technical rubric. Highly recommended for founder loop.',
  },
  {
    id: 'cand-aisha',
    name: 'Aisha Khan',
    roleId: 'role-fe',
    roleTitle: 'Senior Frontend Engineer',
    stage: 'interview',
    experience: '7 yrs exp',
    skills: ['React', 'Next.js', 'Design Systems', 'Architecture'],
    matchScore: 96,
    matchReason: 'Lead architect for core web client performance at previous unicorn.',
    lastActivity: '2h ago',
    rating: 'Strong Fit',
    currentCompany: 'Fintech Unicorn',
    education: 'M.S. Software Engineering, CMU',
    notes: 'Final technical loop scheduled for Friday 3:00 PM.',
  },
  {
    id: 'cand-marcus',
    name: 'Marcus Chen',
    roleId: 'role-fe',
    roleTitle: 'Senior Frontend Engineer',
    stage: 'new',
    experience: '5 yrs exp',
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    matchScore: 91,
    matchReason: 'Strong open-source UI component author. High alignment with FORGE web client requirements.',
    lastActivity: '1h ago',
    rating: 'Strong Fit',
    currentCompany: 'Vercel Ecosystem',
    education: 'B.S. CS, UC Berkeley',
    notes: 'Excellently structured GitHub portfolio.',
  },
  {
    id: 'cand-elena',
    name: 'Elena Rostov',
    roleId: 'role-growth',
    roleTitle: 'Growth Lead',
    stage: 'final',
    experience: '6 yrs exp',
    skills: ['PLG Funnels', 'SQL', 'Lifecycle', 'Experimentation'],
    matchScore: 94,
    matchReason: 'Scaled B2B developer tool self-serve revenue from $500K to $6M ARR.',
    lastActivity: 'Yesterday',
    rating: 'Top Recommendation',
    currentCompany: 'DevOps Scaleup',
    education: 'B.A. Economics, NYU',
    notes: 'Portfolio review completed with 4/4 unanimous team scorecards.',
  },
];

const initialLegalDocuments: LegalDocument[] = [
  {
    id: 'doc-nda-monochrome',
    title: 'Mutual Non-Disclosure Agreement (Contract Designer)',
    type: 'Non-Disclosure Agreement',
    category: 'Commercial',
    status: 'Awaiting Review',
    currentStep: 'approval',
    counterparty: 'Studio Monochrome LLC',
    owner: 'Sarah Lin',
    lastUpdated: '12m ago',
    governingLaw: 'Delaware, USA',
    effectiveDate: 'Oct 24, 2026',
    summary: 'Standard Delaware bilateral confidentiality protection prepared for Studio Monochrome contract designer. Includes 24-month term and 100% IP assignment.',
    clauses: [
      {
        title: 'Definition of Confidential Information',
        content: 'All proprietary software architectures, design systems, and product roadmaps disclosed by Acme Inc.',
      },
      {
        title: 'Intellectual Property Assignment',
        content: 'All deliverables created under this engagement constitute work-for-hire and belong 100% to Acme Inc.',
      },
      {
        title: 'Term & Survival',
        content: 'Confidentiality obligations survive for a duration of two (2) years from execution date.',
      },
    ],
    riskRating: 'Clean',
  },
  {
    id: 'doc-nda-foundry',
    title: 'Series Seed Mutual NDA · Foundry Group LP',
    type: 'Non-Disclosure Agreement',
    category: 'Corporate',
    status: 'Approved',
    currentStep: 'complete',
    counterparty: 'Foundry Group LP',
    owner: 'Sarah Lin',
    lastUpdated: '2h ago',
    governingLaw: 'Delaware, USA',
    effectiveDate: 'Oct 24, 2026',
    summary: 'Mutual confidentiality agreement executed for Series Seed data room access.',
    clauses: [
      {
        title: 'Diligence Data Room Protection',
        content: 'Standard Delaware investor mutual protection excluding portfolio conflicts.',
      },
    ],
    riskRating: 'Clean',
  },
  {
    id: 'doc-contractor-design',
    title: 'Design Systems Lead Contractor Agreement (MSA)',
    type: 'Contractor Agreement',
    category: 'Employment',
    status: 'Awaiting Review',
    currentStep: 'review',
    counterparty: 'Studio Monochrome LLC',
    owner: 'Sarah Lin',
    lastUpdated: '1h ago',
    governingLaw: 'Delaware, USA',
    effectiveDate: 'Nov 01, 2026',
    summary: 'Master services agreement and statement of work covering Q4 design token refactor sprint.',
    clauses: [
      {
        title: 'Scope of Work & Deliverables',
        content: 'Delivery of core design token libraries, icon assets, and accessibility compliance specifications.',
      },
      {
        title: 'Invoicing & Compensation',
        content: 'Fixed monthly retainer of $4,200 billed Net 15 upon milestone acceptance.',
      },
    ],
    riskRating: 'Clean',
  },
];

const initialCampaigns: Campaign[] = [
  {
    id: 'camp-launch',
    title: 'Product Launch v1.2',
    objective: 'Position FORGE as the unified operating system for early-stage founders.',
    audience: 'Technical Founders & Seed Stage Leads',
    status: 'Active',
    scheduledDate: 'Oct 28, 2026',
    lastActivity: '30m ago',
    contentCount: 4,
    approvedCount: 3,
    nextScheduledItem: 'Press Wire Embargo Lift · Oct 28, 9:00 AM',
    summary: 'Cross-channel announcement highlighting unified operations across finance, hiring, and legal workflows.',
  },
  {
    id: 'camp-founder-update',
    title: 'Monthly Founder Letter (Q4)',
    objective: 'Share transparent startup milestones, runway extension and product roadmap.',
    audience: 'Investors, Advisors & Early Beta Users',
    status: 'Active',
    scheduledDate: 'Nov 01, 2026',
    lastActivity: '2h ago',
    contentCount: 3,
    approvedCount: 1,
    nextScheduledItem: 'Substack & Email Dispatch · Nov 01, 8:00 AM',
    summary: 'Executive overview covering seed capital efficiency, 14.8 mo runway, and core team additions.',
  },
];

const initialContentDrafts: ContentDraft[] = [
  {
    id: 'draft-linkedin',
    campaignId: 'camp-launch',
    title: 'Product Launch — LinkedIn announcement',
    channel: 'LinkedIn',
    status: 'Ready for Review',
    author: 'FORGE Growth Agent',
    lastUpdated: '2h ago',
    scheduledFor: 'Oct 28, 9:00 AM',
    excerpt: 'Most founders don\'t fail because of product. They fail because operations crush them.',
    fullBody: 'Most founders don\'t fail because of product. They fail because operations crush them.\n\nToday we\'re unveiling FORGE OS v1.2: The Autonomous Operating System for High-Velocity Companies.\n\nExplore the preview: forge.build/launch',
    keyPoints: [
      'Reflects FORGE restrained editorial tone',
      'Highlights early traction benchmark: 18 hrs/wk saved',
      'Founder sign-off verified',
    ],
  },
  {
    id: 'draft-substack',
    campaignId: 'camp-launch',
    title: 'Building the Autonomous Startup: Deep Dive',
    channel: 'Press & Blog',
    status: 'Draft',
    author: 'Sarah Lin',
    lastUpdated: '1d ago',
    scheduledFor: 'Oct 29, 10:00 AM',
    excerpt: 'Deep dive into distributed state, deterministic execution, and corporate governance.',
    fullBody: 'Deep dive into distributed state, deterministic execution, and how autonomous agents safely orchestrate corporate governance.',
    keyPoints: [
      'Architectural breakdown of state machines',
      'Deterministic execution vs prompt chaos',
    ],
  },
];

const initialApprovals: ApprovalItem[] = [
  {
    id: 'app-legal-nda',
    department: 'legal',
    departmentLabel: 'Legal',
    action: 'NDA for New Designer',
    title: 'Mutual Non-Disclosure Agreement · Studio Monochrome',
    shortDescription:
      'Standard Delaware bilateral confidentiality agreement drafted for contract design systems lead. Includes strict work-for-hire IP assignment and 24-month confidentiality clause.',
    timeAgo: '12m ago',
    status: 'ready',
    statusLabel: 'Ready for review',
    priority: 'high',
    whatForgePrepared: {
      summary:
        'FORGE Legal Agent compiled the standard mutual NDA using Delaware corporate bylaws. Counterparty identity verified via secretary of state records.',
      highlights: [
        'Automatic trade secret protection across software architectures and roadmap assets.',
        'Explicit 100% intellectual property assignment to Acme Inc.',
        'Clean Delaware jurisdiction with standard 24-month term.',
      ],
      confidenceScore: '99.4%',
      guardrailsChecked: [
        'Delaware corporate code compliance verified',
        '0 deviation from board-approved legal template',
        'Counterparty entity validation passed',
      ],
    },
    previewContent: {
      type: 'document',
      heading: 'Contract Clauses Preview (Bilateral Mutual NDA)',
      body: `1. CONFIDENTIAL INFORMATION & PURPOSE
"Confidential Information" encompasses all technical designs, Figma token schemas, backend interfaces, and business strategies disclosed by Acme Inc. to Studio Monochrome LLC solely for evaluating and executing the design systems contract.

2. OBLIGATIONS OF NON-DISCLOSURE
The Receiving Party shall exercise reasonable standard of care to protect Confidential Information and shall not disclose such information to any third party without prior written authorization from Sarah Lin (CEO).

3. INTELLECTUAL PROPERTY ASSIGNMENT
All deliverables developed during the engagement shall remain the sole property of Acme Inc. under work-for-hire doctrine.`,
      tags: ['Delaware Law', 'Work-for-Hire', '24M Term', 'Bilateral'],
    },
    metadata: [
      { label: 'Counterparty', value: 'Studio Monochrome LLC' },
      { label: 'Document Type', value: 'Mutual NDA' },
      { label: 'Governing Law', value: 'Delaware' },
      { label: 'Risk Rating', value: 'Clean · 0 Deviations' },
    ],
  },
  {
    id: 'app-hiring-shortlist',
    department: 'hiring',
    departmentLabel: 'Hiring',
    action: 'Candidate shortlist',
    title: 'Senior Frontend Engineer — Candidate shortlist',
    shortDescription:
      'Autonomous pipeline filtered 42 applicants down to top scored candidates. Top recommendation: Theo Dumas (Staff UI Engineer, Linear alum with deep WebGL craft).',
    timeAgo: '45m ago',
    status: 'ready',
    statusLabel: 'Ready for review',
    priority: 'high',
    whatForgePrepared: {
      summary:
        'FORGE Talent Agent parsed 42 inbound profiles, conducted automated code sample audits, and matched candidate skills against FORGE web performance criteria.',
      highlights: [
        'Candidate #1 (Theo Dumas): 98/100 UI craftsmanship score, built production design systems at scale.',
        'Candidate #2 (Elena Rostova): 94/100 systems architecture score.',
      ],
      confidenceScore: '96.8%',
      guardrailsChecked: [
        'Headcount budget verified ($160k – $180k Base within seed band)',
        'Reference check automation scheduled',
      ],
    },
    previewContent: {
      type: 'candidate_shortlist',
      heading: 'Candidate Evaluation Brief (Top Recommendation: Theo Dumas)',
      body: `RECOMMENDED CANDIDATE: Theo Dumas
Target Role: Senior Frontend Engineer / Staff UI
Location: San Francisco, CA
Compensation Band: $170,000 Base + 0.85% Equity (Matches approved hiring budget)

TECHNICAL SYNTHESIS & SIGNALS:
• 6+ years specializing in high-fidelity interactive web applications and micro-interactions.
• Lead contributor to open-source UI component libraries with 12k+ GitHub stars.

NEXT STEP UPON FOUNDER APPROVAL:
Dispatch automated personalized calendar invitation to Theo Dumas for Round 1.`,
      tags: ['Staff Level', '98/100 Score', 'In-Budget', 'Ready for Loop'],
    },
    metadata: [
      { label: 'Role', value: 'Senior Frontend Engineer' },
      { label: 'Top Candidate', value: 'Theo Dumas' },
      { label: 'Target Comp', value: '$170K Base + 0.85% Eq' },
    ],
  },
  {
    id: 'app-marketing-launch',
    department: 'marketing',
    departmentLabel: 'Marketing',
    action: 'LinkedIn announcement',
    title: 'Product Launch — LinkedIn announcement',
    shortDescription:
      'Editorial release brief and founder announcement copy for FORGE OS v1.2. Features design-partner traction metrics and core philosophy.',
    timeAgo: '2h ago',
    status: 'ready',
    statusLabel: 'Ready for review',
    priority: 'normal',
    whatForgePrepared: {
      summary:
        'FORGE Marketing Agent synthesized internal release notes and milestone logs into a crisp thought leadership post.',
      highlights: [
        'Reflects FORGE restrained, editorial tone.',
        'Incorporates early founder benchmark: "Saved 18 hours/week across seed operations".',
      ],
      confidenceScore: '97.2%',
      guardrailsChecked: ['Legal compliance for public claims verified', 'Brand voice consistency: 9.8/10'],
    },
    previewContent: {
      type: 'social_post',
      heading: 'Draft Copy: Founder LinkedIn Announcement',
      body: `Most founders don't fail because of product. They fail because operations crush them.

Finance, hiring pipelines, legal contracts, regulatory filings — every hour spent juggling fragmented dashboards is an hour taken away from building what matters.

Today we're unveiling FORGE OS v1.2: The Autonomous Operating System for High-Velocity Companies.

Explore the preview: forge.build/launch`,
      tags: ['LinkedIn', 'v1.2 Release', 'Founder Voice'],
    },
    metadata: [
      { label: 'Channel', value: 'LinkedIn (Sarah Lin Profile)' },
      { label: 'Audience', value: 'Tech Founders & Investors' },
      { label: 'Format', value: 'Editorial Post' },
    ],
  },
];

const initialCompletedApprovals: CompletedApproval[] = [
  {
    id: 'comp-1',
    title: 'NDA approved · Foundry Group LP',
    department: 'legal',
    departmentLabel: 'Legal',
    decision: 'approved',
    decidedAt: '2h ago',
    actor: 'Sarah Lin (Founder)',
    notes: 'Approved standard mutual NDA for Series Seed data room access.',
  },
  {
    id: 'comp-2',
    title: 'Candidate shortlist approved · Staff Frontend Engineer',
    department: 'hiring',
    departmentLabel: 'Hiring',
    decision: 'approved',
    decidedAt: 'Yesterday',
    actor: 'Sarah Lin (Founder)',
    notes: 'Advanced Aisha Khan to final partner interview loop.',
  },
  {
    id: 'comp-3',
    title: 'Campaign draft approved · Product Hunt v1.0 Launch',
    department: 'marketing',
    departmentLabel: 'Marketing',
    decision: 'approved',
    decidedAt: 'Oct 22',
    actor: 'Sarah Lin (Founder)',
    notes: 'Visual collateral and launch copy staged for public release.',
  },
];

const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Candidate Interview · Theo Dumas',
    department: 'hiring',
    departmentLabel: 'Hiring',
    date: 'Fri, Oct 24, 2026',
    dayOfMonth: 24,
    time: '03:00 PM – 03:45 PM',
    status: 'confirmed',
    statusLabel: 'Confirmed',
    description: 'Round 1 technical deep dive and UI craftsmanship architecture review with Founder.',
    attendees: ['Sarah Lin (Founder)', 'Theo Dumas (Candidate)'],
    location: 'Google Meet',
    isUrgent: true,
  },
  {
    id: 'ev-2',
    title: 'NDA Review Deadline · Foundry Group',
    department: 'legal',
    departmentLabel: 'Legal',
    date: 'Mon, Oct 27, 2026',
    dayOfMonth: 27,
    time: '11:00 AM EST',
    status: 'deadline',
    statusLabel: 'Sign-off Deadline',
    description: 'Mutual confidentiality execution window for Series Seed data room access.',
    attendees: ['Sarah Lin', 'Foundry Group General Counsel'],
    location: 'FORGE Approvals Workspace',
  },
  {
    id: 'ev-3',
    title: 'Product Launch · FORGE OS v1.2 GA',
    department: 'marketing',
    departmentLabel: 'Marketing',
    date: 'Tue, Oct 28, 2026',
    dayOfMonth: 28,
    time: '09:00 AM EST',
    status: 'upcoming',
    statusLabel: 'Milestone',
    description: 'Simultaneous public launch across Product Hunt, Tech Press Wires, and Founder LinkedIn.',
    attendees: ['Sarah Lin', 'Design Partners Beta Cohort'],
    location: 'Public Release',
  },
  {
    id: 'ev-4',
    title: 'Monthly Finance & Payroll Review',
    department: 'finance',
    departmentLabel: 'Finance',
    date: 'Thu, Oct 30, 2026',
    dayOfMonth: 30,
    time: '04:00 PM – 04:30 PM',
    status: 'upcoming',
    statusLabel: 'Executive Run',
    description: 'Review reconciled bank feeds, monthly burn rate ($34.2K), and direct contractor disbursements.',
    attendees: ['Sarah Lin', 'Silicon Valley Bank Automated Feed'],
    location: 'Finance Dashboard',
  },
];

const initialActivities: ActivityEvent[] = [
  {
    id: 'act-1',
    time: '10:42',
    dateGroup: 'Today',
    department: 'legal',
    departmentLabel: 'Legal',
    action: 'NDA drafted',
    shortDescription: 'Standard bilateral non-disclosure agreement generated for Studio Monochrome contract designer.',
    actor: 'FORGE Legal Guard',
  },
  {
    id: 'act-2',
    time: '09:30',
    dateGroup: 'Today',
    department: 'hiring',
    departmentLabel: 'Hiring',
    action: 'Candidate shortlisted',
    shortDescription: 'Theo Dumas advanced to Technical Deep Dive for Staff Frontend Engineer (42 screened).',
    actor: 'FORGE Talent Engine',
  },
  {
    id: 'act-3',
    time: '08:55',
    dateGroup: 'Today',
    department: 'finance',
    departmentLabel: 'Finance',
    action: 'Financial snapshot updated',
    shortDescription: 'Bank feeds reconciled. Net cash burn calibrated at $34.2K/mo with 14.8 months runway.',
    actor: 'FORGE Finance Ledger',
  },
  {
    id: 'act-4',
    time: '16:15',
    dateGroup: 'Yesterday',
    department: 'marketing',
    departmentLabel: 'Marketing',
    action: 'Campaign prepared',
    shortDescription: 'Product Hunt launch checklist, high-res typography collateral & copy staged.',
    actor: 'FORGE Growth Agent',
  },
  {
    id: 'act-5',
    time: '14:00',
    dateGroup: 'Yesterday',
    department: 'legal',
    departmentLabel: 'Legal',
    action: 'Agreement approved',
    shortDescription: 'Series Seed Mutual NDA with Foundry Group LP signed and archived to corporate vault.',
    actor: 'Sarah Lin (Founder)',
  },
  {
    id: 'act-6',
    time: '11:20',
    dateGroup: 'Yesterday',
    department: 'hiring',
    departmentLabel: 'Hiring',
    action: 'Interview scheduled',
    shortDescription: 'Aisha Khan accepted invitation for Friday 3:00 PM architecture review.',
    actor: 'FORGE Talent Engine',
  },
];

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Foundry Group signed NDA · Data room ready',
    time: '12m ago',
    category: 'Legal',
    unread: true,
    targetNav: 'approvals',
  },
  {
    id: 'notif-2',
    title: 'Aisha Khan accepted interview loop for Fri 3 PM',
    time: '1h ago',
    category: 'Hiring',
    unread: true,
    targetNav: 'calendar',
  },
  {
    id: 'notif-3',
    title: 'Monthly payroll run preview ready for Oct 28',
    time: '3h ago',
    category: 'Finance',
    unread: false,
    targetNav: 'finance',
  },
];

export interface ForgeContextType extends ForgeState {
  // Action dispatches
  approveItem: (itemId: string, note?: string) => void;
  rejectItem: (itemId: string, reason: string) => void;
  updateCandidateStage: (candidateId: string, newStage: CandidateStage) => void;
  addCandidate: (candidate: Omit<Candidate, 'id'>) => void;
  addRole: (role: Omit<Role, 'id'>) => void;
  updateFinanceSnapshot: (data: Partial<FinanceData>) => void;
  addLegalDocument: (doc: Omit<LegalDocument, 'id'>) => void;
  signLegalDocument: (docId: string) => void;
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateContentDraftStatus: (draftId: string, status: ContentStatus) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  toggleCalendarEvent: (id: string) => void;
  deleteCalendarEvent: (id: string) => void;
  updateFounder: (founder: Partial<FounderProfile>) => void;
  updateStartup: (startup: Partial<StartupInfo>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addActivity: (department: ActivityDepartment, action: string, description: string, actor?: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const ForgeContext = createContext<ForgeContextType | null>(null);

export const ForgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [founder, setFounder] = useState<FounderProfile>(initialFounder);
  const [startup, setStartup] = useState<StartupInfo>(initialStartup);
  const [finance, setFinance] = useState<FinanceData>(initialFinance);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [legalDocuments, setLegalDocuments] = useState<LegalDocument[]>(initialLegalDocuments);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [contentDrafts, setContentDrafts] = useState<ContentDraft[]>(initialContentDrafts);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [completedApprovals, setCompletedApprovals] = useState<CompletedApproval[]>(initialCompletedApprovals);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [activities, setActivities] = useState<ActivityEvent[]>(initialActivities);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const addActivity = (department: ActivityDepartment, action: string, description: string, actor: string = 'Sarah Lin (Founder)') => {
    const departmentLabels: Record<ActivityDepartment, string> = {
      legal: 'Legal',
      hiring: 'Hiring',
      finance: 'Finance',
      marketing: 'Marketing',
    };

    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      dateGroup: 'Today',
      department,
      departmentLabel: departmentLabels[department],
      action,
      shortDescription: description,
      actor,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // 1. APPROVAL WORKFLOW
  const approveItem = (itemId: string, note?: string) => {
    const item = approvals.find((a) => a.id === itemId);
    if (!item) return;

    // Remove from pending
    setApprovals((prev) => prev.filter((a) => a.id !== itemId));

    // Add to completed approvals
    const newCompleted: CompletedApproval = {
      id: `comp-${Date.now()}`,
      title: `${item.action} approved · ${item.title}`,
      department: item.department,
      departmentLabel: item.departmentLabel,
      decision: 'approved',
      decidedAt: 'Just now',
      actor: `${founder.name} (Founder)`,
      notes: note || 'Approved with founder sign-off.',
    };
    setCompletedApprovals((prev) => [newCompleted, ...prev]);

    // Cross-system synchronization:
    // If Legal item: update document status to Approved/Executed
    if (item.department === 'legal') {
      setLegalDocuments((prev) =>
        prev.map((doc) =>
          doc.id === 'doc-nda-monochrome' || doc.title.toLowerCase().includes('designer')
            ? { ...doc, status: 'Approved', currentStep: 'complete' }
            : doc
        )
      );
      addActivity('legal', 'NDA approved', `${item.title} signed and approved by ${founder.name}.`);
    } else if (item.department === 'hiring') {
      // If Hiring item: advance candidate to Offer
      setCandidates((prev) =>
        prev.map((cand) =>
          cand.id === 'cand-theo' || cand.name.toLowerCase().includes('theo')
            ? { ...cand, stage: 'offer', lastActivity: 'Just now' }
            : cand
        )
      );
      addActivity('hiring', 'Candidate shortlist approved', `Theo Dumas advanced to Offer stage for Senior Frontend Engineer.`);
    } else if (item.department === 'marketing') {
      // If Marketing item: update content draft status to Scheduled
      setContentDrafts((prev) =>
        prev.map((draft) =>
          draft.id === 'draft-linkedin' || draft.title.toLowerCase().includes('linkedin')
            ? { ...draft, status: 'Scheduled' }
            : draft
        )
      );
      addActivity('marketing', 'Launch copy approved', `Product Launch LinkedIn announcement approved and staged for embargo.`);
    } else {
      addActivity('finance', 'Action approved', `${item.title} approved by ${founder.name}.`);
    }

    // Add new notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `${item.action} executed · ${item.title}`,
      time: 'Just now',
      category: item.departmentLabel as any,
      unread: true,
      targetNav: 'activity',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Approved: ${item.action}`);
  };

  const rejectItem = (itemId: string, reason: string) => {
    const item = approvals.find((a) => a.id === itemId);
    if (!item) return;

    setApprovals((prev) => prev.filter((a) => a.id !== itemId));

    const newCompleted: CompletedApproval = {
      id: `comp-${Date.now()}`,
      title: `${item.action} rejected · ${item.title}`,
      department: item.department,
      departmentLabel: item.departmentLabel,
      decision: 'rejected',
      decidedAt: 'Just now',
      actor: `${founder.name} (Founder)`,
      notes: reason,
    };
    setCompletedApprovals((prev) => [newCompleted, ...prev]);

    addActivity(
      item.department,
      `${item.action} rejected`,
      `Rejection notes logged: "${reason}". Agent instructed to re-draft.`
    );

    showToast(`Rejected: ${item.action} (Instructions sent to agent)`, 'info');
  };

  // 2. HIRING WORKFLOW
  const updateCandidateStage = (candidateId: string, newStage: CandidateStage) => {
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? { ...c, stage: newStage, lastActivity: 'Just now' }
          : c
      )
    );

    const stageNames: Record<CandidateStage, string> = {
      new: 'New Inbound',
      screening: 'Technical Screening',
      interview: 'Interview Loop',
      final: 'Final Deep Dive',
      offer: 'Offer Staged',
    };

    addActivity(
      'hiring',
      `Candidate moved to ${stageNames[newStage]}`,
      `${cand.name} advanced to ${stageNames[newStage]} for ${cand.roleTitle}.`
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `${cand.name} moved to ${stageNames[newStage]}`,
      time: 'Just now',
      category: 'Hiring',
      unread: true,
      targetNav: 'hiring',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`${cand.name} moved to ${stageNames[newStage]}`);
  };

  const addCandidate = (candidateData: Omit<Candidate, 'id'>) => {
    const newCand: Candidate = {
      ...candidateData,
      id: `cand-${Date.now()}`,
    };
    setCandidates((prev) => [newCand, ...prev]);
    addActivity('hiring', 'Candidate sourced', `${newCand.name} added to ${newCand.roleTitle} pipeline.`);
    showToast(`Candidate added: ${newCand.name}`);
  };

  const addRole = (roleData: Omit<Role, 'id'>) => {
    const newRole: Role = {
      ...roleData,
      id: `role-${Date.now()}`,
    };
    setRoles((prev) => [newRole, ...prev]);
    addActivity('hiring', 'Open role created', `${newRole.title} opened in ${newRole.department}.`);
    showToast(`New role opened: ${newRole.title}`);
  };

  // 3. FINANCE WORKFLOW
  const updateFinanceSnapshot = (data: Partial<FinanceData>) => {
    setFinance((prev) => ({ ...prev, ...data }));
    addActivity(
      'finance',
      'Financial snapshot updated',
      `Runway calibrated at ${data.runway || finance.runway}, monthly burn ${data.monthlyBurn || finance.monthlyBurn}.`
    );
    showToast('Financial snapshot updated.');
  };

  // 4. LEGAL WORKFLOW
  const addLegalDocument = (docData: Omit<LegalDocument, 'id'>) => {
    const newDoc: LegalDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
    };
    setLegalDocuments((prev) => [newDoc, ...prev]);
    addActivity('legal', 'Legal document drafted', `${newDoc.title} prepared for ${newDoc.counterparty}.`);
    showToast(`Document created: ${newDoc.title}`);
  };

  const signLegalDocument = (docId: string) => {
    setLegalDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, status: 'Approved', currentStep: 'complete' } : doc
      )
    );
    const doc = legalDocuments.find((d) => d.id === docId);
    if (doc) {
      addActivity('legal', 'Agreement signed', `${doc.title} signed by ${founder.name}.`);
      showToast(`Signed: ${doc.title}`);
    }
  };

  // 5. MARKETING WORKFLOW
  const addCampaign = (campaignData: Omit<Campaign, 'id'>) => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    addActivity('marketing', 'Campaign created', `${newCamp.title} staged for ${newCamp.scheduledDate}.`);
    showToast(`Campaign created: ${newCamp.title}`);
  };

  const updateContentDraftStatus = (draftId: string, status: ContentStatus) => {
    setContentDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, status } : d))
    );
    const draft = contentDrafts.find((d) => d.id === draftId);
    if (draft) {
      addActivity('marketing', `Content draft ${status.toLowerCase()}`, `"${draft.title}" marked as ${status}.`);
      showToast(`Draft marked as ${status}`);
    }
  };

  // 6. CALENDAR WORKFLOW
  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEv: CalendarEvent = {
      ...eventData,
      id: `ev-${Date.now()}`,
    };
    setCalendarEvents((prev) => [...prev, newEv]);
    addActivity(newEv.department, 'Event scheduled', `${newEv.title} scheduled for ${newEv.date}.`);
    showToast(`Scheduled: ${newEv.title}`);
  };

  const toggleCalendarEvent = (id: string) => {
    setCalendarEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: e.status === 'completed' ? 'upcoming' : 'completed',
              statusLabel: e.status === 'completed' ? 'Upcoming' : 'Completed',
            }
          : e
      )
    );
    const ev = calendarEvents.find((e) => e.id === id);
    if (ev) {
      showToast(`Event updated: ${ev.title}`);
    }
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
    showToast('Event removed from schedule.');
  };

  // 7. PROFILE & STARTUP
  const updateFounder = (data: Partial<FounderProfile>) => {
    setFounder((prev) => ({ ...prev, ...data }));
    showToast('Founder profile updated.');
  };

  const updateStartup = (data: Partial<StartupInfo>) => {
    setStartup((prev) => ({ ...prev, ...data }));
    showToast('Startup information updated.');
  };

  // 8. NOTIFICATIONS
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read.');
  };

  const contextValue: ForgeContextType = {
    founder,
    startup,
    finance,
    roles,
    candidates,
    legalDocuments,
    campaigns,
    contentDrafts,
    approvals,
    completedApprovals,
    calendarEvents,
    activities,
    notifications,
    toast,
    approveItem,
    rejectItem,
    updateCandidateStage,
    addCandidate,
    addRole,
    updateFinanceSnapshot,
    addLegalDocument,
    signLegalDocument,
    addCampaign,
    updateContentDraftStatus,
    addCalendarEvent,
    toggleCalendarEvent,
    deleteCalendarEvent,
    updateFounder,
    updateStartup,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addActivity,
    showToast,
  };

  return <ForgeContext.Provider value={contextValue}>{children}</ForgeContext.Provider>;
};

export const useForge = (): ForgeContextType => {
  const context = useContext(ForgeContext);
  if (!context) {
    throw new Error('useForge must be used within a ForgeProvider');
  }
  return context;
};
