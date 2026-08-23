import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  MessageSquare,
  Layers,
  ClipboardList,
  Eye,
  CheckCircle2,
} from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

type Step = {
  icon: React.ElementType;
  label: string;
  sublabel: string;
};

const steps: Step[] = [
  { icon: MessageSquare, label: 'Ask', sublabel: 'Describe what needs to happen' },
  { icon: Layers, label: 'Understand', sublabel: 'FORGE routes the request' },
  { icon: ClipboardList, label: 'Prepare', sublabel: 'Work is structured for you' },
  { icon: Eye, label: 'Review', sublabel: 'Check before it moves forward' },
  { icon: CheckCircle2, label: 'Done', sublabel: 'Approved and complete' },
];

const contextExamples = [
  { area: 'Finance', color: 'var(--color-finance)', text: '"How much runway do we have left?"' },
  { area: 'Hiring', color: 'var(--color-hiring)', text: '"Set up interviews for the frontend role"' },
  { area: 'Legal', color: 'var(--color-legal)', text: '"Prepare an NDA for the new partner"' },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.45'],
  });

  const lineProgress = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-24 sm:py-32"
    >
      {/* faint structural grid */}
      <div
        className="bg-fine-grid pointer-events-none absolute inset-0 opacity-50"
        style={{
          maskImage:
            'radial-gradient(ellipse 70% 50% at 50% 40%, black 0%, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 50% at 50% 40%, black 0%, transparent 70%)',
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
          <span className="h-px w-10 bg-foreground/30" />
          <span className="text-xs tracking-[0.22em] text-foreground-soft uppercase">
            How it works
          </span>
        </motion.div>

        {/* Header */}
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.06 }}
            className="font-display text-balance text-[2.25rem] leading-[1.08] tracking-[-0.01em] text-foreground sm:text-[3rem] lg:text-[3.5rem]"
          >
            Tell FORGE what
            <br />
            <span className="italic text-foreground-soft">
              needs to happen.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
            className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-foreground-soft"
          >
            Describe what you need. FORGE understands the request, directs it to
            the right area, and prepares the work for your review.
          </motion.p>
        </div>

        {/* Workflow — single connected visual */}
        <div className="relative mt-16 sm:mt-20">
          {/* Step progression */}
          <div className="relative flex flex-col gap-0 sm:flex-row sm:items-start sm:justify-between">
            {/* connecting line behind steps (desktop only) */}
            <div className="pointer-events-none absolute top-[22px] right-0 left-0 z-0 hidden sm:block">
              <div className="mx-auto h-px w-[calc(100%-80px)] bg-foreground/[0.08]">
                <motion.div
                  className="h-full origin-left bg-foreground/20"
                  style={{ scaleX: lineProgress }}
                />
              </div>
            </div>

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.65,
                    ease: easeOut,
                    delay: 0.1 + i * 0.08,
                  }}
                  className="relative z-10 flex items-center gap-4 py-3 sm:flex-col sm:items-center sm:gap-3 sm:py-0"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-foreground/[0.08] bg-surface/80">
                    <Icon
                      className="h-[18px] w-[18px] text-foreground-soft"
                      strokeWidth={1.6}
                    />
                  </div>
                  <div className="sm:text-center">
                    <span className="block text-[0.88rem] font-medium text-foreground">
                      {step.label}
                    </span>
                    <span className="block text-[0.72rem] text-foreground-faint">
                      {step.sublabel}
                    </span>
                  </div>

                  {/* mobile connector line */}
                  {i < steps.length - 1 && (
                    <div className="absolute left-[21px] top-[52px] h-[calc(100%-8px)] w-px bg-foreground/[0.08] sm:hidden" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Contextual examples — small glass fragments */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.5 }}
            className="mt-14 flex flex-col gap-3 sm:mt-16 sm:flex-row sm:gap-4"
          >
            {contextExamples.map((ex) => (
              <div
                key={ex.area}
                className="glass flex flex-1 items-start gap-3 rounded-xl px-4 py-3.5"
              >
                <span
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: ex.color }}
                />
                <div>
                  <span className="block text-[0.72rem] font-medium tracking-wide text-foreground-faint uppercase">
                    {ex.area}
                  </span>
                  <span className="mt-0.5 block text-[0.88rem] italic text-foreground-soft">
                    {ex.text}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
