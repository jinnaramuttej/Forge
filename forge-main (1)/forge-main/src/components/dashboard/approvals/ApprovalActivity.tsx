import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { CompletedApproval, ApprovalDepartment } from './types';

interface ApprovalActivityProps {
  completedItems: CompletedApproval[];
}

const departmentColors: Record<ApprovalDepartment, { text: string; bg: string }> = {
  legal: { text: 'text-[var(--color-legal)]', bg: 'bg-[var(--color-legal)]/10' },
  hiring: { text: 'text-[var(--color-hiring)]', bg: 'bg-[var(--color-hiring)]/10' },
  marketing: { text: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]/10' },
  finance: { text: 'text-[var(--color-finance)]', bg: 'bg-[var(--color-finance)]/10' },
};

export default function ApprovalActivity({ completedItems }: ApprovalActivityProps) {
  if (completedItems.length === 0) {
    return (
      <div className="rounded-2xl border border-border/70 bg-surface/30 p-5 text-center">
        <p className="text-xs text-foreground-faint">No completed approvals in this session yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-surface/30 p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-foreground-faint">
            Recently Completed Activity
          </span>
          <span className="rounded-full bg-foreground/[0.05] px-1.5 py-0.2 text-[0.65rem] font-mono text-foreground-faint">
            {completedItems.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[0.68rem] text-foreground-faint">
          <Clock className="h-3 w-3" strokeWidth={1.5} />
          <span>Audit Log</span>
        </div>
      </div>

      <div className="divide-y divide-border/40">
        {completedItems.map((item) => {
          const depStyle = departmentColors[item.department] || departmentColors.legal;
          const isApproved = item.decision === 'approved';

          return (
            <div
              key={item.id}
              className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors hover:bg-foreground/[0.01] rounded-lg px-1.5"
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                {/* Decision icon */}
                {isApproved ? (
                  <div className="mt-0.5 sm:mt-0 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-950/10 text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                  </div>
                ) : (
                  <div className="mt-0.5 sm:mt-0 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-950/10 text-rose-800">
                    <XCircle className="h-3.5 w-3.5" strokeWidth={2} />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-[0.82rem] font-medium text-foreground truncate">
                      {item.title}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-md px-1.5 py-0.2 text-[0.65rem] font-medium ${depStyle.bg} ${depStyle.text}`}
                    >
                      {item.departmentLabel}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="mt-0.5 text-[0.7rem] text-foreground-soft truncate">
                      Note: "{item.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Timestamp & Actor */}
              <div className="flex items-center gap-2 shrink-0 sm:text-right text-[0.7rem] text-foreground-faint pl-8 sm:pl-0">
                <span>{item.actor}</span>
                <span>·</span>
                <span>{item.decidedAt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
