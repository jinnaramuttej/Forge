import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Megaphone } from 'lucide-react';

export default function MarketingInsight() {
  return (
    <div className="glass rounded-2xl p-6 sm:p-7 relative overflow-hidden border border-border/80 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
            Campaign Intelligence
          </span>
        </div>
        <span className="text-[0.68rem] text-foreground-faint font-mono">
          FORGE Engine
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="font-display text-lg sm:text-xl text-foreground font-medium leading-snug">
          Your Product Launch campaign has 4 pieces ready for review.
        </h3>
        <p className="text-xs sm:text-[0.85rem] text-foreground-soft leading-relaxed">
          The founder launch letter, press wire announcement, website landing update, and community release notes are coordinated for the Oct 28 embargo window.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border/40 pt-4">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-[var(--color-accent)] shrink-0 mt-0.5" />
          <div className="text-xs text-foreground-soft">
            <span className="font-medium text-foreground">Narrative coherence:</span> Copy reflects typography-first, calm product messaging.
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-[var(--color-accent)] shrink-0 mt-0.5" />
          <div className="text-xs text-foreground-soft">
            <span className="font-medium text-foreground">Launch readiness:</span> All 4 distribution channels verified and staged.
          </div>
        </div>
      </div>
    </div>
  );
}
