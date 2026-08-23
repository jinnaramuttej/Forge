import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Check, FileClock } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

type Area = {
  code: string;
  name: string;
  tagline: string;
  color: string;
  position: string;
  align: 'left' | 'right';
  glass: React.ReactNode;
};

function Sparkline() {
  return (
    <svg viewBox="0 0 64 24" className="h-6 w-16" fill="none">
      <path
        d="M1 18 L11 14 L20 16 L29 8 L39 11 L49 4 L63 6"
        stroke="var(--color-finance)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const areas: Area[] = [
  {
    code: '01',
    name: 'FINANCE',
    tagline: 'Know where your company stands.',
    color: 'var(--color-finance)',
    position: 'lg:top-[2%] lg:left-[0%]',
    align: 'left',
    glass: (
      <div className="glass flex items-center gap-3 rounded-lg px-4 py-3">
        <Sparkline />
        <div className="flex flex-col leading-tight">
          <span className="text-[0.85rem] font-medium text-foreground">$186,400</span>
          <span className="text-[0.68rem] text-foreground-faint">14 months runway</span>
        </div>
      </div>
    ),
  },
  {
    code: '02',
    name: 'HIRING',
    tagline: 'Build the right team.',
    color: 'var(--color-hiring)',
    position: 'lg:top-[0%] lg:right-[0%]',
    align: 'right',
    glass: (
      <div className="glass flex items-center gap-3 rounded-lg px-4 py-3">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-medium text-white"
          style={{ backgroundColor: 'var(--color-hiring)' }}
        >
          MR
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-[0.85rem] font-medium text-foreground">Maya R.</span>
          <span className="text-[0.68rem] text-foreground-faint">Final round · Approve?</span>
        </div>
        <Check className="ml-1 h-4 w-4 shrink-0" style={{ color: 'var(--color-hiring)' }} strokeWidth={2} />
      </div>
    ),
  },
  {
    code: '03',
    name: 'LEGAL',
    tagline: 'Keep important work moving.',
    color: 'var(--color-legal)',
    position: 'lg:bottom-[4%] lg:right-[6%]',
    align: 'right',
    glass: (
      <div className="glass flex items-center gap-3 rounded-lg px-4 py-3">
        <FileClock className="h-7 w-7 shrink-0" style={{ color: 'var(--color-legal)' }} strokeWidth={1.6} />
        <div className="flex flex-col leading-tight">
          <span className="text-[0.85rem] font-medium text-foreground">NDA · Series Seed</span>
          <span className="text-[0.68rem] text-foreground-faint">Awaiting signature</span>
        </div>
      </div>
    ),
  },
];

function AreaBlock({ area, index }: { area: Area; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.75, ease: easeOut, delay: 0.1 + index * 0.12 }}
      className={`relative z-10 flex w-full max-w-[300px] flex-col gap-3 lg:absolute lg:w-[280px] ${area.position} ${
        area.align === 'right' ? 'lg:items-end lg:text-right' : 'lg:items-start lg:text-left'
      }`}
    >
      <div className={`flex items-center gap-2.5 ${area.align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: area.color }} />
        <span className="text-xs tracking-[0.2em] text-foreground-faint">{area.code}</span>
      </div>
      <h3 className="font-display text-2xl tracking-tight text-foreground sm:text-[1.75rem]">
        {area.name}
      </h3>
      <p className="text-[0.95rem] leading-snug text-foreground-soft">{area.tagline}</p>
      {area.glass}
    </motion.div>
  );
}

export default function Introducing() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start 0.8', 'end 0.5'],
  });

  const illoY = useTransform(scrollYProgress, [0, 1], [16, -10]);
  const illoRotate = useTransform(scrollYProgress, [0, 1], [-1.2, 0]);

  return (
    <section id="product" className="relative overflow-hidden bg-background py-24 sm:py-32">
      {/* faint structural grid, restrained */}
      <div
        className="bg-fine-grid pointer-events-none absolute inset-0 opacity-70"
        style={{
          maskImage: 'radial-gradient(ellipse 60% 55% at 50% 45%, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at 50% 45%, black 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-foreground/30" />
          <span className="text-xs tracking-[0.22em] text-foreground-soft uppercase">
            Introducing FORGE
          </span>
        </motion.div>

        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: easeOut, delay: 0.08 }}
            className="font-display text-balance text-[2.25rem] leading-[1.08] tracking-[-0.01em] text-foreground sm:text-[3rem] lg:text-[3.5rem]"
          >
            One place for the work
            <br />
            <span className="italic text-foreground-soft">behind the work.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.22 }}
            className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-foreground-soft"
          >
            FORGE brings the essential operational areas of building a
            startup into one connected workspace — without forcing founders
            to manage everything separately.
          </motion.p>
        </div>

        {/* Connected composition: illustration + three areas */}
        <div
          ref={stageRef}
          className="relative mt-20 flex flex-col items-center gap-14 lg:mt-24 lg:h-[760px] lg:block lg:gap-0"
        >
          {/* central illustration */}
          <motion.div
            style={{ y: illoY, rotate: illoRotate }}
            className="relative z-[2] w-full max-w-[340px] sm:max-w-[400px] lg:absolute lg:top-1/2 lg:left-1/2 lg:max-w-[440px] lg:-translate-x-1/2 lg:-translate-y-1/2"
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, ease: easeOut }}
              src="/illustrations/forge-system.png"
              alt="Hand-drawn illustration of a founder figure connected by flowing threads to three clusters representing finance, hiring and legal — visualizing FORGE bringing them into one system."
              className="w-full select-none"
              draggable={false}
            />
          </motion.div>

          {/* three connected areas, asymmetrically placed around the illustration */}
          {areas.map((area, i) => (
            <AreaBlock key={area.code} area={area} index={i} />
          ))}
        </div>

        {/* closing line reinforcing the unifying idea */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
          className="mt-16 flex items-center gap-3 border-t border-foreground/10 pt-8 sm:mt-20 lg:mt-10"
        >
          <ArrowUpRight className="h-4 w-4 text-foreground-faint" strokeWidth={1.75} />
          <span className="text-sm text-foreground-soft">
            Three areas. One coherent operating system.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
