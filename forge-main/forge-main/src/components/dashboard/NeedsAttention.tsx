import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { AttentionItem } from './types';

interface NeedsAttentionProps {
  items: AttentionItem[];
  onReviewItem: (item: AttentionItem) => void;
  onViewAllApprovals?: () => void;
}

export default function NeedsAttention({
  items,
  onReviewItem,
  onViewAllApprovals,
}: NeedsAttentionProps) {
  const getCategoryTheme = (cat: AttentionItem['category']) => {
    switch (cat) {
      case 'legal':
        return {
          dot: 'var(--color-legal)',
          badge: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
        };
      case 'hiring':
        return {
          dot: 'var(--color-hiring)',
          badge: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        };
      case 'finance':
        return {
          dot: 'var(--color-finance)',
          badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        };
      case 'marketing':
        return {
          dot: 'var(--color-accent)',
          badge: 'bg-sky-500/10 text-sky-700 border-sky-500/20',
        };
      default:
        return {
          dot: 'var(--color-foreground)',
          badge: 'bg-foreground/[0.06] text-foreground border-border',
        };
    }
  };

  return (
    <section aria-labelledby="needs-attention-heading" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2.5">
          <h2
            id="needs-attention-heading"
            className="font-display text-xl font-medium tracking-tight text-foreground"
          >
            Needs Your Attention
          </h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/[0.08] font-mono text-[0.68rem] font-bold text-foreground">
            {items.length}
          </span>
        </div>

        {onViewAllApprovals && (
          <button
            onClick={onViewAllApprovals}
            className="text-xs text-foreground-soft hover:text-foreground transition-colors inline-flex items-center gap-1 group font-medium cursor-pointer"
          >
            <span>Approvals queue</span>
            <ArrowRight className="h-3 w-3 text-foreground-faint group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Action items list (Open Divider Style, Zero Box Cards) */}
      {items.length === 0 ? (
        <div className="py-8 text-center">
          <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-700" />
          <p className="mt-2 text-xs font-semibold text-foreground">All caught up</p>
          <p className="mt-0.5 text-xs text-foreground-soft">
            No pending approvals or decisions required at this moment.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {items.map((item) => {
            const theme = getCategoryTheme(item.category);
            return (
              <div
                key={item.id}
                onClick={() => onReviewItem(item)}
                className="group py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-pointer"
              >
                {/* Left info */}
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: theme.dot }}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[0.65rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${theme.badge}`}>
                        {item.categoryLabel}
                      </span>
                      <span className="text-[0.7rem] text-foreground-faint font-mono">
                        {item.timeAgo}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-medium text-foreground tracking-tight group-hover:text-[var(--color-accent)] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-foreground-soft leading-normal">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="flex items-center gap-2 shrink-0 sm:self-center pl-5 sm:pl-0">
                  <span className="text-xs font-semibold text-foreground-soft bg-foreground/[0.04] px-3 py-1.5 rounded-xl border border-border group-hover:bg-foreground group-hover:text-background transition-all">
                    Review & Decide →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
