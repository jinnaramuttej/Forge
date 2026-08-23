import React from 'react';
import { useForge } from '../../context/ForgeContext';

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
      label: 'Cash',
      value: finance.cash,
      detail: 'Reconciled',
      indicatorColor: 'var(--color-finance)',
      onClick: onNavigateToFinance,
    },
    {
      id: 'burn',
      label: 'Monthly Burn',
      value: finance.monthlyBurn,
      detail: 'Net burn',
      indicatorColor: undefined,
      onClick: onNavigateToFinance,
    },
    {
      id: 'runway',
      label: 'Runway',
      value: finance.runway.replace(' months', ' mo'),
      detail: 'Healthy',
      isGreenBadge: true,
      indicatorColor: 'var(--color-finance)',
      onClick: onNavigateToFinance,
    },
    {
      id: 'roles',
      label: 'Open Roles',
      value: String(roles.length),
      detail: `${activeCandidatesInFinal} final stage`,
      indicatorColor: 'var(--color-hiring)',
      onClick: onNavigateToHiring,
    },
  ];

  return (
    <section aria-label="Company snapshot" className="border-y border-border/80 bg-surface/30 py-4.5 sm:py-5">
      <div className="grid grid-cols-2 gap-y-4 gap-x-6 sm:grid-cols-4 sm:gap-x-8 lg:gap-x-12">
        {metrics.map((metric, idx) => {
          const isClickable = !!metric.onClick;
          return (
            <div
              key={metric.id}
              onClick={() => {
                if (metric.onClick) metric.onClick();
              }}
              className={`flex flex-col ${
                idx > 0 ? 'sm:border-l sm:border-border/60 sm:pl-6 lg:pl-8' : ''
              } ${isClickable ? 'cursor-pointer group' : ''}`}
            >
              {/* Label & Indicator */}
              <div className="flex items-center gap-2">
                {metric.indicatorColor && (
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: metric.indicatorColor }}
                  />
                )}
                <span className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-foreground-faint group-hover:text-foreground transition-colors">
                  {metric.label}
                </span>
              </div>

              {/* Metric Value & Detail */}
              <div className="mt-1.5 flex items-baseline gap-2.5">
                <span className="font-display text-2xl lg:text-[1.75rem] font-medium tracking-tight text-foreground group-hover:text-foreground">
                  {metric.value}
                </span>
                {metric.isGreenBadge ? (
                  <span className="inline-flex items-center rounded-full bg-[var(--color-finance)]/10 px-2 py-0.5 text-[0.68rem] font-medium text-[var(--color-finance)]">
                    {metric.detail}
                  </span>
                ) : (
                  <span className="text-xs text-foreground-faint">
                    {metric.detail}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
