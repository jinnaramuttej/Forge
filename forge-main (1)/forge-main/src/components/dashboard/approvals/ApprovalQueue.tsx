import React, { useState } from 'react';
import { ArrowRight, Filter, Search, CheckCircle2, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { ApprovalItem, ApprovalDepartment } from './types';

interface ApprovalQueueProps {
  items: ApprovalItem[];
  selectedId: string | null;
  onSelect: (item: ApprovalItem) => void;
  onQuickApprove: (item: ApprovalItem, e: React.MouseEvent) => void;
}

const departmentBadges: Record<ApprovalDepartment, { text: string; bg: string; dot: string }> = {
  legal: {
    text: 'text-[var(--color-legal)]',
    bg: 'bg-[var(--color-legal)]/10 border-[var(--color-legal)]/20',
    dot: 'bg-[var(--color-legal)]',
  },
  hiring: {
    text: 'text-[var(--color-hiring)]',
    bg: 'bg-[var(--color-hiring)]/10 border-[var(--color-hiring)]/20',
    dot: 'bg-[var(--color-hiring)]',
  },
  marketing: {
    text: 'text-[var(--color-accent)]',
    bg: 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/20',
    dot: 'bg-[var(--color-accent)]',
  },
  finance: {
    text: 'text-[var(--color-finance)]',
    bg: 'bg-[var(--color-finance)]/10 border-[var(--color-finance)]/20',
    dot: 'bg-[var(--color-finance)]',
  },
};

export default function ApprovalQueue({
  items,
  selectedId,
  onSelect,
  onQuickApprove,
}: ApprovalQueueProps) {
  const [filterDepartment, setFilterDepartment] = useState<'all' | ApprovalDepartment>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter((item) => {
    const matchesDept = filterDepartment === 'all' || item.department === filterDepartment;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.departmentLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header controls: Filter tabs & quick search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border/50">
        {/* Department Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterDepartment('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filterDepartment === 'all'
                ? 'bg-foreground text-background shadow-xs'
                : 'text-foreground-soft hover:bg-foreground/[0.04] hover:text-foreground'
            }`}
          >
            All Pending ({items.length})
          </button>

          {(['legal', 'hiring', 'marketing', 'finance'] as ApprovalDepartment[]).map((dept) => {
            const count = items.filter((i) => i.department === dept).length;
            if (count === 0 && filterDepartment !== dept) return null;
            return (
              <button
                key={dept}
                onClick={() => setFilterDepartment(dept)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs capitalize transition-colors ${
                  filterDepartment === dept
                    ? 'bg-foreground text-background font-medium shadow-xs'
                    : 'text-foreground-soft hover:bg-foreground/[0.04] hover:text-foreground'
                }`}
              >
                <span>{dept}</span>
                <span
                  className={`text-[0.68rem] px-1 rounded ${
                    filterDepartment === dept
                      ? 'bg-background/20 text-background'
                      : 'bg-foreground/[0.06] text-foreground-faint'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-faint" />
          <input
            type="text"
            placeholder="Filter queue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/70 bg-surface/50 pl-8 pr-3 py-1 text-xs text-foreground placeholder:text-foreground-faint/70 focus:border-foreground/40 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Queue items list */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-surface/30 p-12 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950/10 text-emerald-800 mb-3">
            <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h3 className="font-display text-lg text-foreground font-medium">All caught up</h3>
          <p className="mt-1 text-xs text-foreground-soft max-w-sm mx-auto">
            {items.length === 0
              ? 'There are no pending actions requiring your decision right now. FORGE is operating smoothly.'
              : 'No pending items match the selected filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isSelected = selectedId === item.id;
            const badge = departmentBadges[item.department] || departmentBadges.legal;

            return (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className={`group relative rounded-xl border transition-all duration-200 cursor-pointer p-4 sm:p-5 ${
                  isSelected
                    ? 'border-foreground/50 bg-surface shadow-md ring-1 ring-foreground/20'
                    : 'border-border/80 bg-surface/50 hover:border-foreground/25 hover:bg-surface hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    {/* Top Row: Department subtle badge + status + time */}
                    <div className="flex flex-wrap items-center gap-2 text-[0.72rem]">
                      {/* Department pill */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium ${badge.bg} ${badge.text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                        {item.departmentLabel}
                      </span>

                      <span className="text-foreground-faint/60">·</span>

                      {/* Action tag */}
                      <span className="text-foreground-faint font-medium">
                        {item.action}
                      </span>

                      <span className="text-foreground-faint/60">·</span>

                      {/* Time & status */}
                      <span className="inline-flex items-center gap-1 text-foreground-faint">
                        <Clock className="h-3 w-3" strokeWidth={1.5} />
                        {item.timeAgo}
                      </span>

                      <span className="rounded bg-foreground/[0.05] px-1.5 py-0.2 text-[0.68rem] text-foreground-soft">
                        {item.statusLabel}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-base sm:text-lg text-foreground font-medium leading-snug group-hover:text-foreground transition-colors">
                      {item.title}
                    </h3>

                    {/* Short description */}
                    <p className="text-xs sm:text-[0.82rem] text-foreground-soft leading-relaxed line-clamp-2">
                      {item.shortDescription}
                    </p>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center pt-2 sm:pt-0">
                    <button
                      onClick={(e) => onQuickApprove(item, e)}
                      title="Quick approve without detailed inspection"
                      className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-xs text-foreground-soft hover:bg-emerald-950/5 hover:text-emerald-800 hover:border-emerald-700/30 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(item);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-foreground text-background shadow-xs'
                          : 'bg-foreground/[0.06] text-foreground hover:bg-foreground hover:text-background'
                      }`}
                    >
                      <span>Review</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
