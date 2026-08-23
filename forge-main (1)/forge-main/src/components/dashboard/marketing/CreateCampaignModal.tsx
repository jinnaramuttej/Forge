import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Megaphone,
  Sparkles,
  Target,
  Layers,
  Send,
  Share2,
  Calendar,
  Globe,
  MessageSquare,
} from 'lucide-react';
import { Campaign } from './types';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaign: Omit<Campaign, 'id' | 'lastActivity' | 'contentCount' | 'approvedCount' | 'nextScheduledItem'>) => void;
}

interface CampaignArchetype {
  id: string;
  title: string;
  channel: string;
  defaultObjective: string;
  audience: string;
  suggestedDeliverables: string[];
}

const CAMPAIGN_ARCHETYPES: CampaignArchetype[] = [
  {
    id: 'launch',
    title: 'Product Launch v1.2',
    channel: 'Product Hunt + X',
    defaultObjective: 'Drive organic early-adopter signups and showcase core autonomous workflows.',
    audience: 'Founders, Tech Leads & Early Adopters',
    suggestedDeliverables: ['Hero Landing Copy', 'PH Gallery Carousel', 'Founder Announcement Thread'],
  },
  {
    id: 'essay',
    title: 'Founder Essay & Vision',
    channel: 'Substack + LinkedIn',
    defaultObjective: 'Establish company point-of-view on the future of autonomous startup operations.',
    audience: 'Investors, Venture Partners & Founders',
    suggestedDeliverables: ['Long-form 1,500w Essay', 'Key Takeaway Slides', 'Executive Summary'],
  },
  {
    id: 'investor',
    title: 'Q4 Strategic Investor Sync',
    channel: 'Private Investor Memo',
    defaultObjective: 'Highlight ARR growth, runway elongation, and key enterprise customer conversions.',
    audience: 'Existing & Target Series A Syndicate',
    suggestedDeliverables: ['Metrics Scorecard', 'Product Roadmap Teaser', 'Burn & Runway Table'],
  },
  {
    id: 'changelog',
    title: 'Bi-Weekly Feature Changelog',
    channel: 'In-App + Twitter',
    defaultObjective: 'Keep active users engaged with rapid iteration cadence and feature spotlight.',
    audience: 'Active Workspace Founders',
    suggestedDeliverables: ['3 Bullet Highlights', '15s UI Loom Video', 'Documentation Link'],
  },
];

export default function CreateCampaignModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateCampaignModalProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<CampaignArchetype>(CAMPAIGN_ARCHETYPES[0]);
  const [title, setTitle] = useState(CAMPAIGN_ARCHETYPES[0].title);
  const [objective, setObjective] = useState(CAMPAIGN_ARCHETYPES[0].defaultObjective);
  const [audience, setAudience] = useState(CAMPAIGN_ARCHETYPES[0].audience);
  const [scheduledDate, setScheduledDate] = useState('Nov 15, 2026');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['X / Twitter', 'LinkedIn', 'Substack']);
  const [deliverables, setDeliverables] = useState<string[]>(CAMPAIGN_ARCHETYPES[0].suggestedDeliverables);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectArchetype = (arch: CampaignArchetype) => {
    setSelectedArchetype(arch);
    setTitle(arch.title);
    setObjective(arch.defaultObjective);
    setAudience(arch.audience);
    setDeliverables(arch.suggestedDeliverables);
  };

  const toggleChannel = (ch: string) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const toggleDeliverable = (item: string) => {
    setDeliverables((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit({
        title: title.trim(),
        objective: objective.trim() || 'Drive product awareness and qualified user acquisition.',
        audience,
        status: 'Active',
        scheduledDate,
        summary: `Strategic campaign across ${selectedChannels.join(', ')} with ${deliverables.length} planned deliverables.`,
      });
      onClose();
    }, 450);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-foreground/30 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-background-alt">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                <Megaphone className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                    Growth Campaign Studio
                  </span>
                  <span className="rounded-full bg-[var(--color-accent)]/15 px-2 py-0.5 text-[0.65rem] font-medium text-[var(--color-accent)]">
                    Multi-Channel Orchestration
                  </span>
                </div>
                <p className="text-[0.72rem] text-foreground-soft">
                  Architect distribution narratives, draft scheduled deliverables, and track conversion loops
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-foreground-faint hover:bg-foreground/[0.06] hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* 1. Campaign Presets */}
            <div>
              <label className="block text-xs font-medium text-foreground-soft mb-2 flex items-center justify-between">
                <span>Select Campaign Archetype</span>
                <span className="text-[0.7rem] text-foreground-faint">
                  Pre-configured distribution sequences
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CAMPAIGN_ARCHETYPES.map((arch) => {
                  const isSelected = selectedArchetype.id === arch.id;
                  return (
                    <button
                      key={arch.id}
                      type="button"
                      onClick={() => handleSelectArchetype(arch)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-foreground bg-surface shadow-xs ring-1 ring-foreground/20'
                          : 'border-border bg-background hover:bg-surface hover:border-foreground/20'
                      }`}
                    >
                      <span className="text-xs font-semibold text-foreground truncate w-full mb-1">
                        {arch.title}
                      </span>
                      <span className="text-[0.65rem] text-[var(--color-accent)] font-medium">
                        {arch.channel}
                      </span>
                      <span className="text-[0.68rem] text-foreground-faint mt-1.5 line-clamp-1">
                        {arch.suggestedDeliverables.length} assets
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Core Campaign Title & Target Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Product Launch v1.2"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-foreground-faint focus:border-[var(--color-accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                  Target Audience Persona
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Technical Founders & Early Adopters"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground focus:border-[var(--color-accent)] focus:outline-none"
                />
              </div>
            </div>

            {/* 3. Distribution Channels Chips */}
            <div>
              <label className="block text-xs font-medium text-foreground-soft mb-2 flex items-center justify-between">
                <span>Active Distribution Channels</span>
                <span className="text-[0.7rem] text-foreground-faint">
                  {selectedChannels.length} channels selected
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'X / Twitter',
                  'LinkedIn',
                  'Substack',
                  'Product Hunt',
                  'HackerNews',
                  'Direct Investor Memo',
                  'In-App Modal',
                ].map((ch) => {
                  const isChecked = selectedChannels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => toggleChannel(ch)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.72rem] font-medium border transition-all ${
                        isChecked
                          ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                          : 'border-border bg-surface text-foreground-faint hover:text-foreground-soft'
                      }`}
                    >
                      <Check className={`h-3 w-3 ${isChecked ? 'opacity-100' : 'opacity-20'}`} />
                      <span>{ch}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Strategic Narrative Objective */}
            <div>
              <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                Strategic Narrative Objective
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={2}
                placeholder="Core value proposition and emotional resonance angle..."
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-foreground-faint focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>

            {/* 5. Planned Content Deliverables */}
            <div>
              <label className="block text-xs font-medium text-foreground-soft mb-2 flex items-center justify-between">
                <span>Planned Content Deliverables</span>
                <span className="text-[0.7rem] text-[var(--color-accent)] font-medium">
                  {deliverables.length} deliverables
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Hero Landing Copy',
                  'PH Gallery Carousel',
                  'Founder Announcement Thread',
                  'Long-form 1,500w Essay',
                  'Key Takeaway Slides',
                  '15s UI Loom Video',
                  'Metrics Scorecard',
                ].map((item) => {
                  const isInc = deliverables.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleDeliverable(item)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[0.72rem] font-medium border transition-all ${
                        isInc
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border bg-surface text-foreground-soft hover:text-foreground'
                      }`}
                    >
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs text-foreground-soft hover:text-foreground transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-all shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    <span>Scheduling Campaign...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Launch Campaign Strategy</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
