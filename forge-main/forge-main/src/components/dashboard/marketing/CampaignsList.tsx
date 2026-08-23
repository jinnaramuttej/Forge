import React from 'react';
import { Megaphone, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { Campaign, CampaignStatus } from './types';

interface CampaignsListProps {
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  onSelectCampaign: (campaignId: string | null) => void;
}

export default function CampaignsList({
  campaigns,
  selectedCampaignId,
  onSelectCampaign,
}: CampaignsListProps) {
  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
      case 'Scheduled':
        return 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/30';
      case 'Draft':
        return 'bg-foreground/[0.05] text-foreground-soft border-border/60';
      default:
        return 'bg-surface text-foreground-faint';
    }
  };

  return (
    <section aria-labelledby="campaigns-list-heading" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2
            id="campaigns-list-heading"
            className="font-display text-lg sm:text-xl font-medium tracking-tight text-foreground"
          >
            Campaigns
          </h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/[0.07] font-mono text-[0.68rem] font-medium text-foreground">
            {campaigns.length}
          </span>
        </div>

        {selectedCampaignId && (
          <button
            onClick={() => onSelectCampaign(null)}
            className="text-xs text-foreground-soft hover:text-foreground transition-colors"
          >
            Show all campaigns
          </button>
        )}
      </div>

      {/* Campaigns List */}
      <div className="divide-y divide-border/60 rounded-2xl border border-border/70 bg-surface/50 overflow-hidden shadow-xs">
        {campaigns.map((campaign) => {
          const isSelected = selectedCampaignId === campaign.id;
          return (
            <div
              key={campaign.id}
              onClick={() => onSelectCampaign(isSelected ? null : campaign.id)}
              className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'bg-foreground/[0.04] border-l-2 border-l-[var(--color-accent)]'
                  : 'hover:bg-surface'
              }`}
            >
              {/* Left Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-[0.92rem] font-medium text-foreground group-hover:text-foreground">
                    {campaign.title}
                  </h3>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-mono font-medium ${getStatusBadge(
                      campaign.status
                    )}`}
                  >
                    {campaign.status}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-soft">
                  <span>{campaign.contentCount} content pieces ({campaign.approvedCount} approved)</span>
                  <span className="text-foreground-faint/40">·</span>
                  <span className="text-foreground-faint">Target: {campaign.scheduledDate}</span>
                  <span className="text-foreground-faint/40 hidden sm:inline">·</span>
                  <span className="text-foreground-faint hidden sm:inline">{campaign.lastActivity}</span>
                </div>
              </div>

              {/* Right indicator */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className="text-[0.72rem] text-foreground-faint group-hover:text-foreground-soft transition-colors">
                  {isSelected ? 'Viewing' : 'Inspect'}
                </span>
                <ChevronRight
                  className={`h-4 w-4 text-foreground-faint transition-transform ${
                    isSelected ? 'rotate-90 text-foreground' : 'group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
