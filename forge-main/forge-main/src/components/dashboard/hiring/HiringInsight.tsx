import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HiringInsight() {
  return (
    <div className="glass rounded-2xl p-6 sm:p-7 relative overflow-hidden border border-border/80 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-hiring)]" />
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
            Intelligent Sourcing Insight
          </span>
        </div>
        <span className="text-[0.68rem] text-foreground-faint font-mono">
          FORGE AI
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="font-display text-lg sm:text-xl text-foreground font-medium leading-snug">
          3 candidates strongly match the requirements for Senior Frontend Engineer.
        </h3>
        <p className="text-xs sm:text-[0.85rem] text-foreground-soft leading-relaxed">
          Aisha Khan and Theo Dumas have verified engineering backgrounds in high-performance web applications with 94%+ skill convergence on your current technical stack.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border/40 pt-4">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-[var(--color-hiring)] shrink-0 mt-0.5" />
          <div className="text-xs text-foreground-soft">
            <span className="font-medium text-foreground">Compensation fit:</span> All candidates align within the $170K–$185K Seed headcount model.
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-[var(--color-hiring)] shrink-0 mt-0.5" />
          <div className="text-xs text-foreground-soft">
            <span className="font-medium text-foreground">Interview consensus:</span> Zero veto flags recorded across all 4 interviewer scorecards.
          </div>
        </div>
      </div>
    </div>
  );
}
