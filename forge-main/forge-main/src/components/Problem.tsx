import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import {
  TrendingUp,
  UserRound,
  FileText,
  CheckSquare,
  Clock,
  type LucideIcon,
} from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

type ChipConfig = {
  icon: LucideIcon;
  label: string;
  sublabel: string;
  color: string;
  start: { left: string; top: string; rotate: number };
  end: { left: string; top: string };
  range: [number, number];
  mobile?: boolean;
};

const chips: ChipConfig[] = [
  {
    icon: TrendingUp,
    label: '$42,180',
    sublabel: 'Runway update',
    color: 'var(--color-finance)',
    start: { left: '4%', top: '10%', rotate: -11 },
    end: { left: '34%', top: '78%' },
    range: [0.05, 0.75],
    mobile: true,
  },
  {
    icon: UserRound,
    label: 'J. Alvarez',
    sublabel: 'Reviewing offer',
    color: 'var(--color-hiring)',
    start: { left: '78%', top: '6%', rotate: 9 },
    end: { left: '48%', top: '82%' },
    range: [0.1, 0.8],
    mobile: true,
  },
  {
    icon: FileText,
    label: 'NDA_v3.pdf',
    sublabel: 'Needs signature',
    color: 'var(--color-legal)',
    start: { left: '2%', top: '62%', rotate: 7 },
    end: { left: '62%', top: '80%' },
    range: [0.15, 0.85],
    mobile: true,
  },
  {
    icon: CheckSquare,
    label: 'Approve?',
    sublabel: 'Expense report',
    color: 'var(--color-accent)',
    start: { left: '84%', top: '58%', rotate: -8 },
    end: { left: '40%', top: '86%' },
    range: [0.2, 0.9],
  },
  {
    icon: Clock,
    label: 'Follow up',
    sublabel: 'Tuesday, 9am',
    color: 'var(--color-foreground-soft)',
    start: { left: '54%', top: '4%', rotate: 13 },
    end: { left: '56%', top: '86%' },
    range: [0.25, 0.95],
  },
];

function Chip({
  progress,
  config,
}: {
  progress: MotionValue<number>;
  config: ChipConfig;
}) {
  const { icon: Icon, label, sublabel, color, start, end, range } = config;
  const left = useTransform(progress, range, [start.left, end.left]);
  const top = useTransform(progress, range, [start.top, end.top]);
  const rotate = useTransform(progress, range, [start.rotate, 0]);
  const scale = useTransform(progress, range, [1, 0.88]);

  return (
    <motion.div
      style={{ left, top, rotate, scale }}
      className={`glass absolute z-10 flex w-[148px] -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-lg px-3 py-2.5 shadow-[0_8px_24px_rgba(22,19,15,0.08)] sm:w-[168px] ${
        config.mobile ? '' : 'hidden sm:flex'
      }`}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)` }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color }} strokeWidth={1.75} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-[0.8rem] font-medium text-foreground">
          {label}
        </span>
        <span className="truncate text-[0.68rem] text-foreground-faint">
          {sublabel}
        </span>
      </span>
    </motion.div>
  );
}

export default function Problem() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start 0.85', 'end 0.45'],
  });

  const markerOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);
  const markerScale = useTransform(scrollYProgress, [0.7, 1], [0.6, 1]);
  const lineHeight = useTransform(scrollYProgress, [0.75, 1], ['0%', '100%']);

  return (
    <section
      id="why-forge"
      className="relative overflow-hidden bg-background-alt py-24 sm:py-32"
    >
      <div
        className="bg-fine-grid pointer-events-none absolute inset-0"
        style={{
          maskImage:
            'radial-gradient(ellipse 65% 60% at 60% 35%, black 5%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 65% 60% at 60% 35%, black 5%, transparent 72%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Editorial heading block */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-foreground/30" />
          <span className="text-xs tracking-[0.22em] text-foreground-soft uppercase">
            The problem
          </span>
        </motion.div>

        <div className="max-w-2xl">
          <h2 className="font-display text-balance text-[2.25rem] leading-[1.08] tracking-[-0.01em] text-foreground sm:text-[3rem] lg:text-[3.5rem]">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.75, ease: easeOut }}
              className="block"
            >
              Building a company is one job.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.75, ease: easeOut, delay: 0.12 }}
              className="block italic text-foreground-soft"
            >
              Managing everything around it is another.
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.24 }}
            className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-foreground-soft"
          >
            Founders rarely stall from lack of vision. They stall from
            everything spinning around it.
          </motion.p>
        </div>

        {/* Visual stage — chaos converging toward order on scroll */}
        <div
          ref={stageRef}
          className="relative mt-16 h-[480px] sm:mt-20 sm:h-[560px] lg:h-[680px]"
        >
          {/* paper-cut layered sheets behind the illustration */}
          <div
            className="absolute top-1/2 left-1/2 h-[62%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-[2px] border border-border bg-surface/80 sm:left-[58%]"
            style={{ transform: 'translate(-50%, -50%) rotate(-3deg)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 h-[58%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-[2px] border border-border bg-background/70 sm:left-[58%]"
            style={{ transform: 'translate(-50%, -50%) rotate(2.5deg)' }}
          />

          {/* founder illustration, asymmetrically placed */}
          <motion.img
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: easeOut }}
            src="/illustrations/problem-chaos.png"
            alt="Hand-drawn illustration of a founder surrounded by scattered financial charts, candidate profiles, documents, an approval stamp, a clipboard and a ringing phone — representing operational chaos."
            className="absolute top-1/2 left-1/2 z-[5] w-[78%] max-w-[440px] -translate-x-1/2 -translate-y-1/2 select-none sm:left-[58%] sm:w-[64%] sm:max-w-[480px] lg:max-w-[520px]"
            draggable={false}
          />

          {chips.map((chip) => (
            <Chip key={chip.label} progress={scrollYProgress} config={chip} />
          ))}

          {/* convergence marker — the point everything settles toward */}
          <motion.div
            style={{ opacity: markerOpacity, scale: markerScale }}
            className="absolute bottom-[6%] left-1/2 z-[6] flex -translate-x-1/2 flex-col items-center gap-3"
          >
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-[0.7rem] tracking-[0.18em] text-foreground-faint uppercase italic">
              finding its place
            </span>
          </motion.div>
        </div>

        {/* transition cue toward the next section */}
        <div className="mt-4 flex flex-col items-center gap-3 sm:mt-6">
          <div className="relative h-14 w-px bg-foreground/10">
            <motion.div
              style={{ height: lineHeight }}
              className="absolute top-0 left-0 w-px bg-foreground/40"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
