import React from 'react';

interface FinanceOverviewProps {
  cash: string;
  monthlyBurn: string;
  runway: string;
  monthlyRevenue: string;
}

export default function FinanceOverview({
  cash = '$284.5K',
  monthlyBurn = '$19.2K',
  runway = '14.8 months',
  monthlyRevenue = '$42.8K',
}: Partial<FinanceOverviewProps>) {
  const metrics = [
    {
      id: 'cash',
      label: 'Cash',
      value: cash,
      subtext: 'Reconciled · Mercury & SVB',
      indicator: true,
    },
    {
      id: 'burn',
      label: 'Monthly Burn',
      value: monthlyBurn,
      subtext: 'Net operational cash drain',
      indicator: false,
    },
    {
      id: 'runway',
      label: 'Runway',
      value: runway,
      subtext: 'Safe horizon through Q4 2027',
      isRunway: true,
      indicator: true,
    },
    {
      id: 'revenue',
      label: 'Monthly Revenue',
      value: monthlyRevenue,
      subtext: '+8.4% MRR growth MoM',
      indicator: false,
    },
  ];

  return (
    <section aria-label="Financial overview" className="border-y border-border/80 bg-surface/30 py-5 sm:py-6">
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
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-finance)] shrink-0" />
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
              {m.isRunway && (
                <span className="inline-flex items-center rounded-full bg-[var(--color-finance)]/10 px-2 py-0.5 text-[0.68rem] font-medium text-[var(--color-finance)]">
                  Healthy
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
