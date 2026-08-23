import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Scale,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

interface SuiteTab {
  id: 'finance' | 'hiring' | 'legal';
  label: string;
  badge: string;
  icon: typeof TrendingUp;
  themeColor: string;
  themeBg: string;
  title: string;
  tagline: string;
  description: string;
  illustration: string;
  metrics: { label: string; value: string; detail: string }[];
  bulletPoints: string[];
}

const SUITE_TABS: SuiteTab[] = [
  {
    id: 'finance',
    label: 'Finance & Runway',
    badge: '01 · Treasury Engine',
    icon: TrendingUp,
    themeColor: 'var(--color-finance)',
    themeBg: 'rgba(82, 115, 90, 0.08)',
    title: 'Precision runway modeling.',
    tagline: 'Know your exact financial horizon without spreadsheets.',
    description:
      'FORGE continuously reconciles bank accounts, recurring customer revenue, and payroll projections to give founders real-time runway forecasting.',
    illustration: '/illustrations/finance-founder.png',
    metrics: [
      { label: 'Calculated Runway', value: '14.8 mo', detail: 'Healthy horizon' },
      { label: 'Liquid Reserves', value: '$284.5k', detail: 'Mercury reconciled' },
      { label: 'Net Monthly Burn', value: '$19.2k', detail: '-4.2% MoM' },
    ],
    bulletPoints: [
      'Automatic bank feed reconciliation (Mercury, SVB, Brex)',
      'Dynamic headcount scenario modeling',
      'One-click board financial memo export',
    ],
  },
  {
    id: 'hiring',
    label: 'Talent & Hiring',
    badge: '02 · Talent Architecture',
    icon: Users,
    themeColor: 'var(--color-hiring)',
    themeBg: 'rgba(194, 91, 58, 0.08)',
    title: 'Recruiting calibrated for burn rate.',
    tagline: 'Scale headcount without jeopardizing your runway.',
    description:
      'Every open role and candidate package is automatically simulated against your cash reserves before offer letters are prepared.',
    illustration: '/illustrations/hiring-team.png',
    metrics: [
      { label: 'Active Pipeline', value: '18 Candidates', detail: '4 in final round' },
      { label: 'Open Headcount', value: '4 Roles', detail: 'Benchmarked comp' },
      { label: 'Burn Impact', value: '-$12.5k/mo', detail: 'Per senior engineer' },
    ],
    bulletPoints: [
      'Unanimous team consensus scorecard tracking',
      'Pre-calculated salary & equity compensation bands',
      'Automated candidate offer generation',
    ],
  },
  {
    id: 'legal',
    label: 'Legal & Governance',
    badge: '03 · Delaware Shield',
    icon: Scale,
    themeColor: 'var(--color-legal)',
    themeBg: 'rgba(74, 93, 110, 0.08)',
    title: 'Delaware-grade compliance on autopilot.',
    tagline: 'Airtight contracts, IP assignments, and SAFE agreements.',
    description:
      'Eliminate expensive legal back-and-forth. FORGE drafts, reviews, and stores standardized Delaware agreements with zero deviation risk.',
    illustration: '/illustrations/legal-workflow.png',
    metrics: [
      { label: 'Executed Vault', value: '24 Docs', detail: '100% IP assigned' },
      { label: 'Pending Sign-off', value: '2 Agreements', detail: 'Foundry Group NDA' },
      { label: 'Risk Score', value: '0 Deviations', detail: 'Delaware standard' },
    ],
    bulletPoints: [
      'Instant bilateral NDAs and contractor work-for-hire',
      'Post-money valuation cap SAFE agreements',
      'Automated IP assignment verification',
    ],
  },
];

interface OperatingSuiteProps {
  onEnterForge?: () => void;
}

export default function OperatingSuite({ onEnterForge }: OperatingSuiteProps) {
  const [activeTabId, setActiveTabId] = useState<'finance' | 'hiring' | 'legal'>('finance');
  const currentTab = SUITE_TABS.find((t) => t.id === activeTabId) || SUITE_TABS[0];

  return (
    <section id="suite" className="relative bg-background py-24 sm:py-36">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-foreground/30" />
            <span className="text-xs font-semibold tracking-[0.22em] text-foreground-soft uppercase">
              Interactive Operating Suite
            </span>
          </div>
          <h2 className="font-display text-balance text-3xl sm:text-4xl lg:text-[3.25rem] text-foreground font-medium tracking-tight leading-[1.12]">
            Three vital engines.
            <br />
            <span className="italic text-foreground-soft font-normal">
              One unified OS.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-foreground-soft font-normal leading-relaxed">
            Switch between core company systems to explore how FORGE coordinates your startup's essential operations.
          </p>
        </div>

        {/* Open Segmented Sub-Navigation (Clean Hairline Underline) */}
        <div className="border-b border-border/80 pb-4 mb-12 flex items-center gap-3 overflow-x-auto">
          {SUITE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-foreground-soft hover:text-foreground hover:bg-foreground/[0.04]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display (Open Fluid Canvas, No Surrounding Box Card) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
          >
            {/* Left Column: Details & Metric Strips (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span
                  className="font-mono text-xs font-bold tracking-wider block mb-2"
                  style={{ color: currentTab.themeColor }}
                >
                  {currentTab.badge}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-foreground font-medium tracking-tight">
                  {currentTab.title}
                </h3>
                <p className="mt-2 text-base text-foreground font-medium">
                  {currentTab.tagline}
                </p>
                <p className="mt-3 text-sm sm:text-base text-foreground-soft leading-relaxed">
                  {currentTab.description}
                </p>
              </div>

              {/* Open Metric Row with Large Editorial Numerals */}
              <div className="border-t border-border/80 pt-6 grid grid-cols-3 gap-6">
                {currentTab.metrics.map((m, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[0.68rem] text-foreground-faint uppercase tracking-wider font-semibold block">
                      {m.label}
                    </span>
                    <span className="font-display text-2xl sm:text-3xl font-semibold text-foreground block">
                      {m.value}
                    </span>
                    <span className="text-xs text-foreground-soft block">
                      {m.detail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Open Checklist */}
              <div className="border-t border-border/80 pt-6 space-y-3">
                {currentTab.bulletPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-foreground-soft">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Action Trigger */}
              {onEnterForge && (
                <div className="pt-4">
                  <button
                    onClick={onEnterForge}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs sm:text-sm font-semibold text-background hover:bg-foreground/90 transition-all shadow-xs cursor-pointer group"
                  >
                    <span>Launch {currentTab.label} in FORGE</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Floating Visual Showcase (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <img
                src={currentTab.illustration}
                alt={currentTab.title}
                className="w-full max-w-[380px] h-auto select-none drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]"
                draggable={false}
              />

              <div className="mt-6 flex items-center gap-2 text-xs text-foreground-soft font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Operational Graph Synchronized</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
