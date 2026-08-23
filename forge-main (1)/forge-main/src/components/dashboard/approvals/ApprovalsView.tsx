import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import ApprovalWorkflowBar from './ApprovalWorkflowBar';
import ApprovalQueue from './ApprovalQueue';
import ApprovalReviewPanel from './ApprovalReviewPanel';
import ApprovalActivity from './ApprovalActivity';
import { ApprovalItem, CompletedApproval } from './types';

const initialApprovalItems: ApprovalItem[] = [
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
        'FORGE Legal Agent compiled the standard mutual NDA using Delaware corporate bylaws. Counterparty identity verified via secretary of state records. All non-solicitation parameters calibrated to early-stage contractor standards.',
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
All deliverables, including typography tokens, layout specifications, and icon systems developed during the engagement shall remain the sole and exclusive property of Acme Inc. under work-for-hire doctrine.

4. GOVERNING LAW & TERM
This Agreement is governed by the laws of the State of Delaware. Obligations survive for a duration of twenty-four (24) months from execution date.`,
      tags: ['Delaware Law', 'Work-for-Hire', '24M Term', 'Bilateral'],
    },
    metadata: [
      { label: 'Counterparty', value: 'Studio Monochrome LLC' },
      { label: 'Document Type', value: 'Mutual NDA' },
      { label: 'Governing Law', value: 'Delaware' },
      { label: 'Risk Rating', value: 'Clean · 0 Deviations' },
      { label: 'Staged By', value: 'FORGE Legal Guard' },
      { label: 'Effective Date', value: 'Immediate upon sign-off' },
    ],
  },
  {
    id: 'app-hiring-shortlist',
    department: 'hiring',
    departmentLabel: 'Hiring',
    action: 'Candidate shortlist',
    title: 'Senior Frontend Engineer — Candidate shortlist',
    shortDescription:
      'Autonomous pipeline filtered 42 applicants down to top 3 scored candidates. Top recommendation: Theo Dumas (Staff UI Engineer, ex-Linear alum with deep WebGL craft).',
    timeAgo: '45m ago',
    status: 'ready',
    statusLabel: 'Ready for review',
    priority: 'high',
    whatForgePrepared: {
      summary:
        'FORGE Talent Agent parsed 42 inbound profiles, conducted automated code sample audits, and matched candidate skills against FORGE web performance criteria. 3 candidates exceed the 90th percentile technical benchmark.',
      highlights: [
        'Candidate #1 (Theo Dumas): 98/100 UI craftsmanship score, built production design systems at scale.',
        'Candidate #2 (Elena Rostova): 94/100 systems architecture score, extensive React & Tailwind experience.',
        'Candidate #3 (Marcus Chen): 91/100 frontend infra score, strong web performance optimization background.',
      ],
      confidenceScore: '96.8%',
      guardrailsChecked: [
        'Headcount budget verified ($160k – $180k Base within seed band)',
        'Reference check automation scheduled',
        'Standard technical loop rubric generated',
      ],
    },
    previewContent: {
      type: 'candidate_shortlist',
      heading: 'Candidate Evaluation Brief (Top Recommendation: Theo Dumas)',
      body: `RECOMMENDED CANDIDATE: Theo Dumas
Target Role: Senior Frontend Engineer / Staff UI
Location: San Francisco, CA (or Remote US)
Compensation Band: $170,000 Base + 0.85% Equity (Matches approved hiring budget)

TECHNICAL SYNTHESIS & SIGNALS:
• 6+ years specializing in high-fidelity interactive web applications and micro-interactions.
• Lead contributor to open-source UI component libraries with 12k+ GitHub stars.
• Deep understanding of browser rendering pipelines, zero-layout-shift design, and typography.

INTERVIEW LOOP STAGING:
Round 1: 45 min Architecture & Design Craft Deep Dive (w/ Sarah Lin)
Round 2: 60 min Live Systems Pair Programming
Round 3: Founder Alignment & Values Discussion

NEXT STEP UPON FOUNDER APPROVAL:
Dispatch automated personalized calendar invitation to Theo Dumas for Round 1.`,
      tags: ['Staff Level', '98/100 Score', 'In-Budget', 'Ready for Loop'],
    },
    metadata: [
      { label: 'Role', value: 'Senior Frontend Engineer' },
      { label: 'Pipeline Volume', value: '42 Candidates Screened' },
      { label: 'Top Candidate', value: 'Theo Dumas' },
      { label: 'Target Comp', value: '$170K Base + 0.85% Eq' },
      { label: 'Recruiter Agent', value: 'FORGE Talent Engine' },
      { label: 'Target Start', value: 'Dec 01, 2026' },
    ],
  },
  {
    id: 'app-marketing-launch',
    department: 'marketing',
    departmentLabel: 'Marketing',
    action: 'LinkedIn announcement',
    title: 'Product Launch — LinkedIn announcement',
    shortDescription:
      'Editorial release brief and founder announcement copy for FORGE OS v1.2. Features design-partner traction metrics, core philosophy, and high-resolution asset embeds.',
    timeAgo: '2h ago',
    status: 'ready',
    statusLabel: 'Ready for review',
    priority: 'normal',
    whatForgePrepared: {
      summary:
        'FORGE Marketing Agent synthesized internal release notes, milestone logs, and founder interview transcripts into a crisp LinkedIn thought leadership post.',
      highlights: [
        'Reflects FORGE restrained, editorial tone (no corporate fluff or marketing jargon).',
        'Incorporates early founder benchmark: "Saved 18 hours/week across seed operations".',
        'Staged with high-res typography cards and direct early-access link.',
      ],
      confidenceScore: '97.2%',
      guardrailsChecked: [
        'Legal compliance for public claims verified',
        'Brand voice consistency score: 9.8/10',
        'Embargo timing aligned across channels',
      ],
    },
    previewContent: {
      type: 'social_post',
      heading: 'Draft Copy: Founder LinkedIn Announcement',
      body: `Most founders don't fail because of product. They fail because operations crush them.

Finance, hiring pipelines, legal contracts, regulatory filings — every hour spent juggling fragmented dashboards is an hour taken away from building what matters.

Today we're unveiling FORGE OS v1.2: The Autonomous Operating System for High-Velocity Companies.

What changes today:
1. Unified Decision Surface: Finance, Talent, and Legal operate as a single synchronized graph.
2. Autonomous Staging: FORGE drafts contracts, reconciles books, and screens candidates automatically.
3. Human-in-the-Loop Governance: You never lose control — every material action requires one-click founder approval.

We built this for founders who want to build the company, not the chaos.

Explore the preview: forge.build/launch

#Startups #Founders #OperatingSystem #Fintech #AI`,
      tags: ['LinkedIn', 'v1.2 Release', 'Founder Voice', 'Embargo: Staged'],
    },
    metadata: [
      { label: 'Channel', value: 'LinkedIn (Sarah Lin Profile)' },
      { label: 'Audience', value: 'Tech Founders & Investors' },
      { label: 'Format', value: 'Editorial Post + Asset Embed' },
      { label: 'Staged By', value: 'FORGE Growth Agent' },
      { label: 'Embargo Status', value: 'Pending Founder Sign-off' },
      { label: 'Tone Rating', value: 'Restrained & Direct' },
    ],
  },
];

const initialCompletedActivity: CompletedApproval[] = [
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

import { useForge } from '../../../context/ForgeContext';

export default function ApprovalsView() {
  const { approvals: items, completedApprovals: completedActivity, approveItem, rejectItem } = useForge();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const selectedItem = items.find((i) => i.id === selectedItemId) || null;

  const handleApprove = (item: ApprovalItem, note?: string) => {
    approveItem(item.id, note);
    setSelectedItemId(null);
  };

  const handleReject = (item: ApprovalItem, reason: string) => {
    rejectItem(item.id, reason);
    setSelectedItemId(null);
  };

  const handleQuickApprove = (item: ApprovalItem, e: React.MouseEvent) => {
    e.stopPropagation();
    approveItem(item.id, 'One-click quick approval.');
  };

  const pendingCount = items.length;

  return (
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
            <span>Governance & Decision Surface</span>
            <span>·</span>
            <span>Human-in-the-Loop</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Approvals
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            Review the work that needs your decision.
          </p>
        </div>

        {/* Compact Indicator */}
        <div className="flex items-center gap-2">
          {pendingCount > 0 ? (
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-foreground font-medium shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
              <span>{pendingCount} {pendingCount === 1 ? 'item needs' : 'items need'} your attention</span>
            </span>
          ) : (
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-emerald-800 font-medium shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
              <span>All caught up · 0 pending items</span>
            </span>
          )}
        </div>
      </div>

      {/* Visual Workflow Relationship */}
      <ApprovalWorkflowBar />

      {/* Main Content Area: If an item is selected, show the focused Review Panel. Otherwise show Queue + Activity */}
      <AnimatePresence mode="wait">
        {selectedItem ? (
          <motion.div
            key={`review-${selectedItem.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ApprovalReviewPanel
              item={selectedItem}
              onBack={() => setSelectedItemId(null)}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </motion.div>
        ) : (
          <motion.div
            key="queue-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Approval Queue */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-foreground font-medium">
                  Pending Actions
                </h2>
                <span className="text-xs text-foreground-faint">
                  Click any item to inspect and sign off
                </span>
              </div>

              <ApprovalQueue
                items={items}
                selectedId={selectedItemId}
                onSelect={(item) => setSelectedItemId(item.id)}
                onQuickApprove={handleQuickApprove}
              />
            </div>

            {/* Recently Completed Activity */}
            <ApprovalActivity completedItems={completedActivity} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
