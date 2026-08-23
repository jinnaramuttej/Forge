import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import {
  Terminal,
  Cpu,
  LayoutDashboard,
  Zap,
} from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

type PromptSample = {
  type: 'prompt';
  content: string;
  tags: string[];
};

type EnginesSample = {
  type: 'engines';
  items: { name: string; state: string }[];
};

type SynthesisSample = {
  type: 'synthesis';
  items: { label: string; status: string }[];
};

type ImpactSample = {
  type: 'impact';
  action: string;
  note: string;
};

type StepSample = PromptSample | EnginesSample | SynthesisSample | ImpactSample;

interface PipelineStep {
  step: string;
  layer: string;
  title: string;
  description: string;
  icon: typeof Terminal;
  color: string;
  sample: StepSample;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: '01',
    layer: 'INPUT LAYER',
    title: 'Founder Intent & Directives',
    description: 'Provide plain-English instructions, upload raw term sheets, or trigger instant commands with ⌘K.',
    icon: Terminal,
    color: 'var(--color-finance)',
    sample: {
      type: 'prompt',
      content: 'Draft $150k SAFE note at $14M cap for Foundry and calculate runway delta',
      tags: ['Delaware YC SAFE', 'Monte Carlo Cash', 'Foundry Group'],
    },
  },
  {
    step: '02',
    layer: 'INTELLIGENCE LAYER',
    title: 'Multi-Model Domain Engines',
    description: 'Parallelizes execution across specialized legal covenants, actuarial treasury math, and ATS parsers.',
    icon: Cpu,
    color: 'var(--color-hiring)',
    sample: {
      type: 'engines',
      items: [
        { name: 'Legal Shield AI', state: 'Delaware Verified' },
        { name: 'Treasury Solver', state: '+3.2 mo Runway Delta' },
        { name: 'Talent Graph', state: 'Scorecard Aligned' },
      ],
    },
  },
  {
    step: '03',
    layer: 'SYNTHESIS LAYER',
    title: 'Live Operating Dashboard',
    description: 'Synthesizes complete, verified artifacts directly into your executive overview ready for review.',
    icon: LayoutDashboard,
    color: 'var(--color-legal)',
    sample: {
      type: 'synthesis',
      items: [
        { label: 'YC Post-Money SAFE', status: 'Draft Ready' },
        { label: 'Cash Inflow Model', status: '+$150,000' },
        { label: 'Cap Table Dilution', status: 'Verified' },
      ],
    },
  },
  {
    step: '04',
    layer: 'EXECUTION LAYER',
    title: '1-Click Executive Impact',
    description: 'You approve with one click. Documents are dispatched, bank balances reconcile, and team scales.',
    icon: Zap,
    color: 'var(--color-accent)',
    sample: {
      type: 'impact',
      action: 'Execute SAFE Note & Reconcile Account',
      note: 'Funds received · 0 hours lost in email threads',
    },
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.45'],
  });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden bg-background-alt py-24 sm:py-36 border-y border-border/40"
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
            Autonomous Architecture
          </span>
        </motion.div>

        {/* Header */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <h2 className="font-display text-balance text-3xl sm:text-4xl lg:text-[3.25rem] tracking-tight text-foreground font-medium leading-[1.12]">
            From natural founder intent
            <br />
            <span className="italic text-foreground-soft font-normal">
              to real-world corporate execution.
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-foreground-soft leading-relaxed font-normal">
            See how FORGE connects plain-English founder directives to deep domain AI models, live dashboard graphs, and definitive corporate actions.
          </p>
        </div>

        {/* Open 4-Stage Architectural Pipeline (Zero Clunky Card Boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
          {PIPELINE_STEPS.map((stage, idx) => {
            const Icon = stage.icon;
            const sample = stage.sample;
            return (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: easeOut, delay: idx * 0.1 }}
                className="pt-8 first:pt-0 lg:pt-0 lg:pl-8 first:lg:pl-0 space-y-5"
              >
                {/* Stage Number & Layer */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="font-mono text-sm font-bold tracking-wider"
                      style={{ color: stage.color }}
                    >
                      §{stage.step}
                    </span>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-foreground-faint">
                      {stage.layer}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-medium text-foreground leading-snug">
                    {stage.title}
                  </h3>
                </div>

                <p className="text-sm text-foreground-soft leading-relaxed">
                  {stage.description}
                </p>

                {/* Open Micro-Artifact Sample */}
                <div className="border-t border-border/80 pt-4 space-y-2 font-mono text-xs">
                  {sample.type === 'prompt' && (
                    <div className="space-y-2">
                      <p className="text-foreground font-sans font-medium text-xs leading-relaxed">
                        "{sample.content}"
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {sample.tags.map((t) => (
                          <span key={t} className="text-[0.68rem] text-foreground-faint">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {sample.type === 'engines' && (
                    <div className="space-y-1.5">
                      {sample.items.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-[0.72rem]">
                          <span className="text-foreground font-sans">{item.name}</span>
                          <span className="text-emerald-700 font-semibold">{item.state}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sample.type === 'synthesis' && (
                    <div className="space-y-1.5">
                      {sample.items.map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-[0.72rem]">
                          <span className="text-foreground font-sans">{item.label}</span>
                          <span className="text-foreground-soft font-semibold">{item.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sample.type === 'impact' && (
                    <div className="space-y-1">
                      <div className="text-foreground font-sans font-semibold text-xs text-emerald-700">
                        ✓ {sample.action}
                      </div>
                      <p className="text-[0.7rem] text-foreground-faint font-sans">
                        {sample.note}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global Continuous Autonomous Telemetry Ribbon (Open Borderless Style) */}
        <div className="mt-16 sm:mt-20 border-t border-border/80 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Continuous Autonomous Synchronization
            </span>
          </div>
          <p className="text-xs text-foreground-soft max-w-lg">
            Zero data silos · Verified Delaware C-Corp governance · Real-time runway recalculation with sub-second execution latency.
          </p>
        </div>
      </div>
    </section>
  );
}
