import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import TopSnapshot from './TopSnapshot';
import ForgeCommand from './ForgeCommand';
import NeedsAttention from './NeedsAttention';
import OperatingPulse from './OperatingPulse';
import ReviewModal from './ReviewModal';
import CommandModal from './CommandModal';
import { AttentionItem, PulseEvent } from './types';

interface OverviewViewProps {
  onNavigateToApprovals?: () => void;
  onNavigateToActivity?: () => void;
  onNavigateToFinance?: () => void;
  onNavigateToHiring?: () => void;
  onNavigateToLegal?: () => void;
  onNavigateToMarketing?: () => void;
  onNavigate?: (id: import('./types').DashboardNavId) => void;
}

const initialAttentionItems: AttentionItem[] = [
  {
    id: 'nda-foundry',
    category: 'legal',
    categoryLabel: 'Legal',
    title: 'Series Seed Mutual NDA · Foundry Group',
    description: 'Counterparty legal team signed standard mutual agreement. Ready for your signature to unlock diligence data room.',
    timeAgo: '12m ago',
    status: 'Awaiting signature',
    statusType: 'amber',
    actionLabel: 'Review →',
    details: {
      summary: 'Standard Delaware 2-year bilateral non-disclosure agreement prepared for Foundry Group partner review. Includes standard trade secret protections and non-solicitation exclusions.',
      metadata: [
        { label: 'Counterparty', value: 'Foundry Group LP' },
        { label: 'Document Type', value: 'Bilateral Mutual NDA' },
        { label: 'Governing Law', value: 'Delaware' },
        { label: 'Term', value: '24 Months' },
        { label: 'Audited By', value: 'FORGE Legal Guard' },
        { label: 'Risk Rating', value: 'Clean · 0 Deviations' },
      ],
      keyPoints: [
        'Excludes any non-compete or broad lock-in clauses.',
        'Standard carve-out for independently developed IP.',
        'Countersigned by General Partner on Oct 23.',
      ],
      primaryAction: 'Sign & Execute NDA',
      secondaryAction: 'Request Legal Redline',
    },
  },
  {
    id: 'candidate-aisha',
    category: 'hiring',
    categoryLabel: 'Hiring',
    title: 'Aisha Khan · Staff Frontend Engineer',
    description: 'Final technical & architecture loop complete. 4/4 unanimous positive scorecards from engineering team. Ready for offer approval.',
    timeAgo: '45m ago',
    status: 'Offer decision ready',
    statusType: 'blue',
    actionLabel: 'Review →',
    details: {
      summary: 'Candidate passed all 4 rounds with exceptional feedback on systems architecture and UI craft. Proposed package sits squarely within approved Seed headcount band ($175K base + 0.85% equity).',
      metadata: [
        { label: 'Candidate', value: 'Aisha Khan' },
        { label: 'Target Role', value: 'Staff Frontend Engineer' },
        { label: 'Comp Band', value: '$170K – $185K Base' },
        { label: 'Equity Band', value: '0.75% – 1.00%' },
        { label: 'Team Consensus', value: 'Strong Yes (4/4)' },
        { label: 'Start Date', value: 'Nov 15, 2026' },
      ],
      keyPoints: [
        'Lead architect for core web performance at previous unicorn.',
        'Compensation package matches pre-calculated cash runway constraints.',
        'Directly supports Q4 milestone: FORGE OS Web Client v2.',
      ],
      primaryAction: 'Approve & Issue Offer Letter',
      secondaryAction: 'Schedule Founder Close Call',
    },
  },
  {
    id: 'launch-draft',
    category: 'marketing',
    categoryLabel: 'Marketing',
    title: 'v1.2 Launch Brief & Press Release',
    description: 'FORGE agent synthesized product changelog into public release notes and tech publication announcement drafts.',
    timeAgo: '2h ago',
    status: 'Draft ready',
    statusType: 'neutral',
    actionLabel: 'Review →',
    details: {
      summary: 'Editorial press brief highlighting the release of cross-system workflow intelligence. Staged for simultaneous release on Substack, X/Twitter, and tech press wires.',
      metadata: [
        { label: 'Release Tag', value: 'v1.2.0-GA' },
        { label: 'Channels', value: 'Press Wire, Blog, X' },
        { label: 'Audience', value: 'Founders & Tech Leads' },
        { label: 'Embargo Date', value: 'Oct 28, 9:00 AM EST' },
      ],
      keyPoints: [
        'Tone matches FORGE restrained, typography-first brand identity.',
        'Includes quotes from initial design partner beta founders.',
        'Legal compliance review passed for public statements.',
      ],
      primaryAction: 'Approve & Stage for Embargo',
      secondaryAction: 'Edit Draft Copy',
    },
  },
];

const initialPulseEvents: PulseEvent[] = [
  {
    id: 'p1',
    category: 'finance',
    title: 'Finance updated',
    description: 'Bank feeds reconciled. Stripe revenue deposited (+$14,200 ARR).',
    timestamp: '10:42 AM',
    system: 'Finance',
  },
  {
    id: 'p2',
    category: 'hiring',
    title: 'Candidate shortlisted',
    description: 'Theo Dumas advanced to Technical Deep Dive for Performance Engineer.',
    timestamp: '09:15 AM',
    system: 'Hiring',
  },
  {
    id: 'p3',
    category: 'legal',
    title: 'NDA drafted',
    description: 'Mutual agreement generated for external design systems contractor.',
    timestamp: '08:30 AM',
    system: 'Legal',
  },
  {
    id: 'p4',
    category: 'marketing',
    title: 'Campaign prepared',
    description: 'Product Hunt launch checklist & visual collateral finalized.',
    timestamp: 'Yesterday',
    system: 'Marketing',
  },
  {
    id: 'p5',
    category: 'finance',
    title: 'SAFE Note executed',
    description: '$150K angel allocation closed & deposited into Silicon Valley Bank.',
    timestamp: 'Oct 22',
    system: 'Finance',
  },
];

import { useForge } from '../../context/ForgeContext';

import InvestorMemoModal from './InvestorMemoModal';

export default function OverviewView({
  onNavigateToApprovals,
  onNavigateToActivity,
  onNavigateToFinance,
  onNavigateToHiring,
  onNavigateToLegal,
  onNavigateToMarketing,
  onNavigate,
}: OverviewViewProps) {
  const { approvals, activities, approveItem, showToast } = useForge();
  const [reviewingItem, setReviewingItem] = useState<AttentionItem | null>(null);
  const [commandModalOpen, setCommandModalOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [investorModalOpen, setInvestorModalOpen] = useState(false);

  // Live mapped attention items from central approvals
  const attentionItems: AttentionItem[] = approvals.map((app) => ({
    id: app.id,
    category: app.department as any,
    categoryLabel: app.departmentLabel,
    title: app.title,
    description: app.shortDescription,
    timeAgo: app.timeAgo,
    status: app.statusLabel,
    statusType: 'amber',
    actionLabel: 'Review →',
    details: {
      summary: app.whatForgePrepared?.summary || app.shortDescription,
      metadata: app.metadata || [],
      keyPoints: app.whatForgePrepared?.highlights || [],
      primaryAction: `Approve ${app.action}`,
      secondaryAction: 'Request Changes',
    },
  }));

  // Live mapped pulse events from central activities
  const pulseEvents: PulseEvent[] = activities.slice(0, 4).map((act) => ({
    id: act.id,
    category: act.department as any,
    title: act.action,
    description: act.shortDescription,
    timestamp: act.time,
    system: act.departmentLabel,
  }));

  const handleApproveItem = (itemId: string, note?: string) => {
    approveItem(itemId, note);
    setReviewingItem(null);
  };

  const handleOpenCommandWithQuery = (query?: string) => {
    setCommandQuery(query || '');
    setCommandModalOpen(true);
  };

  return (
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8">
      {/* 2. Hero Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground-faint">
            <span>Friday, October 24</span>
            <span>·</span>
            <span>Seed Stage</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Good morning, Sarah.
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            Here's what needs your attention today.
          </p>
        </div>

        {/* Sync Status & Investor Memo Action */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setInvestorModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-surface border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-foreground hover:text-background transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Generate Investor Memo</span>
          </button>

          <span className="glass inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs text-foreground-soft font-medium shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-[var(--color-finance)] animate-pulse" />
            <span>3 systems synced</span>
          </span>
        </div>
      </div>

      {/* 3. Top Snapshot Bar */}
      <TopSnapshot
        onNavigateToFinance={onNavigateToFinance}
        onNavigateToHiring={onNavigateToHiring}
      />

      {/* 5. FORGE Command Bar */}
      <ForgeCommand onTriggerCommand={handleOpenCommandWithQuery} />

      {/* Main Grid: Needs Attention (Left 60%) & Pulse + Editorial Visual (Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 4. Needs Attention (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-8">
          <NeedsAttention
            items={attentionItems}
            onReviewItem={(item) => setReviewingItem(item)}
            onViewAllApprovals={onNavigateToApprovals}
          />
        </div>

        {/* Right Column: 7. Visual Element + 6. Operating Pulse (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 7. Restrained Editorial Hand-Drawn Visual Element */}
          {/* 5. Editorial Founder System Overview (Open Fluid Style) */}
          <div className="border-b border-border/80 pb-6">
            <div className="flex items-center justify-between pb-3 mb-3">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-foreground-faint">
                Founders Operating System
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[0.68rem] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Engine Active</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-24 sm:w-28 shrink-0">
                <img
                  src="/illustrations/dashboard-founder.png"
                  alt="Founder orchestrating company systems"
                  className="w-full h-auto select-none opacity-90 drop-shadow-2xs"
                  draggable={false}
                />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="font-display text-base font-medium text-foreground leading-snug">
                  Finance, Talent & Delaware Legal
                </div>
                <p className="text-xs text-foreground-soft leading-relaxed">
                  Every decision, approval, and document flows directly into your unified company graph without spreadsheet context loss.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Operating Pulse */}
          <OperatingPulse
            events={pulseEvents}
            onViewActivity={onNavigateToActivity}
          />
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        item={reviewingItem}
        onClose={() => setReviewingItem(null)}
        onApprove={handleApproveItem}
      />

      {/* Global Command Modal */}
      <CommandModal
        isOpen={commandModalOpen}
        onClose={() => setCommandModalOpen(false)}
        initialQuery={commandQuery}
        onNavigate={onNavigate}
        onActionComplete={showToast}
      />

      {/* Investor Memo Generator Modal */}
      <InvestorMemoModal
        isOpen={investorModalOpen}
        onClose={() => setInvestorModalOpen(false)}
      />
    </div>
  );
}
