import React from 'react';

interface FinanceActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  amount?: string;
  isPositive?: boolean;
}

const defaultActivities: FinanceActivityItem[] = [
  {
    id: '1',
    title: 'Financial snapshot updated',
    description: 'Mercury cash balances & Stripe customer receipts auto-reconciled.',
    timestamp: 'Today, 10:42 AM',
  },
  {
    id: '2',
    title: 'Monthly burn adjusted',
    description: 'AWS compute reservations applied, lowering infrastructure overhead.',
    timestamp: 'Oct 21',
    amount: '-$1.4K/mo',
    isPositive: true,
  },
  {
    id: '3',
    title: 'Revenue recorded',
    description: 'Enterprise annual contract prepayment deposited into operating account.',
    timestamp: 'Oct 18',
    amount: '+$24.0K',
    isPositive: true,
  },
  {
    id: '4',
    title: 'Expense added',
    description: 'Q4 Delaware corporate legal counsel retainer invoice approved.',
    timestamp: 'Oct 14',
    amount: '-$3.5K',
    isPositive: false,
  },
];

interface FinanceActivityProps {
  activities?: FinanceActivityItem[];
}

export default function FinanceActivity({
  activities = defaultActivities,
}: FinanceActivityProps) {
  return (
    <section aria-labelledby="recent-finance-heading" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          id="recent-finance-heading"
          className="font-display text-lg sm:text-xl font-medium tracking-tight text-foreground"
        >
          Recent Financial Activity
        </h2>
        <span className="text-xs text-foreground-faint font-mono">
          Last 30 Days
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="rounded-2xl border border-border/70 bg-surface/40 p-5 sm:p-6 shadow-xs">
        <div className="relative space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border/60">
          {activities.map((item) => (
            <div key={item.id} className="relative flex items-start justify-between gap-4 pl-0 group">
              <div className="flex items-start gap-3.5 min-w-0">
                {/* Timeline node */}
                <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-surface bg-surface flex items-center justify-center relative z-10">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-finance)]" />
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-xs font-medium text-foreground">
                      {item.title}
                    </span>
                    <span className="text-[0.68rem] text-foreground-faint font-mono">
                      · {item.timestamp}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-foreground-soft leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Amount badge if present */}
              {item.amount && (
                <div className="shrink-0 text-right">
                  <span
                    className={`font-mono text-xs font-medium px-2 py-0.5 rounded-md ${
                      item.isPositive
                        ? 'text-[var(--color-finance)] bg-[var(--color-finance)]/10'
                        : 'text-foreground-soft bg-foreground/[0.04]'
                    }`}
                  >
                    {item.amount}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
