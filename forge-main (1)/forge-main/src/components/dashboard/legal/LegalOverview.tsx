import React from 'react';

interface LegalOverviewProps {
  activeCount?: number;
  awaitingReviewCount?: number;
  approvedCount?: number;
  expiringSoonCount?: number;
}

export default function LegalOverview({
  activeCount = 12,
  awaitingReviewCount = 3,
  approvedCount = 27,
  expiringSoonCount = 2,
}: LegalOverviewProps) {
  const metrics = [
    {
      id: 'active',
      label: 'Active Documents',
      value: activeCount.toString(),
      subtext: 'Executed & in governance',
      indicator: true,
    },
    {
      id: 'awaiting',
      label: 'Awaiting Review',
      value: awaitingReviewCount.toString(),
      subtext: 'Requires founder signoff',
      isReviewBadge: true,
      indicator: true,
    },
    {
      id: 'approved',
      label: 'Approved',
      value: approvedCount.toString(),
      subtext: 'Historical executed vault',
      indicator: false,
    },
    {
      id: 'expiring',
      label: 'Expiring Soon',
      value: expiringSoonCount.toString(),
      subtext: 'Annual renewals in 60d',
      indicator: false,
    },
  ];

  return (
    <section aria-label="Legal summary" className="border-y border-border/80 bg-surface/30 py-5 sm:py-6">
      <div className="grid grid-cols-2 gap-y-5 gap-x-6 sm:grid-cols-4 sm:gap-x-8 lg:gap-x-12">
        {metrics.map((m, idx) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              idx > 0 ? 'sm:border-l sm:border-border/60 sm:pl-6 lg:pl-8' : ''
            }`}
          >
            {/* Label */}
            <div className="flex items-center gap-2">
              {m.indicator && (
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-legal)] shrink-0" />
              )}
              <span className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-foreground-faint">
                {m.label}
              </span>
            </div>

            {/* Value */}
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="font-display text-2xl lg:text-[1.85rem] font-medium tracking-tight text-foreground">
                {m.value}
              </span>
              {m.isReviewBadge && (
                <span className="inline-flex items-center rounded-full bg-[var(--color-legal)]/10 px-2 py-0.5 text-[0.68rem] font-medium text-[var(--color-legal)]">
                  Action
                </span>
              )}
            </div>

            {/* Subtext */}
            <span className="mt-1 text-[0.75rem] text-foreground-soft leading-snug">
              {m.subtext}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
