import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LegalInsight() {
  return (
    <div className="glass rounded-2xl p-6 sm:p-7 relative overflow-hidden border border-border/80 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-legal)]" />
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
            Governance Intelligence
          </span>
        </div>
        <span className="text-[0.68rem] text-foreground-faint font-mono">
          FORGE Legal
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="font-display text-lg sm:text-xl text-foreground font-medium leading-snug">
          Your NDA is ready for review.
        </h3>
        <p className="text-xs sm:text-[0.85rem] text-foreground-soft leading-relaxed">
          Foundry Group partner legal team countersigned the Delaware bilateral terms with standard trade secret carveouts. No high-risk lock-in provisions detected.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border/40 pt-4">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-[var(--color-legal)] shrink-0 mt-0.5" />
          <div className="text-xs text-foreground-soft">
            <span className="font-medium text-foreground">Term duration:</span> Standard 24-month confidentiality window.
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-[var(--color-legal)] shrink-0 mt-0.5" />
          <div className="text-xs text-foreground-soft">
            <span className="font-medium text-foreground">Audit verification:</span> Clean risk rating with full compliance logging.
          </div>
        </div>
      </div>
    </div>
  );
}
