import React from 'react';
import { ArrowRight, Bot, Eye, CheckCircle2, CheckSquare } from 'lucide-react';

export default function ApprovalWorkflowBar() {
  const steps = [
    {
      label: 'FORGE prepares',
      subtext: 'Autonomous agents draft & verify',
      icon: Bot,
    },
    {
      label: 'Founder reviews',
      subtext: 'Human-in-the-loop decision',
      icon: Eye,
      current: true,
    },
    {
      label: 'Approve / Reject',
      subtext: 'Executive sign-off & feedback',
      icon: CheckSquare,
    },
    {
      label: 'Completed',
      subtext: 'Executed to core company graph',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="rounded-2xl border border-border/70 bg-surface/40 p-4 sm:p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left ethos */}
        <div className="shrink-0 max-w-xs">
          <div className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-foreground-faint">
            Operating Model
          </div>
          <div className="mt-0.5 text-xs sm:text-sm font-medium text-foreground">
            FORGE does the work. <span className="text-foreground-soft font-normal">You stay in control.</span>
          </div>
        </div>

        {/* Minimal flow chain */}
        <div className="flex-1 flex flex-wrap sm:flex-nowrap items-center justify-start md:justify-end gap-2 sm:gap-3 text-xs">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            return (
              <React.Fragment key={step.label}>
                <div
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors ${
                    step.current
                      ? 'bg-foreground/[0.06] border border-border text-foreground font-medium'
                      : 'text-foreground-soft bg-surface/60 border border-border/40'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${step.current ? 'text-foreground' : 'text-foreground-faint'}`} strokeWidth={1.75} />
                  <span className="text-[0.78rem] whitespace-nowrap">{step.label}</span>
                </div>
                {!isLast && (
                  <ArrowRight className="h-3 w-3 shrink-0 text-foreground-faint/60 hidden sm:inline" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
