import React from 'react';
import { ArrowRight, Scale, Users, Megaphone, FileText, CheckCircle2 } from 'lucide-react';
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
  const getCategoryColor = (cat: AttentionItem['category']) => {
    switch (cat) {
      case 'legal':
        return 'var(--color-legal)';
      case 'hiring':
        return 'var(--color-hiring)';
      case 'finance':
        return 'var(--color-finance)';
      case 'marketing':
        return 'var(--color-accent)';
      default:
        return 'var(--color-foreground)';
    }
  };

  return (
    <section aria-labelledby="needs-attention-heading" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2
            id="needs-attention-heading"
            className="font-display text-lg sm:text-xl font-medium tracking-tight text-foreground"
          >
            Needs Your Attention
          </h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/[0.07] font-mono text-[0.68rem] font-medium text-foreground">
            {items.length}
          </span>
        </div>

        {onViewAllApprovals && (
          <button
            onClick={onViewAllApprovals}
            className="text-xs text-foreground-soft hover:text-foreground transition-colors inline-flex items-center gap-1 group"
          >
            <span>Approvals queue</span>
            <ArrowRight className="h-3 w-3 text-foreground-faint group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Action items list */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-border/70 bg-surface/40 p-8 text-center">
          <CheckCircle2 className="mx-auto h-6 w-6 text-[var(--color-finance)]" />
          <p className="mt-2 text-xs font-medium text-foreground">All caught up</p>
          <p className="mt-0.5 text-[0.75rem] text-foreground-faint">
            No pending approvals or decisions required at this moment.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/60 rounded-xl border border-border/70 bg-surface/50 overflow-hidden shadow-xs">
          {items.map((item) => {
            const categoryColor = getCategoryColor(item.category);
            return (
              <div
                key={item.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 sm:p-5 hover:bg-surface transition-colors duration-150"
              >
                {/* Left info */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <span
                    className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: categoryColor }}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-foreground-faint">
                        {item.categoryLabel}
                      </span>
                      <span className="text-foreground-faint/40">·</span>
                      <span className="rounded-full bg-foreground/[0.05] px-2 py-0.5 text-[0.65rem] font-medium text-foreground-soft">
                        {item.status}
                      </span>
                    </div>

                    <h3 className="mt-1 text-[0.92rem] font-medium text-foreground leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-foreground-soft leading-normal">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center justify-end shrink-0 sm:pl-4">
                  <button
                    onClick={() => onReviewItem(item)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface px-3.5 py-1.5 text-xs font-medium text-foreground hover:border-foreground/30 hover:bg-foreground hover:text-background transition-all duration-150 group/btn shadow-2xs"
                  >
                    <span>{item.actionLabel || 'Review'}</span>
                    <ArrowRight className="h-3 w-3 text-foreground-faint group-hover/btn:text-background group-hover/btn:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
