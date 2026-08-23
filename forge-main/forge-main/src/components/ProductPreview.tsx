import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  TrendingUp,
  UserRound,
  FileText,
  Search,
  Bell,
  ChevronRight,
  Check,
} from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

/* Small sparkline SVG */
function MiniSparkline({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 18" className="h-4 w-12" fill="none">
      <path
        d="M1 14 L8 11 L16 13 L24 7 L32 9 L40 3 L47 5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ProductPreviewProps {
  onEnterForge?: () => void;
}

export default function ProductPreview({ onEnterForge }: ProductPreviewProps = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'end 0.3'],
  });

  const browserY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const sidebarY = useTransform(scrollYProgress, [0, 1], [16, -8]);
  const mainY = useTransform(scrollYProgress, [0, 1], [24, -12]);

  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);

  return (
    <section
      id="preview"
      ref={sectionRef}
      className="relative overflow-hidden bg-background-alt py-24 sm:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-foreground/30" />
          <span className="text-xs tracking-[0.22em] text-foreground-soft uppercase">
            Product
          </span>
        </motion.div>

        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.06 }}
            className="font-display text-balance text-[2.25rem] leading-[1.08] tracking-[-0.01em] text-foreground sm:text-[3rem] lg:text-[3.5rem]"
          >
            Everything important.
            <br />
            <span className="italic text-foreground-soft">One place.</span>
          </motion.h2>
        </div>

        {/* Browser frame product preview */}
        <motion.div
          style={{ y: browserY }}
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: easeOut, delay: 0.18 }}
          className="mt-14 sm:mt-18"
        >
          {/* Browser chrome */}
          <div className="rounded-t-xl border border-b-0 border-foreground/[0.08] bg-surface/90 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/[0.12]" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/[0.08]" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/[0.08]" />
              </div>
              <div className="mx-auto flex h-6 w-[220px] items-center justify-center rounded-md bg-foreground/[0.04] text-[0.65rem] text-foreground-faint sm:w-[300px]">
                forge.app/workspace
              </div>
            </div>
          </div>

          {/* App body */}
          <div className="rounded-b-xl border border-foreground/[0.08] bg-surface/70 backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr]">
              {/* Sidebar */}
              <motion.div
                style={{ y: sidebarY }}
                className="hidden border-r border-foreground/[0.06] p-5 lg:block"
              >
                <div className="font-display text-[1rem] tracking-tight text-foreground">
                  FORGE
                </div>

                <div className="mt-6 flex flex-col gap-1">
                  {[
                    { icon: Search, label: 'Search', active: false },
                    { icon: TrendingUp, label: 'Finance', active: false },
                    { icon: UserRound, label: 'Hiring', active: false },
                    { icon: FileText, label: 'Legal', active: false },
                    { icon: Bell, label: 'Activity', active: true },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.82rem] transition-colors duration-150 ${
                          item.active
                            ? 'bg-foreground/[0.06] text-foreground'
                            : 'text-foreground-faint hover:text-foreground-soft'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                        {item.label}
                      </div>
                    );
                  })}
                </div>

                {/* Clean system indicator */}
                <div className="mt-8 border-t border-foreground/[0.06] pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[0.72rem] text-foreground-soft font-medium">Online</span>
                  </div>
                  <span className="text-[0.65rem] font-mono text-foreground-faint">v1.0</span>
                </div>
              </motion.div>

              {/* Main content area */}
              <motion.div style={{ y: mainY }} className="p-5 sm:p-6 lg:p-8">
                {/* Welcome header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <div className="text-[0.72rem] text-foreground-faint">
                      Friday, March 14
                    </div>
                    <div className="mt-0.5 font-display text-[1.25rem] text-foreground">
                      Good morning, Sarah
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-foreground/[0.08] text-foreground-faint">
                      <Bell className="h-3.5 w-3.5" strokeWidth={1.6} />
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
                    </span>
                  </div>
                </div>

                {/* Panel grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Finance panel */}
                  <motion.div
                    onHoverStart={() => setHoveredPanel('finance')}
                    onHoverEnd={() => setHoveredPanel(null)}
                    animate={{
                      y: hoveredPanel === 'finance' ? -3 : 0,
                    }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="group rounded-xl border border-foreground/[0.06] bg-surface/50 p-4 transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(22,19,15,0.06)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: 'var(--color-finance)' }}
                        />
                        <span className="text-[0.68rem] tracking-wide text-foreground-faint uppercase">
                          Finance
                        </span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-foreground-faint opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <div className="font-display text-[1.4rem] leading-none text-foreground">
                          $284.5K
                        </div>
                        <div className="mt-1 text-[0.68rem] text-foreground-faint">
                          14.8 mo runway
                        </div>
                      </div>
                      <MiniSparkline color="var(--color-finance)" />
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-foreground/[0.05] pt-2.5">
                      <span className="text-[0.68rem] text-foreground-faint">
                        Burn
                      </span>
                      <span className="text-[0.78rem] font-medium text-foreground">
                        $19.2K
                        <span className="text-foreground-faint">/mo</span>
                      </span>
                    </div>
                  </motion.div>

                  {/* Hiring panel */}
                  <motion.div
                    onHoverStart={() => setHoveredPanel('hiring')}
                    onHoverEnd={() => setHoveredPanel(null)}
                    animate={{
                      y: hoveredPanel === 'hiring' ? -3 : 0,
                    }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="group rounded-xl border border-foreground/[0.06] bg-surface/50 p-4 transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(22,19,15,0.06)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: 'var(--color-hiring)' }}
                        />
                        <span className="text-[0.68rem] tracking-wide text-foreground-faint uppercase">
                          Hiring
                        </span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-foreground-faint opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      {[
                        { name: 'Aisha K.', stage: 'Interview', match: 94 },
                        { name: 'Theo D.', stage: 'Shortlisted', match: 88 },
                      ].map((c) => (
                        <div
                          key={c.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="flex h-5 w-5 items-center justify-center rounded-full text-[0.5rem] font-medium text-white"
                              style={{
                                backgroundColor: 'var(--color-hiring)',
                              }}
                            >
                              {c.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                            <span className="text-[0.78rem] text-foreground">
                              {c.name}
                            </span>
                          </div>
                          <span className="text-[0.68rem] text-foreground-faint">
                            {c.stage}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 border-t border-foreground/[0.05] pt-2.5">
                      <span className="text-[0.68rem] text-foreground-faint">
                        3 active roles · 8 candidates
                      </span>
                    </div>
                  </motion.div>

                  {/* Legal panel */}
                  <motion.div
                    onHoverStart={() => setHoveredPanel('legal')}
                    onHoverEnd={() => setHoveredPanel(null)}
                    animate={{
                      y: hoveredPanel === 'legal' ? -3 : 0,
                    }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="group rounded-xl border border-foreground/[0.06] bg-surface/50 p-4 transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(22,19,15,0.06)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: 'var(--color-legal)' }}
                        />
                        <span className="text-[0.68rem] tracking-wide text-foreground-faint uppercase">
                          Legal
                        </span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-foreground-faint opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="mt-3 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText
                            className="h-3.5 w-3.5"
                            style={{ color: 'var(--color-legal)' }}
                            strokeWidth={1.6}
                          />
                          <span className="text-[0.78rem] text-foreground">
                            NDA · Partner
                          </span>
                        </div>
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[0.6rem]"
                          style={{
                            backgroundColor:
                              'color-mix(in srgb, var(--color-legal) 12%, transparent)',
                            color: 'var(--color-legal)',
                          }}
                        >
                          Awaiting
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check
                            className="h-3.5 w-3.5 text-foreground-faint"
                            strokeWidth={1.6}
                          />
                          <span className="text-[0.78rem] text-foreground-faint">
                            SAFE · Series Seed
                          </span>
                        </div>
                        <span className="text-[0.6rem] text-foreground-faint">
                          Done
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 border-t border-foreground/[0.05] pt-2.5">
                      <span className="text-[0.68rem] text-foreground-faint">
                        1 pending approval
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Recent activity — very minimal */}
                <div className="mt-6 rounded-xl border border-foreground/[0.06] bg-surface/30 p-4">
                  <div className="text-[0.68rem] font-medium tracking-wide text-foreground-faint uppercase">
                    Recent
                  </div>
                  <div className="mt-3 flex flex-col gap-2.5">
                    {[
                      {
                        text: 'Runway updated to 14.8 months',
                        time: '2m ago',
                        color: 'var(--color-finance)',
                      },
                      {
                        text: 'Aisha Khan moved to final interview',
                        time: '1h ago',
                        color: 'var(--color-hiring)',
                      },
                      {
                        text: 'NDA ready for review',
                        time: '3h ago',
                        color: 'var(--color-legal)',
                      },
                    ].map((item) => (
                      <div
                        key={item.text}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="h-1 w-1 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[0.8rem] text-foreground-soft">
                            {item.text}
                          </span>
                        </div>
                        <span className="shrink-0 text-[0.68rem] text-foreground-faint">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
