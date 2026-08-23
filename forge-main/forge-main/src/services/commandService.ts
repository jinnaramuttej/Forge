import { CommandProcessingStep, CommandResult } from './types';
import { ForgeState } from '../types/forge';

export const COMMAND_STEPS: CommandProcessingStep[] = [
  {
    phase: 'understanding',
    label: 'Understanding request...',
    subtext: 'Parsing natural language intent across company graph',
  },
  {
    phase: 'preparing',
    label: 'Preparing action...',
    subtext: 'Executing autonomous checks & synthesizing parameters',
  },
  {
    phase: 'ready',
    label: 'Ready for review.',
    subtext: 'Action staged with zero deviations for founder sign-off',
  },
];

export async function executeCommand(
  query: string,
  onStepChange?: (step: CommandProcessingStep) => void,
  state?: ForgeState
): Promise<CommandResult> {
  const normalized = query.toLowerCase().trim();

  // 1. Step: Understanding
  if (onStepChange) onStepChange(COMMAND_STEPS[0]);
  await new Promise((r) => setTimeout(r, 260));

  // 2. Step: Preparing
  if (onStepChange) onStepChange(COMMAND_STEPS[1]);
  await new Promise((r) => setTimeout(r, 300));

  // 3. Step: Ready
  if (onStepChange) onStepChange(COMMAND_STEPS[2]);
  await new Promise((r) => setTimeout(r, 180));

  // Match command patterns
  if (
    normalized.includes('nda') ||
    normalized.includes('designer') ||
    normalized.includes('contract') ||
    normalized.includes('agreement')
  ) {
    const doc = state?.legalDocuments.find((d) => d.id === 'doc-nda-monochrome') || state?.legalDocuments[0];

    return {
      id: `cmd-${Date.now()}`,
      query,
      department: 'legal',
      departmentLabel: 'Legal',
      title: doc?.title || 'Mutual NDA for New Designer · Studio Monochrome',
      summary:
        doc?.summary ||
        'Standard Delaware bilateral confidentiality agreement prepared for Studio Monochrome contract designer. Includes 100% IP assignment and 24-month term.',
      actionLabel: 'Review document →',
      targetNav: 'approvals',
      metadata: [
        { label: 'Counterparty', value: doc?.counterparty || 'Studio Monochrome LLC' },
        { label: 'Governing Law', value: doc?.governingLaw || 'Delaware, USA' },
        { label: 'Risk Rating', value: doc?.riskRating || 'Clean · 0 Deviations' },
        { label: 'Status', value: doc?.status || 'Awaiting Review' },
      ],
      tags: ['Delaware Law', 'Work-for-Hire', 'Bilateral', '24M Term'],
    };
  }

  if (
    normalized.includes('runway') ||
    normalized.includes('burn') ||
    normalized.includes('cash') ||
    normalized.includes('balance') ||
    normalized.includes('finance')
  ) {
    const fin = state?.finance;
    return {
      id: `cmd-${Date.now()}`,
      query,
      department: 'finance',
      departmentLabel: 'Finance',
      title: `Runway: ${fin?.runway || '14.8 months'} (${fin?.cash || '$284.5K'} Cash Buffer)`,
      summary: `Current net cash burn is calibrated at ${fin?.monthlyBurn || '$19.2K'}/mo. Bank feeds reconciled with Stripe and Silicon Valley Bank. Runway remains healthy.`,
      actionLabel: 'Open Finance →',
      targetNav: 'finance',
      metadata: [
        { label: 'Net Runway', value: fin?.runway || '14.8 Months' },
        { label: 'Monthly Burn', value: fin?.monthlyBurn || '$19.2K / mo' },
        { label: 'Total Cash', value: fin?.cash || '$284.5K' },
        { label: 'Monthly Revenue', value: fin?.monthlyRevenue || '$42.8K' },
      ],
      tags: ['Reconciled', 'Runway Healthy', 'Live State'],
    };
  }

  if (
    normalized.includes('candidate') ||
    normalized.includes('hire') ||
    normalized.includes('hiring') ||
    normalized.includes('frontend') ||
    normalized.includes('engineer') ||
    normalized.includes('applicant')
  ) {
    const topCand = state?.candidates.find((c) => c.matchScore >= 95) || state?.candidates[0];
    const totalCount = state?.candidates.length || 4;

    return {
      id: `cmd-${Date.now()}`,
      query,
      department: 'hiring',
      departmentLabel: 'Hiring',
      title: `Senior Frontend Engineer · ${totalCount} Candidates in Pipeline`,
      summary: `Autonomous talent pipeline parsed inbound profiles. Top recommendation: ${
        topCand?.name || 'Theo Dumas'
      } (${topCand?.matchScore || 98}/100 score, ${topCand?.stage || 'screening'} stage). Ready for review.`,
      actionLabel: 'Review candidates →',
      targetNav: 'hiring',
      metadata: [
        { label: 'Role', value: 'Senior Frontend Engineer' },
        { label: 'Top Candidate', value: `${topCand?.name || 'Theo Dumas'} (${topCand?.matchScore || 98}/100)` },
        { label: 'Current Stage', value: topCand?.stage?.toUpperCase() || 'SCREENING' },
        { label: 'Pipeline Volume', value: `${totalCount} Active Candidates` },
      ],
      tags: ['Staff Level', 'Scorecards Live', 'Talent Graph'],
    };
  }

  if (
    normalized.includes('launch') ||
    normalized.includes('announcement') ||
    normalized.includes('marketing') ||
    normalized.includes('linkedin') ||
    normalized.includes('press') ||
    normalized.includes('campaign')
  ) {
    const camp = state?.campaigns[0];
    return {
      id: `cmd-${Date.now()}`,
      query,
      department: 'marketing',
      departmentLabel: 'Marketing',
      title: camp?.title || 'Product Launch — LinkedIn announcement Staged',
      summary:
        camp?.summary ||
        'Founder thought leadership copy and release brief prepared for FORGE OS v1.2 GA embargo. Highlights operational architecture and design-partner traction metrics.',
      actionLabel: 'Review announcement →',
      targetNav: 'approvals',
      metadata: [
        { label: 'Campaign', value: camp?.title || 'Product Launch v1.2' },
        { label: 'Target Date', value: camp?.scheduledDate || 'Oct 28, 2026' },
        { label: 'Status', value: camp?.status || 'Active' },
      ],
      tags: ['Embargo Staged', 'Founder Voice', 'v1.2 Launch'],
    };
  }

  if (
    normalized.includes('approval') ||
    normalized.includes('pending') ||
    normalized.includes('attention') ||
    normalized.includes('review')
  ) {
    const count = state?.approvals.length ?? 3;
    return {
      id: `cmd-${Date.now()}`,
      query,
      department: 'approvals',
      departmentLabel: 'Governance',
      title: `${count} ${count === 1 ? 'Item Needs' : 'Items Need'} Your Attention`,
      summary:
        count > 0
          ? `Pending decision queue contains ${count} items awaiting founder sign-off across Legal, Hiring, and Marketing.`
          : 'All caught up! 0 pending approvals requiring your decision right now.',
      actionLabel: 'View Approvals →',
      targetNav: 'approvals',
      metadata: [
        { label: 'Pending Items', value: `${count} Actions` },
        { label: 'Decision Protocol', value: 'One-Click Sign-off' },
        { label: 'Audit Status', value: 'Guardrails Synchronized' },
      ],
      tags: ['Governance', 'Human-in-the-Loop', `${count} Pending`],
    };
  }

  if (
    normalized.includes('activity') ||
    normalized.includes('log') ||
    normalized.includes('audit') ||
    normalized.includes('recent')
  ) {
    const recentAct = state?.activities[0];
    return {
      id: `cmd-${Date.now()}`,
      query,
      department: 'activity',
      departmentLabel: 'Audit Log',
      title: `Recent Activity: ${recentAct?.action || 'Audit Stream Active'}`,
      summary: `Latest action: ${recentAct?.shortDescription || 'Operating pulse synchronized across all autonomous agents.'}`,
      actionLabel: 'View Activity →',
      targetNav: 'activity',
      metadata: [
        { label: 'Latest Event', value: recentAct?.action || 'NDA Drafted' },
        { label: 'Actor', value: recentAct?.actor || 'FORGE Agent' },
        { label: 'Timestamp', value: recentAct?.time || 'Just now' },
      ],
      tags: ['Live Audit', 'Activity Stream'],
    };
  }

  // Fallback generic synthesized command
  return {
    id: `cmd-${Date.now()}`,
    query,
    department: 'system',
    departmentLabel: 'FORGE Core',
    title: `Command Executed: "${query}"`,
    summary:
      'FORGE synchronized across Finance, Hiring, Legal, and Marketing repositories to stage the requested operational parameters.',
    actionLabel: 'Open Overview →',
    targetNav: 'overview',
    metadata: [
      { label: 'Status', value: 'Action Staged' },
      { label: 'Synchronized Graph', value: 'Connected (4 Agents)' },
      { label: 'Audit Log ID', value: `FRG-${Math.floor(10000 + Math.random() * 90000)}` },
    ],
    tags: ['Autonomous Synthesis', 'Audit Logged'],
  };
}
