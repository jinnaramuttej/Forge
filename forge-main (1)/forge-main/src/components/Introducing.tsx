import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, FileClock, ArrowRight } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

function Sparkline() {
  return (
    <svg viewBox="0 0 72 26" className="h-7 w-20" fill="none">
      <path
        d="M2 20 L14 15 L24 18 L34 8 L46 12 L58 4 L70 7"
        stroke="var(--color-finance)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Introducing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.4'],
  });

  const centerScale = useTransform(scrollYProgress, [0, 0.8], [0.95, 1]);

  return (
    <section
      id="product"
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-24 sm:py-36"
    >
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mb-4 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-foreground/30" />
          <span className="text-xs font-semibold tracking-[0.22em] text-foreground-soft uppercase">
            Introducing FORGE
          </span>
        </motion.div>

        {/* Header */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <h2 className="font-display text-balance text-3xl sm:text-4xl lg:text-[3.25rem] tracking-tight text-foreground font-medium leading-[1.12]">
            The single operating system for
            <br />
            <span className="italic text-foreground-soft font-normal">
              what happens behind the work.
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-foreground-soft leading-relaxed font-normal">
            Finance, hiring, and legal are deeply intertwined. In FORGE, when you adjust one, the others respond instantly.
          </p>
        </div>

        {/* Open, Fluid 3-Pillar Architectural Layout (Zero Box Borders) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: 01 · FINANCE (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-finance)]" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground-faint">
                  01 · FINANCE
                </span>
              </div>
              <h3 className="font-display text-2xl text-foreground font-medium">
                Know where your company stands.
              </h3>
              <p className="text-sm text-foreground-soft leading-relaxed">
                Automated bank cash reconciliation, burn acceleration tracking, and runway modeling without spreadsheets.
              </p>
            </div>

            {/* Open Metric Display */}
            <div className="border-t border-border/80 pt-4 flex items-center justify-between">
              <div>
                <span className="font-display text-3xl font-semibold text-foreground block">
                  $284,500
                </span>
                <span className="text-xs text-emerald-700 font-semibold mt-0.5 block">
                  14.8 months runway
                </span>
              </div>
              <Sparkline />
            </div>
          </motion.div>

          {/* Center Column: FORGE Core Graph Illustration (4 cols) */}
          <motion.div
            style={{ scale: centerScale }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col items-center justify-center text-center px-4"
          >
            <img
              src="/illustrations/forge-system.png"
              alt="FORGE central operating system diagram"
              className="w-full max-w-[320px] h-auto select-none opacity-95 drop-shadow-sm"
              draggable={false}
            />

            <div className="mt-4 flex items-center gap-2 text-xs text-foreground-soft font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Unified Graph Synced</span>
            </div>
          </motion.div>

          {/* Right Column: 02 · HIRING & 03 · LEGAL (4 cols) */}
          <div className="lg:col-span-4 space-y-10">
            {/* 02 · HIRING */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.15 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-hiring)]" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground-faint">
                  02 · HIRING
                </span>
              </div>
              <h4 className="font-display text-xl text-foreground font-medium">
                Build the right team.
              </h4>
              <p className="text-sm text-foreground-soft leading-relaxed">
                Structured candidate scorecards, compensation benchmarking, and offer packages aligned to your burn.
              </p>

              <div className="border-t border-border/80 pt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Aisha Khan · Staff Frontend</span>
                <span className="font-semibold text-emerald-700">4/4 Yes · Offer Ready</span>
              </div>
            </motion.div>

            {/* 03 · LEGAL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.25 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-legal)]" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground-faint">
                  03 · LEGAL
                </span>
              </div>
              <h4 className="font-display text-xl text-foreground font-medium">
                Keep important work moving.
              </h4>
              <p className="text-sm text-foreground-soft leading-relaxed">
                Standard Delaware governance, SAFE execution, and IP assignment covenants with zero deviation.
              </p>

              <div className="border-t border-border/80 pt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Mutual NDA · Series Seed</span>
                <span className="font-semibold text-[var(--color-legal)]">Ready to Execute</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
