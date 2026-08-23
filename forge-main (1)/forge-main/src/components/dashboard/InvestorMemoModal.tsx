import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  Download,
  Share2,
  Printer,
  Sparkles,
  TrendingUp,
  Users,
  Scale,
  FileText,
  Mail,
  Building2,
} from 'lucide-react';
import { useForge } from '../../context/ForgeContext';

interface InvestorMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InvestorMemoModal({ isOpen, onClose }: InvestorMemoModalProps) {
  const { founder, startup, finance, roles, candidates, approvals, showToast } = useForge();
  const [copied, setCopied] = useState(false);
  const [activeFormat, setActiveFormat] = useState<'preview' | 'markdown' | 'email'>('preview');

  // Dynamic values
  const activeCandidatesCount = candidates.filter((c) => c.stage === 'final' || c.stage === 'offer').length;
  const currentMonth = 'October 2026';

  const memoHighlights = [
    `Cash Runway: ${finance.runway} at ${finance.monthlyBurn} net burn with $284.5k liquid reserves.`,
    `Revenue Trajectory: ${finance.monthlyRevenue} MRR (+8.4% MoM) driven by enterprise conversion.`,
    `Team Scaling: ${roles.length} active open roles with ${activeCandidatesCount} candidates in final offer loops.`,
    `Delaware Governance: All IP assignments, SAFE notes, and NDAs 100% executed and verified.`,
  ];

  const memoAsks = [
    'Introductions to Senior Full-Stack Engineers with React 19 & performance experience.',
    'Early customer intros for Series Seed design partners exploring automated founder operations.',
  ];

  const generatedMarkdown = `# ${startup.name} — Monthly Investor Update (${currentMonth})
**Founder**: ${founder.name} (${founder.email})
**Stage**: Seed Stage · Delaware C-Corp

---

### 📊 Executive Financial Snapshot
* **Liquid Cash Reserves**: ${finance.cash} (Mercury & SVB reconciled)
* **Monthly Net Burn**: ${finance.monthlyBurn}
* **Current Runway**: ${finance.runway} (Horizon: Healthy through late 2027)
* **Monthly Recurring Revenue**: ${finance.monthlyRevenue}

---

### 🚀 Key Highlights & Milestones
${memoHighlights.map((h) => `* ${h}`).join('\n')}

---

### 👥 Talent & Headcount
* **Open Roles**: ${roles.map((r) => r.title).join(', ')}
* **Active Candidates in Final Stage**: ${activeCandidatesCount} finalists

---

### 🤝 How Investors Can Help (Asks)
${memoAsks.map((a) => `* ${a}`).join('\n')}

---
*Generated autonomously via FORGE OS on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.*`;

  if (!isOpen) return null;

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Investor update copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto print:p-0">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-foreground/30 backdrop-blur-xs print:hidden"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-3xl rounded-3xl glass-modal overflow-hidden my-auto print:border-none print:shadow-none print:w-full print:max-w-none"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-background-alt/60 print:hidden">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-foreground text-background flex items-center justify-center font-semibold text-xs">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                    Investor Memo & Board Dispatch
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[0.65rem] font-medium text-emerald-700">
                    Live Graph Verified
                  </span>
                </div>
                <p className="text-[0.72rem] text-foreground-soft">
                  Autonomous executive summary generated from your company's live finance, hiring & legal ledger
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-foreground/[0.04] transition-colors"
                title="Print / Save as PDF"
              >
                <Printer className="h-3.5 w-3.5 text-foreground-soft" />
                <span>PDF Export</span>
              </button>

              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-foreground-faint hover:bg-foreground/[0.06] hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Format Switcher Tabs */}
          <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-border/60 bg-surface/50 print:hidden">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'preview', label: 'Executive Document View' },
                { id: 'markdown', label: 'Raw Markdown' },
                { id: 'email', label: 'Email Template' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setActiveFormat(fmt.id as any)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeFormat === fmt.id
                      ? 'bg-foreground text-background shadow-xs'
                      : 'text-foreground-soft hover:text-foreground hover:bg-foreground/[0.04]'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleCopyText(generatedMarkdown)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-foreground/[0.06] border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-foreground hover:text-background transition-all"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Update</span>
                </>
              )}
            </button>
          </div>

          {/* Memo Body Container */}
          <div className="p-6 sm:p-8 max-h-[68vh] overflow-y-auto space-y-6 print:max-h-none print:p-0">
            {activeFormat === 'preview' ? (
              <div className="rounded-2xl border border-border/80 bg-background-alt/50 p-6 sm:p-8 space-y-6 font-sans text-foreground shadow-2xs">
                {/* Memo Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-border pb-5">
                  <div>
                    <span className="text-[0.7rem] uppercase tracking-[0.2em] font-semibold text-foreground-faint block">
                      Founder Shareholder Memo
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-medium text-foreground mt-1">
                      {startup.name} — {currentMonth}
                    </h2>
                  </div>
                  <div className="text-left sm:text-right font-mono text-xs text-foreground-soft">
                    <span className="block font-semibold text-foreground">{founder.name}</span>
                    <span className="text-[0.72rem] text-foreground-faint">Delaware C-Corp · Series Seed</span>
                  </div>
                </div>

                {/* 1. Core Financial Metric Tiles */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-faint mb-3">
                    01 · Financial Vitals
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                    <div className="rounded-xl border border-border bg-surface p-3">
                      <span className="text-[0.68rem] text-foreground-faint uppercase block">Reserves</span>
                      <span className="text-base sm:text-lg font-bold text-foreground block mt-0.5">{finance.cash}</span>
                      <span className="text-[0.65rem] text-emerald-700 block mt-0.5 font-sans">Mercury Sync</span>
                    </div>

                    <div className="rounded-xl border border-border bg-surface p-3">
                      <span className="text-[0.68rem] text-foreground-faint uppercase block">Net Burn</span>
                      <span className="text-base sm:text-lg font-bold text-foreground block mt-0.5">{finance.monthlyBurn}</span>
                      <span className="text-[0.65rem] text-foreground-soft block mt-0.5 font-sans">-4.2% MoM</span>
                    </div>

                    <div className="rounded-xl border border-border bg-surface p-3">
                      <span className="text-[0.68rem] text-foreground-faint uppercase block">Runway</span>
                      <span className="text-base sm:text-lg font-bold text-foreground block mt-0.5">{finance.runway}</span>
                      <span className="text-[0.65rem] text-emerald-700 block mt-0.5 font-sans">Healthy Horizon</span>
                    </div>

                    <div className="rounded-xl border border-border bg-surface p-3">
                      <span className="text-[0.68rem] text-foreground-faint uppercase block">Monthly ARR</span>
                      <span className="text-base sm:text-lg font-bold text-foreground block mt-0.5">{finance.monthlyRevenue}</span>
                      <span className="text-[0.65rem] text-emerald-700 block mt-0.5 font-sans">+8.4% Growth</span>
                    </div>
                  </div>
                </div>

                {/* 2. Executive Highlights */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-faint mb-2.5">
                    02 · Operational Highlights
                  </h3>
                  <div className="space-y-2">
                    {memoHighlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[0.82rem] text-foreground-soft leading-relaxed">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Team Scaling */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-faint mb-2.5">
                    03 · Headcount & Talent Loops
                  </h3>
                  <div className="rounded-xl border border-border bg-surface p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between text-foreground">
                      <span className="font-semibold">Open Roles ({roles.length}):</span>
                      <span className="text-foreground-soft">{roles.map((r) => r.title).join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between text-foreground">
                      <span className="font-semibold">Candidate Pipeline:</span>
                      <span className="text-emerald-700 font-medium">{activeCandidatesCount} finalists advancing to offer package</span>
                    </div>
                  </div>
                </div>

                {/* 4. Current Asks */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-faint mb-2.5">
                    04 · How Investors Can Help (Asks)
                  </h3>
                  <div className="space-y-2">
                    {memoAsks.map((ask, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[0.82rem] text-foreground-soft leading-relaxed">
                        <span className="font-mono text-foreground font-bold shrink-0">{idx + 1}.</span>
                        <span>{ask}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="border-t border-border pt-4 text-xs text-foreground-faint flex items-center justify-between">
                  <span>Prepared with FORGE Autonomous Operating System</span>
                  <span className="font-mono">Security Hash: #FRG-2026-OCT-SEED</span>
                </div>
              </div>
            ) : activeFormat === 'markdown' ? (
              <div className="rounded-2xl border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap selection:bg-foreground selection:text-background">
                {generatedMarkdown}
              </div>
            ) : (
              /* Email Format */
              <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 font-sans text-xs sm:text-sm text-foreground">
                <div className="border-b border-border pb-3 space-y-1 text-xs text-foreground-soft">
                  <div><strong>To:</strong> Investors & Advisors Syndicate</div>
                  <div><strong>Subject:</strong> {startup.name} — Monthly Investor Update ({currentMonth})</div>
                </div>
                <div className="space-y-3 leading-relaxed text-foreground-soft">
                  <p>Hi team,</p>
                  <p>Here is our monthly update for {currentMonth}.</p>
                  <p><strong>Highlights:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    {memoHighlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                  <p><strong>Key Asks:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    {memoAsks.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                  <p>Best,<br />{founder.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-background-alt print:hidden">
            <span className="text-[0.72rem] text-foreground-soft flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Auto-refreshes when financial snapshot is updated</span>
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs text-foreground-soft hover:text-foreground transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleCopyText(generatedMarkdown)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-all shadow-xs"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy to Clipboard</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
