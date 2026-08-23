import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

interface FinalCTAProps {
  onEnterForge?: () => void;
}

export default function FinalCTA({ onEnterForge }: FinalCTAProps = {}) {
  return (
    <section
      id="enter"
      className="relative overflow-hidden bg-background py-24 sm:py-32 border-t border-border/60"
    >
      {/* Background Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(194,91,58,0.06) 0%, rgba(82,115,90,0.04) 50%, transparent 80%)',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 sm:px-8 text-center">
        {/* Editorial Brand Tag */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground-faint mb-8 shadow-2xs"
        >
          <Sparkles className="h-3 w-3 text-amber-600" />
          <span>Operational Clarity Awaits</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: easeOut, delay: 0.08 }}
          className="font-display text-balance text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground font-medium leading-[1.12]"
        >
          Spend less time managing.
          <br />
          <span className="italic text-foreground-soft font-normal">
            More time building what matters.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.16 }}
          className="mx-auto mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-foreground-soft font-normal"
        >
          One calm, unified operating system connecting cash runway, talent scorecards, and Delaware legal instruments.
        </motion.p>

        {/* Core Value Pillars Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.22 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-foreground-soft"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-border px-3 py-1.5 shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Zero spreadsheet friction</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-border px-3 py-1.5 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
            <span>Delaware C-Corp compliant</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-border px-3 py-1.5 shadow-2xs">
            <Zap className="h-3.5 w-3.5 text-amber-600" />
            <span>Instant 1-click approvals</span>
          </div>
        </motion.div>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          <a
            href="#enter"
            onClick={(e) => {
              if (onEnterForge) {
                e.preventDefault();
                onEnterForge();
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background hover:bg-foreground/90 transition-all shadow-md group cursor-pointer"
          >
            <span>Enter FORGE Portal</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>

          <a
            href="#preview"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-foreground/[0.04] transition-all cursor-pointer"
          >
            <span>Preview Live Workspace</span>
          </a>
        </motion.div>

        {/* Security & Access Subtitle */}
        <p className="mt-4 text-[0.72rem] text-foreground-faint">
          Live instant demo access enabled for startup founders and investors.
        </p>
      </div>
    </section>
  );
}
