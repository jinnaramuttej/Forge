import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  TrendingDown,
  Users,
  FileSpreadsheet,
  Clock,
  ArrowRight,
} from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

const FRICTION_POINTS = [
  {
    num: '01',
    title: 'Spreadsheet Runway Drift',
    subtitle: 'Disconnected Bank & Stripe Feeds',
    description:
      'Manual CSV exports and stale sheets that become obsolete the instant a salary or cloud bill is paid. Founders operate in the dark on true runway.',
    color: 'var(--color-finance)',
  },
  {
    num: '02',
    title: 'Hiring Loop Fragmentation',
    subtitle: 'Candidate Dropped Context',
    description:
      'Interview feedback, compensation bands, and scorecards scattered across disparate Slack threads, notion docs, and email chains without consensus.',
    color: 'var(--color-hiring)',
  },
  {
    num: '03',
    title: 'Ad-hoc Legal Friction',
    subtitle: 'Deviations & Costly Retainers',
    description:
      'Paying $800/hr and waiting days for routine bilateral NDAs, contractor IP assignments, and SAFE agreements when speed is everything.',
    color: 'var(--color-legal)',
  },
  {
    num: '04',
    title: 'Operational Context Switching',
    subtitle: '14+ Critical Building Hours Lost',
    description:
      'Founders forced to constantly toggle between 9 enterprise SaaS tabs just to keep the administrative gears turning instead of shipping product.',
    color: 'var(--color-accent)',
  },
];

export default function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'end 0.45'],
  });

  const illustrationY = useTransform(scrollYProgress, [0, 1], [20, -15]);

  return (
    <section
      id="why-forge"
      ref={sectionRef}
      className="relative overflow-hidden bg-background-alt py-24 sm:py-36 border-t border-border/40"
    >
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Editorial Section Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mb-4 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-foreground/30" />
          <span className="text-xs font-semibold tracking-[0.22em] text-foreground-soft uppercase">
            The Fundamental Problem
          </span>
        </motion.div>

        {/* Section Headline */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <h2 className="font-display text-balance text-3xl sm:text-4xl lg:text-[3.25rem] tracking-tight text-foreground font-medium leading-[1.12]">
            Building a breakthrough company is one job.
            <br />
            <span className="italic text-foreground-soft font-normal">
              Managing the fragmented chaos around it is another.
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-foreground-soft leading-relaxed font-normal">
            Founders rarely struggle from lack of vision. They lose momentum because essential back-office operations are scattered across fragmented tools.
          </p>
        </div>

        {/* Fluid, Open Editorial Matrix (Zero Box Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: 4 Open Typographic Friction Rows (7 cols) */}
          <div className="lg:col-span-7 divide-y divide-border/60">
            {FRICTION_POINTS.map((item, idx) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: easeOut, delay: idx * 0.08 }}
                className="py-8 first:pt-0 last:pb-0"
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span
                    className="font-mono text-xs font-bold tracking-wider"
                    style={{ color: item.color }}
                  >
                    §{item.num}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-medium text-foreground tracking-tight">
                    {item.title}
                  </h3>
                </div>

                <div className="pl-7 space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-faint block">
                    {item.subtitle}
                  </span>
                  <p className="text-sm sm:text-base text-foreground-soft leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Floating Editorial Illustration & Resolution (5 cols) */}
          <motion.div
            style={{ y: illustrationY }}
            className="lg:col-span-5 sticky top-28 space-y-6 pt-4 lg:pt-0"
          >
            <div className="relative">
              <img
                src="/illustrations/problem-chaos.png"
                alt="Founder navigating operational friction"
                className="w-full max-w-[420px] mx-auto h-auto select-none opacity-90 drop-shadow-sm"
                draggable={false}
              />
            </div>

            {/* Seamless Editorial Resolution Note */}
            <div className="border-l-2 border-foreground/30 pl-5 space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                The FORGE Approach
              </span>
              <p className="text-xs sm:text-sm text-foreground-soft leading-relaxed">
                Connect finance, talent, and legal into a unified operational graph — turning days of administrative friction into instant approvals.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
