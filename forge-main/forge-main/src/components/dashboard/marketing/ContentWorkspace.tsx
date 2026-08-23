import React from 'react';
import { ArrowRight, FileText, CheckCircle2, Clock, Megaphone, Send } from 'lucide-react';
import { ContentDraft, ContentStatus } from './types';

interface ContentWorkspaceProps {
  drafts: ContentDraft[];
  selectedDraftId: string | null;
  onSelectDraft: (draft: ContentDraft) => void;
}

export default function ContentWorkspace({
  drafts,
  selectedDraftId,
  onSelectDraft,
}: ContentWorkspaceProps) {
  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'Ready for Review':
        return 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/30';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-800 border-blue-200/60';
      case 'Published':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
      case 'Draft':
        return 'bg-foreground/[0.05] text-foreground-soft border-border/60';
      default:
        return 'bg-surface text-foreground-faint';
    }
  };

  return (
    <section aria-labelledby="content-workspace-heading" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          id="content-workspace-heading"
          className="font-display text-lg sm:text-xl font-medium tracking-tight text-foreground"
        >
          Content Workspace
        </h2>
        <span className="text-xs text-foreground-faint font-mono">
          Editorial Staging
        </span>
      </div>

      {/* Drafts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {drafts.map((draft) => {
          const isSelected = selectedDraftId === draft.id;
          return (
            <div
              key={draft.id}
              onClick={() => onSelectDraft(draft)}
              className={`group flex flex-col justify-between rounded-2xl border p-5 cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'border-[var(--color-accent)] bg-surface shadow-xs ring-1 ring-[var(--color-accent)]/30'
                  : 'border-border/70 bg-surface/50 hover:border-foreground/25 hover:bg-surface'
              }`}
            >
              <div>
                {/* Channel & Status */}
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5 mb-3">
                  <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
                    {draft.channel}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-mono font-medium ${getStatusBadge(
                      draft.status
                    )}`}
                  >
                    {draft.status}
                  </span>
                </div>

                {/* Title & Excerpt */}
                <h3 className="font-display text-base font-medium text-foreground group-hover:text-foreground">
                  {draft.title}
                </h3>
                <p className="mt-1.5 text-xs text-foreground-soft leading-relaxed line-clamp-3">
                  {draft.excerpt}
                </p>
              </div>

              {/* Bottom Metadata */}
              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-[0.68rem] text-foreground-faint">
                <span>By {draft.author}</span>
                <span className="font-mono">Updated {draft.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
