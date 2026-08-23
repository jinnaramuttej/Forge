import React from 'react';
import { useForge } from '../../context/ForgeContext';
import { ArrowUpRight } from 'lucide-react';

interface TopSnapshotProps {
  onNavigateToFinance?: () => void;
  onNavigateToHiring?: () => void;
}

export default function TopSnapshot({
  onNavigateToFinance,
  onNavigateToHiring,
}: TopSnapshotProps) {
  const { finance, roles, candidates } = useForge();

  const activeCandidatesInFinal = candidates.filter(
    (c) => c.stage === 'final' || c.stage === 'offer'
  ).length;

  const metrics = [
    {
      id: 'cash',
      label: 'Cash Reserves',
      value: finance.cash,
      subtext: 'Reconciled via Mercury',
      tag: 'Live Sync',
      dotColor: 'var(--color-finance)',
      onClick: onNavigateToFinance,
    },
    {
      id: 'burn',
      label: 'Monthly Net Burn',
      value: finance.monthlyBurn,
      subtext: 'Revenue offset: +$42.8k',
      tag: '-4.2% MoM',
      dotColor: undefined,
      onClick: onNavigateToFinance,
    },
    {
      id: 'runway',
      label: 'Calculated Runway',
      value: finance.runway.replace(' months', ' mo'),
      subtext: 'Target horizon: 18 mo',
      tag: 'Healthy',
      dotColor: 'var(--color-finance)',
      onClick: onNavigateToFinance,
    },
    {
      id: 'roles',
      label: 'Open Positions',
      value: String(roles.length),
      subtext: `${activeCandidatesInFinal} candidates in final stage`,
      tag: 'Active Loops',
      dotColor: 'var(--color-hiring)',
      onClick: onNavigateToHiring,
    },
  ];

  return (
    <section aria-label="Company snapshot" className="w-full border-y border-border/80 py-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-border/60">
        {metrics.map((metric, idx) => {
          const isClickable = !!metric.onClick;
          return (
            <div
              key={metric.id}
              onClick={() => {
                if (metric.onClick) metric.onClick();
              }}
              className={`pt-4 first:pt-0 sm:pt-0 lg:pl-6 first:lg:pl-0 space-y-1.5 transition-colors ${
                isClickable ? 'cursor-pointer group' : ''
              }`}
            >
              {/* Header: Dot & Label */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {metric.dotColor && (
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: metric.dotColor }}
                    />
                  )}
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground-faint truncate group-hover:text-foreground transition-colors">
                    {metric.label}
                  </span>
                </div>

                <span className="text-[0.68rem] font-medium text-emerald-700 dark:text-emerald-500">
                  {metric.tag}
                </span>
              </div>

              {/* Large Editorial Value */}
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-2xl sm:text-3xl text-foreground font-semibold tracking-tight group-hover:text-[var(--color-accent)] transition-colors">
                  {metric.value}
                </span>
                {isClickable && (
                  <ArrowUpRight className="h-3.5 w-3.5 text-foreground-faint group-hover:text-foreground transition-colors shrink-0" />
                )}
              </div>

              {/* Subtext */}
              <p className="text-xs text-foreground-soft truncate">
                {metric.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
