import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Calendar, Target, Users } from 'lucide-react';
import { Campaign } from './types';

interface CampaignPreviewProps {
  campaign: Campaign | null;
  onReviewCampaign: (campaign: Campaign) => void;
}

export default function CampaignPreview({
  campaign,
  onReviewCampaign,
}: CampaignPreviewProps) {
  if (!campaign) {
    return (
      <div className="glass rounded-2xl p-6 text-center border border-border/70">
        <p className="text-xs text-foreground-faint">
          Select a campaign from the list to preview its objective, progress and scheduled items.
        </p>
      </div>
    );
  }

  const progressPercent = Math.round((campaign.approvedCount / campaign.contentCount) * 100);

  return (
    <div className="glass rounded-2xl p-6 sm:p-7 relative overflow-hidden border border-border/80 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
            Campaign Blueprint
          </span>
        </div>
        <span className="text-xs font-mono text-[var(--color-accent)] font-medium">
          {campaign.status}
        </span>
      </div>

      {/* Main Info */}
      <div className="space-y-4">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-medium text-foreground">
            {campaign.title}
          </h3>
          <p className="text-xs sm:text-sm text-foreground-soft mt-1 leading-relaxed">
            {campaign.summary}
          </p>
        </div>

        {/* Objective & Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-border/60 bg-background/40 p-3.5">
            <span className="text-[0.65rem] uppercase text-foreground-faint tracking-wider font-medium">
              Core Objective
            </span>
            <div className="mt-1 font-medium text-foreground leading-snug">
              {campaign.objective}
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/40 p-3.5">
            <span className="text-[0.65rem] uppercase text-foreground-faint tracking-wider font-medium">
              Target Audience
            </span>
            <div className="mt-1 font-medium text-foreground leading-snug">
              {campaign.audience}
            </div>
          </div>
        </div>

        {/* Content Progress Bar */}
        <div className="rounded-xl border border-border/60 bg-surface/50 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Content Readiness</span>
            <span className="text-foreground-faint font-mono">
              {campaign.approvedCount} of {campaign.contentCount} approved ({progressPercent}%)
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-border/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[0.68rem] text-foreground-faint flex items-center gap-1.5 pt-1">
            <span>Next item:</span>
            <span className="text-foreground font-medium">{campaign.nextScheduledItem}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t border-border/50 pt-4 flex justify-end">
          <button
            onClick={() => onReviewCampaign(campaign)}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all shadow-2xs group cursor-pointer"
          >
            <span>Review campaign</span>
            <ArrowRight className="h-3.5 w-3.5 text-background group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
