import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function FinancialInsight() {
  return (
    <div className="glass rounded-2xl p-6 sm:p-7 relative overflow-hidden border border-border/80 shadow-xs">
      {/* Editorial Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-finance)]" />
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
            Intelligent Insight
          </span>
        </div>
        <span className="text-[0.68rem] text-foreground-faint font-mono">
          Updated Today
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="font-display text-lg sm:text-xl text-foreground font-medium leading-snug">
          Current spending pace gives the company approximately 14.8 months of runway.
        </h3>
        <p className="text-xs sm:text-[0.85rem] text-foreground-soft leading-relaxed">
          At an average net burn of <strong className="text-foreground font-medium">$19.2K/month</strong> and recent customer revenue growth of <strong className="text-foreground font-medium">+8.4%</strong>, your capital buffer safely extends beyond Q4 next year without requiring outside bridge capital.
        </p>
      </div>

      {/* Actionable synthesis bullets */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border/40 pt-4">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-[var(--color-finance)] shrink-0 mt-0.5" />
          <div className="text-xs text-foreground-soft">
            <span className="font-medium text-foreground">Zero high-risk variances:</span> Operating expenses remained within 3.2% of target budget.
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-[var(--color-finance)] shrink-0 mt-0.5" />
          <div className="text-xs text-foreground-soft">
            <span className="font-medium text-foreground">Payroll coverage:</span> Next 6 payroll cycles fully reserved in primary operating account.
          </div>
        </div>
      </div>
    </div>
  );
}
