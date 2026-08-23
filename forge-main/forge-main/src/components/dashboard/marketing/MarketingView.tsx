import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Megaphone, ArrowRight } from 'lucide-react';
import MarketingOverview from './MarketingOverview';
import CampaignsList from './CampaignsList';
import ContentWorkspace from './ContentWorkspace';
import CampaignPreview from './CampaignPreview';
import MarketingInsight from './MarketingInsight';
import CreateCampaignModal from './CreateCampaignModal';
import ContentReviewModal from './ContentReviewModal';
import { Campaign, ContentDraft, ContentStatus } from './types';

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
  {
    id: 'camp-hiring',
    title: 'Core Engineering & Design Sourcing',
    objective: 'Attract high-conviction senior engineers and product designers.',
    audience: 'Senior Web & Systems Engineers',
    status: 'Scheduled',
    scheduledDate: 'Nov 10, 2026',
    lastActivity: 'Yesterday',
    contentCount: 3,
    approvedCount: 2,
    nextScheduledItem: 'Technical Culture Deep Dive Blog · Nov 10',
    summary: 'Editorial storytelling on building with Fraunces typography, local performance and calm software principles.',
  },
  {
    id: 'camp-spring',
    title: 'Spring 2027 Early Access Keynote',
    objective: 'Pre-announce multi-entity corporate structuring and international payroll.',
    audience: 'Global Startup Communities',
    status: 'Draft',
    scheduledDate: 'Feb 15, 2027',
    lastActivity: 'Oct 18',
    contentCount: 2,
    approvedCount: 0,
    nextScheduledItem: 'Teaser Manifesto Draft',
    summary: 'Broad ecosystem initiative introducing autonomous legal workflows and multi-currency banking.',
  },
];

const initialDrafts: ContentDraft[] = [
  {
    id: 'draft-linkedin',
    title: 'Founder Announcement: Building FORGE',
    channel: 'LinkedIn',
    campaignId: 'camp-launch',
    status: 'Ready for Review',
    scheduledFor: 'Oct 28, 9:30 AM',
    author: 'Sarah Lin',
    excerpt: 'Most startups do not fail from a lack of product insight — they get overwhelmed by the fragmented operations behind the work.',
    fullBody: 'Most startups do not fail from a lack of product insight — they get overwhelmed by the fragmented operations behind the work.\n\nToday we are opening FORGE: an operating system designed to bring finance, talent pipelines, and Delaware corporate legal governance into a single calm, unified command center.\n\nNo accounting clutter. No HR spreadsheets. Just pure operational clarity for founders who want to build companies, not manage chaos.',
    lastUpdated: '15m ago',
    keyPoints: [
      'Focus on the burden of operational context switching.',
      'Highlight unified finance, hiring, and legal graph.',
      'Calm, editorial, typography-first software aesthetic.',
    ],
  },
  {
    id: 'draft-press',
    title: 'Product Launch Wire Announcement & Press Kit',
    channel: 'Press & Blog',
    campaignId: 'camp-launch',
    status: 'Scheduled',
    scheduledFor: 'Oct 28, 9:00 AM',
    author: 'Editorial Team',
    excerpt: 'FORGE announces general availability of its AI-assisted founder operating system, connecting runway simulations, candidate loops and automated NDA execution.',
    fullBody: 'FORGE announces general availability of its AI-assisted founder operating system, connecting runway simulations, candidate loops and automated NDA execution.\n\nFounded by operators, FORGE eliminates the friction of traditional enterprise back-office software by orchestrating critical startup milestones directly from a central command palette.',
    lastUpdated: '1h ago',
    keyPoints: [
      'Embargo lift coordinated with Product Hunt launch.',
      'Quotes included from 5 pilot venture-backed founders.',
    ],
  },
  {
    id: 'draft-website',
    title: 'Landing Page Hero & Feature Copy Refactor',
    channel: 'Website Copy',
    campaignId: 'camp-launch',
    status: 'Draft',
    scheduledFor: 'Oct 27, 6:00 PM',
    author: 'Design & Product',
    excerpt: 'Build the company. Not the chaos. A unified operating workspace engineered for ambitious founders.',
    fullBody: 'Build the company. Not the chaos.\n\nFORGE brings the three essential operational areas of startup creation — Finance, Hiring, and Legal — into one intelligent workspace with Fraunces typography, liquid-glass precision, and zero administrative clutter.',
    lastUpdated: '3h ago',
    keyPoints: [
      'Reflects revised product preview and command input interactions.',
      'Ensures typography and spacing match brand standards.',
    ],
  },
  {
    id: 'draft-email',
    title: 'Early Access Community Dispatch & Release Notes',
    channel: 'Newsletter',
    campaignId: 'camp-launch',
    status: 'Draft',
    scheduledFor: 'Oct 28, 10:00 AM',
    author: 'Growth Team',
    excerpt: 'A special letter to our first 250 pilot founders. Here is everything shipping in v1.2 and what comes next.',
    fullBody: 'A special letter to our first 250 pilot founders.\n\nThank you for stress-testing FORGE over the last 6 months. In v1.2, we have rolled out instant Delaware mutual NDA drafting, automated headcount runway projections, and our global ⌘K command palette.',
    lastUpdated: 'Yesterday',
    keyPoints: [
      'Sent exclusively to approved beta users and angel investors.',
      'Includes direct link to founder feedback forum.',
    ],
  },
];

import { useForge } from '../../../context/ForgeContext';

export default function MarketingView() {
  const { campaigns, contentDrafts: drafts, addCampaign, updateContentDraftStatus } = useForge();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(drafts[0]?.id || null);
  const [createCampaignModalOpen, setCreateCampaignModalOpen] = useState(false);
  const [reviewModalDraft, setReviewModalDraft] = useState<ContentDraft | null>(null);

  const selectedDraft = drafts.find((d) => d.id === selectedDraftId) || drafts[0] || null;

  const handleCreateCampaign = (
    campaignData: Omit<Campaign, 'id' | 'lastActivity' | 'contentCount' | 'approvedCount' | 'nextScheduledItem'>
  ) => {
    addCampaign({
      ...campaignData,
      lastActivity: 'Just now',
      contentCount: 1,
      approvedCount: 0,
      nextScheduledItem: 'First draft in review',
    });
  };

  const handleUpdateDraftStatus = (draftId: string, newStatus: ContentStatus) => {
    updateContentDraftStatus(draftId, newStatus);
  };

  const displayedDrafts = selectedCampaignId
    ? drafts.filter((d) => d.campaignId === selectedCampaignId)
    : drafts;

  const currentSelectedCampaign =
    campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  return (
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            <span>04 · Growth</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Marketing
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            Turn ideas into campaigns that move the company forward.
          </p>
        </div>

        {/* Primary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateCampaignModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all duration-150 shadow-2xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create campaign</span>
          </button>
        </div>
      </div>

      {/* Marketing Overview Summary */}
      <MarketingOverview
        activeCampaignsCount={campaigns.filter((c) => c.status === 'Active').length}
        draftsCount={drafts.filter((d) => d.status === 'Draft' || d.status === 'Ready for Review').length}
        scheduledCount={drafts.filter((d) => d.status === 'Scheduled').length}
        publishedCount={24}
      />

      {/* Campaigns List */}
      <CampaignsList
        campaigns={campaigns}
        selectedCampaignId={selectedCampaignId}
        onSelectCampaign={setSelectedCampaignId}
      />

      {/* Content Workspace Grid */}
      <ContentWorkspace
        drafts={displayedDrafts}
        selectedDraftId={selectedDraft?.id || null}
        onSelectDraft={(draft) => {
          setSelectedDraftId(draft.id);
          setReviewModalDraft(draft);
        }}
      />

      {/* Grid: Campaign Preview (Left 7 cols) & Insight + Visual (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Campaign Blueprint Liquid-Glass Preview */}
        <div className="lg:col-span-7 space-y-6">
          <CampaignPreview
            campaign={currentSelectedCampaign}
            onReviewCampaign={(camp) => {
              if (displayedDrafts.length > 0) {
                setReviewModalDraft(displayedDrafts[0]);
              }
            }}
          />
        </div>

        {/* Right: Marketing Insight & Hand-drawn Editorial Illustration */}
        <div className="lg:col-span-5 space-y-6">
          <MarketingInsight />

          {/* Editorial Illustration Card */}
          <div className="rounded-2xl border border-border/70 bg-surface/35 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 overflow-hidden">
            <div className="w-24 sm:w-28 shrink-0 flex items-center justify-center">
              <img
                src="/illustrations/cta-figure.png"
                alt="Editorial hand-drawn illustration of a founder moving forward with clear purpose and conviction"
                className="w-full h-auto select-none opacity-90 transition-opacity hover:opacity-100"
                draggable={false}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
                  Ideas → Content → Reach
                </span>
              </div>
              <h4 className="mt-1 font-display text-base font-medium text-foreground">
                Narrative with founder conviction
              </h4>
              <p className="mt-1 text-xs text-foreground-soft leading-relaxed">
                Stage messaging drafts and sync distribution across company milestones without managing scattered social media tabs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={createCampaignModalOpen}
        onClose={() => setCreateCampaignModalOpen(false)}
        onSubmit={handleCreateCampaign}
      />

      {/* Content Review Modal */}
      <ContentReviewModal
        draft={reviewModalDraft}
        onClose={() => setReviewModalDraft(null)}
        onUpdateStatus={handleUpdateDraftStatus}
      />
    </div>
  );
}
