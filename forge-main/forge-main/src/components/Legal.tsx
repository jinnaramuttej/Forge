import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

/* Faint simulated document lines — used inside the glass preview */
function DocLines({ count, stagger = 0 }: { count: number; stagger?: number }) {
  return (
    <div className="flex flex-col gap-[5px]">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            ease: easeOut,
            delay: stagger + i * 0.04,
          }}
          className="h-[3px] origin-left rounded-full bg-foreground/[0.07]"
          style={{ width: `${72 + Math.sin(i * 2.3) * 22}%` }}
        />
      ))}
    </div>
  );
}

export default function Legal() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start 0.85', 'end 0.4'],
  });

  const illoY = useTransform(scrollYProgress, [0, 1], [18, -14]);
  const illoRotate = useTransform(scrollYProgress, [0, 1], [1.2, -0.6]);
  const glassY = useTransform(scrollYProgress, [0, 1], [28, -12]);

  /* paper-cut layers parallax */
  const paper1Y = useTransform(scrollYProgress, [0, 1], [6, -4]);
  const paper2Y = useTransform(scrollYProgress, [0, 1], [12, -8]);
  const paper3Y = useTransform(scrollYProgress, [0, 1], [18, -12]);

  return (
    <section
      id="legal"
      className="bg-grain relative overflow-hidden bg-background-alt py-24 sm:py-32"
    >
      {/* extremely faint warm radial glow — legal amber, barely perceptible */}
      <div
        className="pointer-events-none absolute -left-20 bottom-20 h-[520px] w-[520px] rounded-full opacity-[0.45]"
        style={{
          background:
            'radial-gradient(circle, rgba(193,127,62,0.06) 0%, rgba(193,127,62,0) 70%)',
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
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: 'var(--color-legal)' }}
          />
          <span className="text-xs tracking-[0.22em] text-foreground-soft uppercase">
            Legal · 03
          </span>
        </motion.div>

        {/* Asymmetric grid: copy left, illustration + glass composition right */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          {/* Left — editorial copy */}
          <div className="flex flex-col justify-center lg:pr-8">
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.06 }}
              className="font-display text-balance text-[2.25rem] leading-[1.08] tracking-[-0.01em] text-foreground sm:text-[3rem] lg:text-[3.35rem]"
            >
              Keep important
              <br />
              work{' '}
              <span className="italic text-foreground-soft">moving.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
              className="mt-7 max-w-sm text-[1.02rem] leading-relaxed text-foreground-soft"
            >
              Prepare, review and approve essential documents without letting
              routine paperwork slow the company down. FORGE turns legal work
              into a clear flow — draft to done.
            </motion.p>

            {/* Workflow progression: Draft → Review → Approval */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.32 }}
              className="mt-10 flex items-center gap-3 border-t border-foreground/10 pt-6"
            >
              {['Draft', 'Review', 'Approval'].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          i === 2
                            ? 'var(--color-legal)'
                            : 'var(--color-foreground-faint)',
                      }}
                    />
                    <span
                      className={`text-sm ${
                        i === 2
                          ? 'text-foreground-soft'
                          : 'text-foreground-faint'
                      }`}
                    >
                      {step}
                    </span>
                  </span>
                  {i < 2 && (
                    <span className="h-px w-6 bg-foreground/10 sm:w-8" />
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — illustration + paper-cut layers + glass document preview */}
          <div
            ref={stageRef}
            className="relative flex min-h-[480px] items-center justify-center sm:min-h-[560px] lg:min-h-[600px]"
          >
            {/* Paper-cut layered sheets — strong paper-language here */}
            <motion.div
              style={{ y: paper3Y }}
              className="absolute top-[8%] right-[4%] h-[58%] w-[52%] rounded-[3px] border border-foreground/[0.06] sm:right-[8%]"
              initial={{ opacity: 0, rotate: 4 }}
              whileInView={{ opacity: 1, rotate: 4 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
            >
              <div className="h-full w-full rounded-[3px] bg-[#F0EBE0]" />
            </motion.div>

            <motion.div
              style={{ y: paper2Y }}
              className="absolute top-[12%] right-[8%] h-[56%] w-[50%] rounded-[3px] border border-foreground/[0.08] sm:right-[12%]"
              initial={{ opacity: 0, rotate: -2.5 }}
              whileInView={{ opacity: 1, rotate: -2.5 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.18 }}
            >
              <div className="h-full w-full rounded-[3px] bg-[#F4EFE4]" />
            </motion.div>

            <motion.div
              style={{ y: paper1Y }}
              className="absolute top-[15%] right-[12%] h-[54%] w-[48%] rounded-[3px] border border-foreground/[0.10] sm:right-[16%]"
              initial={{ opacity: 0, rotate: 1 }}
              whileInView={{ opacity: 1, rotate: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.25 }}
            >
              <div className="h-full w-full rounded-[3px] bg-surface/90" />
            </motion.div>

            {/* Hand-drawn illustration */}
            <motion.img
              style={{ y: illoY, rotate: illoRotate }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, ease: easeOut }}
              src="/illustrations/legal-workflow.png"
              alt="Hand-drawn illustration of a founder reviewing and organizing layered documents — a draft, a document under review, and an approved page — representing a clear legal workflow."
              className="absolute bottom-[2%] left-[0%] z-[3] w-[58%] max-w-[280px] select-none sm:max-w-[320px] lg:max-w-[360px]"
              draggable={false}
            />

            {/* Glass NDA document preview — the hero UI element */}
            <motion.div
              style={{ y: glassY }}
              initial={{ opacity: 0, y: 38, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.85, ease: easeOut, delay: 0.2 }}
              className="glass absolute top-[4%] right-[0%] z-10 w-[76%] max-w-[310px] rounded-xl p-5 shadow-[0_20px_50px_rgba(22,19,15,0.10)] sm:top-[8%] sm:right-[2%] sm:max-w-[340px] sm:p-6"
            >
              {/* Document header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText
                    className="h-4 w-4"
                    style={{ color: 'var(--color-legal)' }}
                    strokeWidth={1.75}
                  />
                  <span className="text-[0.68rem] tracking-[0.18em] text-foreground-faint uppercase">
                    Document
                  </span>
                </div>
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-legal)' }}
                />
              </div>

              {/* Document title */}
              <div className="mt-4">
                <h4 className="font-display text-[1.15rem] leading-tight text-foreground">
                  Non-Disclosure Agreement
                </h4>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[0.72rem] text-foreground-faint">
                    Status:
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.68rem] font-medium"
                    style={{
                      backgroundColor:
                        'color-mix(in srgb, var(--color-legal) 12%, transparent)',
                      color: 'var(--color-legal)',
                    }}
                  >
                    Awaiting approval
                  </span>
                </div>
              </div>

              {/* Document content preview — faint simulated lines */}
              <div className="mt-5 rounded-lg border border-foreground/[0.06] bg-surface/60 px-4 py-3.5">
                <div className="mb-2.5 text-[0.68rem] font-medium tracking-wide text-foreground/40 uppercase">
                  Preview
                </div>
                <DocLines count={5} stagger={0.5} />
                <div className="mt-3">
                  <DocLines count={3} stagger={0.7} />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center gap-3 border-t border-foreground/[0.08] pt-4">
                <button className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 px-3.5 py-1.5 text-[0.78rem] text-foreground-soft transition-colors duration-200 hover:border-foreground/20 hover:text-foreground">
                  Review
                </button>
                <button
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.78rem] font-medium text-white transition-opacity duration-200 hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-legal)' }}
                >
                  Approve
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>

            {/* Small secondary glass fragment for depth */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.45 }}
              className="glass absolute bottom-[10%] right-[6%] z-[5] hidden items-center gap-2 rounded-full px-3.5 py-2 text-[0.72rem] text-foreground-soft sm:flex"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-legal)' }}
              />
              2 documents ready for review
            </motion.div>
          </div>
        </div>

        {/* Closing line */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
          className="mt-14 flex items-center gap-3 border-t border-foreground/10 pt-6 sm:mt-16"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: 'var(--color-legal)' }}
          />
          <span className="text-sm text-foreground-faint">
            From scattered paperwork to a clear path forward.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
