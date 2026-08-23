import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

const easeOut = [0.22, 1, 0.36, 1] as const;

// Trend path — deliberately understated, drawn on scroll
const TREND_PATH =
  'M2 54 C 20 52, 34 58, 48 46 C 62 34, 70 44, 86 36 C 102 28, 112 34, 128 20 C 144 6, 156 14, 170 8';

function TrendChart({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 172 64" className="h-16 w-full sm:h-20" fill="none">
      <motion.path
        d={TREND_PATH}
        stroke="var(--color-finance)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeDasharray="0 1"
        pathLength={1}
        style={{ pathLength: progress }}
      />
      {/* faint baseline for editorial restraint, not a grid */}
      <line x1="2" y1="58" x2="170" y2="58" stroke="var(--color-border)" strokeWidth="1" />
    </svg>
  );
}

export default function Finance() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start 0.85', 'end 0.4'],
  });

  const chartProgress = useTransform(scrollYProgress, [0.15, 0.7], [0, 1]);
  const glassY = useTransform(scrollYProgress, [0, 1], [26, -14]);
  const illoY = useTransform(scrollYProgress, [0, 1], [10, -18]);
  const illoRotate = useTransform(scrollYProgress, [0, 1], [-1.5, 1]);

  return (
    <section
      id="finance"
      className="relative overflow-hidden bg-background-alt py-24 sm:py-32"
    >
      {/* extremely restrained paper-cut layer, no grid here to keep hierarchy singular */}
      <div
        className="pointer-events-none absolute -right-24 top-16 h-[520px] w-[520px] rounded-full opacity-[0.5]"
        style={{
          background:
            'radial-gradient(circle, rgba(82,115,90,0.06) 0%, rgba(82,115,90,0) 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-finance)' }} />
          <span className="text-xs tracking-[0.22em] text-foreground-soft uppercase">
            Finance · 01
          </span>
        </motion.div>

        {/* Asymmetric grid: copy left, illustration + glass overlap right */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-6">
          {/* Left — editorial copy */}
          <div className="flex flex-col justify-center lg:pr-6">
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.06 }}
              className="font-display text-balance text-[2.25rem] leading-[1.08] tracking-[-0.01em] text-foreground sm:text-[3rem] lg:text-[3.35rem]"
            >
              Know where
              <br />
              your company
              <br />
              <span className="italic text-foreground-soft">stands.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
              className="mt-7 max-w-sm text-[1.02rem] leading-relaxed text-foreground-soft"
            >
              Cash, burn and runway, always in view — without digging
              through spreadsheets or waiting on someone else's summary.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.32 }}
              className="mt-10 flex items-center gap-3 border-t border-foreground/10 pt-6"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-finance)' }}
              />
              <span className="text-sm text-foreground-faint">
                One clear view, updated as things move.
              </span>
            </motion.div>
          </div>

          {/* Right — illustration + overlapping glass UI, integrated not boxed */}
          <div
            ref={stageRef}
            className="relative flex min-h-[440px] items-center justify-center sm:min-h-[520px] lg:min-h-[560px]"
          >
            <motion.img
              style={{ y: illoY, rotate: illoRotate }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, ease: easeOut }}
              src="/illustrations/finance-founder.png"
              alt="Hand-drawn illustration of a founder looking upward thoughtfully at small floating financial marks, representing clarity about company finances."
              className="absolute bottom-0 left-0 w-[62%] max-w-[300px] select-none sm:max-w-[340px] lg:max-w-[380px]"
              draggable={false}
            />

            {/* Glass finance preview — floats overlapping the illustration's gaze */}
            <motion.div
              style={{ y: glassY }}
              initial={{ opacity: 0, y: 34, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.85, ease: easeOut, delay: 0.18 }}
              className="glass absolute top-[6%] right-[2%] z-10 w-[78%] max-w-[320px] rounded-xl p-5 shadow-[0_20px_50px_rgba(22,19,15,0.10)] sm:top-[10%] sm:right-[0%] sm:max-w-[360px] sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.68rem] tracking-[0.18em] text-foreground-faint uppercase">
                  Company overview
                </span>
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-finance)' }}
                />
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <div className="text-[0.7rem] text-foreground-faint">Cash</div>
                  <div className="font-display text-[1.7rem] leading-none text-foreground sm:text-[1.9rem]">
                    $284.5K
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[0.7rem] text-foreground-faint">Runway</div>
                  <div className="text-[1.1rem] leading-none text-foreground">
                    14.8<span className="text-[0.75rem] text-foreground-faint"> mo</span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <TrendChart progress={chartProgress} />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-foreground/10 pt-3.5">
                <span className="text-[0.72rem] text-foreground-faint">Monthly burn</span>
                <span className="text-[0.85rem] font-medium text-foreground">$19.2K</span>
              </div>
            </motion.div>

            {/* tiny secondary glass fragment, understated depth cue */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.4 }}
              className="glass absolute bottom-[8%] right-[8%] z-[5] hidden items-center gap-2 rounded-full px-3.5 py-2 text-[0.72rem] text-foreground-soft sm:flex"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-finance)' }} />
              Updated 2 minutes ago
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
