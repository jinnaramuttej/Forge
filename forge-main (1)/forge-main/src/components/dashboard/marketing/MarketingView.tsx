import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Megaphone, FileText, Sparkles, Send } from 'lucide-react';
import MarketingOverview from './MarketingOverview';
import CampaignsList from './CampaignsList';
import ContentWorkspace from './ContentWorkspace';
import CampaignPreview from './CampaignPreview';
import MarketingInsight from './MarketingInsight';
import CreateCampaignModal from './CreateCampaignModal';
import ContentReviewModal from './ContentReviewModal';
import { Campaign, ContentDraft, ContentStatus } from './types';
import { useForge } from '../../../context/ForgeContext';

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
    id: 'draft-twitter',
    title: 'Visual Breakdown: Autonomous Founder Workflows (Thread)',
    channel: 'X / Twitter',
    campaignId: 'camp-launch',
    status: 'Draft',
    scheduledFor: 'Oct 28, 10:00 AM',
    author: 'Sarah Lin',
    excerpt: '1/7 How we cut 14 hours of weekly operational context-switching into 3 approvals in FORGE.',
    fullBody: '1/7 How we cut 14 hours of weekly operational context-switching into 3 approvals in FORGE.\n\n2/7 When you hire a senior engineer, your runway calculation changes immediately. Traditional tools force you to update 3 different apps.\n\n3/7 In FORGE, headcount burn is tied directly to bank cash balances and offer generation in real time.',
    lastUpdated: '3h ago',
    keyPoints: [
      'Punchy founder-to-founder direct tone.',
      'Embedded screenshots of clean runway gauge.',
    ],
  },
];

export default function MarketingView() {
  const { addActivity, showToast } = useForge();
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<ContentDraft[]>(initialDrafts);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'workspace' | 'insights'>('campaigns');
  const [createCampaignModalOpen, setCreateCampaignModalOpen] = useState(false);
  const [reviewModalDraft, setReviewModalDraft] = useState<ContentDraft | null>(null);

  const selectedDraft = drafts.find((d) => d.id === selectedDraftId) || drafts[0];
  const currentSelectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  const handleCreateCampaign = (campaignData: Omit<Campaign, 'id' | 'lastActivity' | 'contentCount' | 'approvedCount' | 'nextScheduledItem'>) => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      lastActivity: 'Just now',
      contentCount: 0,
      approvedCount: 0,
      nextScheduledItem: 'Schedule initial deliverable',
    };

    setCampaigns([newCamp, ...campaigns]);
    setSelectedCampaignId(newCamp.id);
    addActivity('marketing', 'Campaign created', `Staged strategic campaign: ${newCamp.title}`);
    showToast(`Created campaign: ${newCamp.title}`, 'success');
  };

  const handleUpdateDraftStatus = (draftId: string, newStatus: ContentStatus) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, status: newStatus, lastUpdated: 'Just now' } : d))
    );

    const draft = drafts.find((d) => d.id === draftId);
    if (newStatus === 'Published' || newStatus === 'Scheduled') {
      addActivity('marketing', 'Content asset approved', `Approved "${draft?.title}" for distribution on ${draft?.channel}.`);
      showToast(`Approved: ${draft?.title}`, 'success');
    }
  };

  const displayedDrafts = selectedCampaignId
    ? drafts.filter((d) => d.campaignId === selectedCampaignId)
    : drafts;

  return (
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            <span>04 · Growth</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Marketing & Narrative
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            Multi-channel campaign orchestration, announcements, and narrative distribution.
          </p>
        </div>

        {/* Primary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateCampaignModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-all duration-150 shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Marketing Overview (Clean Metrics Ribbon) */}
      <MarketingOverview
        activeCampaignsCount={campaigns.filter((c) => c.status === 'Active').length}
        draftsCount={drafts.filter((d) => d.status === 'Draft' || d.status === 'Ready for Review').length}
        scheduledCount={drafts.filter((d) => d.status === 'Scheduled').length}
        publishedCount={24}
      />

      {/* Segmented Sub-Navigation Bar */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'campaigns', label: 'Campaigns & Preview', icon: Megaphone },
            { id: 'workspace', label: 'Content Workspace & Drafts', icon: FileText },
            { id: 'insights', label: 'Narrative Intelligence', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-foreground-soft hover:text-foreground hover:bg-foreground/[0.04]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {selectedCampaignId && (
          <button
            onClick={() => setSelectedCampaignId(null)}
            className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1"
          >
            <span>Filtered by campaign · Clear</span>
          </button>
        )}
      </div>

      {/* Tab 1: Campaigns & Preview */}
      {activeTab === 'campaigns' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Campaigns List */}
          <CampaignsList
            campaigns={campaigns}
            selectedCampaignId={selectedCampaignId}
            onSelectCampaign={setSelectedCampaignId}
          />

          {/* Campaign Blueprint Preview */}
          <CampaignPreview
            campaign={currentSelectedCampaign}
            onReviewCampaign={() => {
              if (displayedDrafts.length > 0) {
                setReviewModalDraft(displayedDrafts[0]);
              }
            }}
          />
        </motion.div>
      )}

      {/* Tab 2: Content Workspace */}
      {activeTab === 'workspace' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <ContentWorkspace
            drafts={displayedDrafts}
            selectedDraftId={selectedDraft?.id || null}
            onSelectDraft={(draft) => {
              setSelectedDraftId(draft.id);
              setReviewModalDraft(draft);
            }}
          />
        </motion.div>
      )}

      {/* Tab 3: Narrative Intelligence */}
      {activeTab === 'insights' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <MarketingInsight />

          <div className="rounded-2xl border border-border/70 bg-surface/35 p-6 flex flex-col sm:flex-row items-center gap-5 overflow-hidden">
            <div className="w-24 sm:w-28 shrink-0 flex items-center justify-center">
              <img
                src="/illustrations/cta-figure.png"
                alt="Founder moving forward with purpose"
                className="w-full h-auto select-none opacity-90"
                draggable={false}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-foreground-faint">
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
        </motion.div>
      )}

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
