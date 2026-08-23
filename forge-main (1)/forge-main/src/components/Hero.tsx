import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';

const fragments = [
  { label: 'Finance', color: 'var(--color-finance)', className: 'top-[6%] left-[2%] sm:left-[4%]' },
  { label: 'Hiring', color: 'var(--color-hiring)', className: 'top-[2%] right-[4%] sm:right-[8%]' },
  { label: 'Legal', color: 'var(--color-legal)', className: 'bottom-[10%] right-[0%] sm:right-[2%]' },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

interface HeroProps {
  onEnterForge?: () => void;
}

export default function Hero({ onEnterForge }: HeroProps = {}) {
  return (
    <section
      id="top"
      className="bg-grain relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      {/* ambient texture */}
      <div
        className="bg-dot-grid pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 55% at 50% 20%, black 10%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 20%, black 10%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-12">
        {/* Left column — editorial copy */}
        <div className="flex flex-col justify-center lg:pr-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="mb-7 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-foreground/30" />
            <span className="text-xs tracking-[0.22em] text-foreground-soft uppercase">
              For founders who build
            </span>
          </motion.div>

          <h1 className="font-display text-balance text-[2.75rem] leading-[1.04] tracking-[-0.01em] text-foreground sm:text-[3.6rem] lg:text-[4.35rem]">
            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.08 }}
              className="block"
            >
              Build the company.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
              className="block italic text-foreground-soft"
            >
              Not the chaos.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.34 }}
            className="mt-7 max-w-md text-[1.05rem] leading-relaxed text-foreground-soft"
          >
            FORGE brings the operational work behind a startup&nbsp;— finance,
            hiring, legal, and everything between — into one intelligent
            workspace. Less scattered tools. More building.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.46 }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <a
              href="#enter"
              onClick={(e) => {
                if (onEnterForge) {
                  e.preventDefault();
                  onEnterForge();
                }
              }}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-[0.95rem] text-background transition-colors duration-300 hover:bg-accent"
            >
              Enter FORGE
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="group inline-flex items-center gap-2 text-[0.95rem] text-foreground-soft transition-colors hover:text-foreground"
            >
              See how it works
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-16 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-foreground/10 pt-6"
          >
            <span className="text-xs tracking-[0.16em] text-foreground-faint uppercase">
              Unified inside FORGE
            </span>
            <div className="flex flex-wrap items-center gap-5">
              {fragments.map((f) => (
                <span key={f.label} className="inline-flex items-center gap-2 text-sm text-foreground-soft">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: f.color }}
                  />
                  {f.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column — hand-drawn illustration */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: easeOut, delay: 0.25 }}
            className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[560px] lg:-mr-6"
          >
            <motion.img
              src="/illustrations/hero-founder.png"
              alt="Hand-drawn illustration of a founder assembling the building blocks of a company, surrounded by sketches representing finance, hiring, and legal."
              className="w-full select-none"
              draggable={false}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* floating annotation tags echoing the illustration fragments */}
            {fragments.map((f, i) => (
              <motion.span
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.15 }}
                className={`glass absolute hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-foreground-soft sm:inline-flex ${f.className}`}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: f.color }} />
                {f.label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
