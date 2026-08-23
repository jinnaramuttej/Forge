import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

const easeOut = [0.22, 1, 0.36, 1] as const;

function StageConnector({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const width = useTransform(
    progress,
    [index * 0.35, index * 0.35 + 0.3],
    ['0%', '100%']
  );
  return (
    <div className="relative mx-1.5 h-px flex-1 bg-border">
      <motion.div
        className="absolute inset-y-0 left-0 bg-[var(--color-hiring)]"
        style={{ width }}
      />
    </div>
  );
}

type Candidate = {
  initials: string;
  name: string;
  role: string;
  skills: string;
  match: number;
  stage: 'New' | 'Shortlisted' | 'Interview';
};

const candidates: Candidate[] = [
  {
    initials: 'AK',
    name: 'Aisha Khan',
    role: 'Senior Frontend Engineer',
    skills: 'React · TypeScript · Design systems',
    match: 94,
    stage: 'Interview',
  },
  {
    initials: 'TD',
    name: 'Theo Dumas',
    role: 'Senior Frontend Engineer',
    skills: 'Next.js · WebGL · Performance',
    match: 88,
    stage: 'Shortlisted',
  },
  {
    initials: 'RS',
    name: 'Rina Suzuki',
    role: 'Senior Frontend Engineer',
    skills: 'Vue · Accessibility · Testing',
    match: 76,
    stage: 'New',
  },
];

const stages: Candidate['stage'][] = ['New', 'Shortlisted', 'Interview'];

export default function Hiring() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start 0.85', 'end 0.4'],
  });

  const illoY = useTransform(scrollYProgress, [0, 1], [14, -16]);
  const glassY = useTransform(scrollYProgress, [0, 1], [22, -10]);
  const rowProgress = useTransform(scrollYProgress, [0.2, 0.75], [0, 1]);

  return (
    <section
      id="hiring"
      className="relative overflow-hidden bg-background py-24 sm:py-32"
    >
      {/* faint organic paper-cut shape for depth, no grid to keep the humans central */}
      <div
        className="pointer-events-none absolute -left-32 top-24 h-[480px] w-[480px] rounded-full opacity-[0.55]"
        style={{
          background:
            'radial-gradient(circle, rgba(72,100,127,0.07) 0%, rgba(72,100,127,0) 70%)',
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
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-hiring)' }} />
          <span className="text-xs tracking-[0.22em] text-foreground-soft uppercase">
            Hiring · 02
          </span>
        </motion.div>

        {/* Copy block, left-aligned and narrower than Finance for visual distinction */}
        <div className="max-w-xl">
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.06 }}
            className="font-display text-balance text-[2.25rem] leading-[1.08] tracking-[-0.01em] text-foreground sm:text-[3rem] lg:text-[3.35rem]"
          >
            Build the
            <br />
            <span className="italic text-foreground-soft">right team.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
            className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-foreground-soft"
          >
            FORGE keeps hiring organized — surfacing the right candidates
            and helping promising people move forward, instead of getting
            lost across inboxes and spreadsheets.
          </motion.p>
        </div>

        {/* Composition: illustration prominent center/right, UI overlapping */}
        <div
          ref={stageRef}
          className="relative mt-16 flex min-h-[520px] items-center justify-center sm:mt-20 sm:min-h-[600px] lg:min-h-[640px]"
        >
          <motion.img
            style={{ y: illoY }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: easeOut }}
            src="/illustrations/hiring-team.png"
            alt="Hand-drawn illustration of three figures — one offering a card, one walking forward to receive it, and one welcoming with open arms on a small platform — representing people moving from opportunity into a team."
            className="absolute bottom-0 left-1/2 w-[92%] max-w-[560px] -translate-x-1/2 select-none sm:max-w-[640px] lg:max-w-[720px]"
            draggable={false}
          />

          {/* Glass hiring workflow, overlapping the scene near the top */}
          <motion.div
            style={{ y: glassY }}
            initial={{ opacity: 0, y: 34, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.85, ease: easeOut, delay: 0.16 }}
            className="glass absolute top-[2%] left-1/2 z-10 w-[92%] max-w-[420px] -translate-x-1/2 rounded-xl p-5 shadow-[0_20px_50px_rgba(22,19,15,0.10)] sm:top-[4%] sm:max-w-[460px] sm:p-6 lg:left-[8%] lg:translate-x-0"
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.68rem] tracking-[0.18em] text-foreground-faint uppercase">
                Senior Frontend Engineer
              </span>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-hiring)' }} />
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {candidates.map((c) => (
                <div key={c.initials} className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-medium text-white"
                    style={{ backgroundColor: 'var(--color-hiring)' }}
                  >
                    {c.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[0.82rem] font-medium text-foreground">
                        {c.name}
                      </span>
                      <span className="shrink-0 text-[0.72rem] text-foreground-faint">
                        {c.match}%
                      </span>
                    </div>
                    <span className="block truncate text-[0.7rem] text-foreground-faint">
                      {c.skills}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stage progression */}
            <div className="mt-5 flex items-center justify-between border-t border-foreground/10 pt-4">
              {stages.map((stage, i) => {
                const active = candidates.some((c) => c.stage === stage);
                return (
                  <div key={stage} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: active ? 'var(--color-hiring)' : 'var(--color-border)',
                        }}
                        initial={{ scale: 0.6, opacity: 0.5 }}
                        animate={
                          active
                            ? { scale: [0.6, 1.15, 1], opacity: 1 }
                            : { scale: 0.6, opacity: 0.5 }
                        }
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.18 }}
                      />
                      <span
                        className={`text-[0.62rem] tracking-wide uppercase ${
                          active ? 'text-foreground-soft' : 'text-foreground-faint'
                        }`}
                      >
                        {stage}
                      </span>
                    </div>
                    {i < stages.length - 1 && (
                      <StageConnector index={i} progress={rowProgress} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* small secondary glass fragment for depth, near the welcoming figure */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.42 }}
            className="glass absolute right-[4%] top-[28%] z-[5] hidden items-center gap-2 rounded-full px-3.5 py-2 text-[0.72rem] text-foreground-soft sm:flex lg:right-[10%] lg:top-[20%]"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-hiring)' }} />
            3 candidates moving forward
          </motion.div>
        </div>

        {/* closing line */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
          className="mt-14 flex items-center gap-3 border-t border-foreground/10 pt-6 sm:mt-16"
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-hiring)' }} />
          <span className="text-sm text-foreground-faint">
            From scattered candidates to a clearer path toward your team.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
