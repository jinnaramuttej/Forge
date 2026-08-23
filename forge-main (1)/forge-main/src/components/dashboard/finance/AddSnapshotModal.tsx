import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Sparkles,
  RefreshCw,
  Landmark,
  ShieldAlert,
  Percent,
} from 'lucide-react';

interface AddSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    cash: string;
    monthlyBurn: string;
    monthlyRevenue: string;
    notes: string;
  }) => void;
}

export default function AddSnapshotModal({
  isOpen,
  onClose,
  onSubmit,
}: AddSnapshotModalProps) {
  const [cashNum, setCashNum] = useState<number>(284500);
  const [burnNum, setBurnNum] = useState<number>(19200);
  const [revNum, setRevNum] = useState<number>(42800);
  const [notes, setNotes] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Runway Calculation
  const netBurn = Math.max(burnNum - revNum, 1000);
  const calculatedRunwayMonths = useMemo(() => {
    if (netBurn <= 0) return 36;
    const months = (cashNum / netBurn).toFixed(1);
    return Math.min(parseFloat(months), 48);
  }, [cashNum, netBurn]);

  if (!isOpen) return null;

  const handleSimulateSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setCashNum(298400);
      setRevNum(45200);
      setNotes('Automated Mercury & Stripe sync verified on Oct 24, 2026.');
    }, 600);
  };

  const handleApplyPresetDelta = (type: 'cash' | 'burn' | 'rev', multiplier: number) => {
    if (type === 'cash') setCashNum((prev) => Math.round(prev * multiplier));
    if (type === 'burn') setBurnNum((prev) => Math.round(prev * multiplier));
    if (type === 'rev') setRevNum((prev) => Math.round(prev * multiplier));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit({
        cash: cashNum.toLocaleString(),
        monthlyBurn: burnNum.toLocaleString(),
        monthlyRevenue: revNum.toLocaleString(),
        notes: notes.trim() || `Runway calibrated to ${calculatedRunwayMonths} months.`,
      });
      onClose();
    }, 450);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-foreground/30 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-background-alt">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[var(--color-finance)]/10 border border-[var(--color-finance)]/20 flex items-center justify-center text-[var(--color-finance)]">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                    Treasury & Runway Calibration
                  </span>
                  <span className="rounded-full bg-[var(--color-finance)]/15 px-2 py-0.5 text-[0.65rem] font-medium text-[var(--color-finance)]">
                    Live Cash Forecasting
                  </span>
                </div>
                <p className="text-[0.72rem] text-foreground-soft">
                  Update liquid capital, monthly operating burn, and recurring revenue
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-foreground-faint hover:bg-foreground/[0.06] hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Bank Sync Bar */}
          <div className="px-6 pt-4 pb-1">
            <button
              type="button"
              onClick={handleSimulateSync}
              disabled={syncing}
              className="w-full flex items-center justify-between gap-3 rounded-xl border border-dashed border-[var(--color-finance)]/40 bg-[var(--color-finance)]/[0.04] px-3.5 py-2.5 text-xs text-foreground-soft hover:border-[var(--color-finance)] hover:bg-[var(--color-finance)]/[0.08] transition-all group"
            >
              <div className="flex items-center gap-2">
                <Landmark className="h-4 w-4 text-[var(--color-finance)] group-hover:scale-110 transition-transform" />
                <span className="font-medium text-foreground">
                  {syncing ? 'Fetching Live Mercury & Stripe Webhooks...' : 'Instant Sync from Mercury & Stripe'}
                </span>
              </div>
              <span className="text-[0.7rem] font-medium text-[var(--color-finance)] flex items-center gap-1">
                <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
              </span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-5">
            {/* Live Calculated Runway Hero Card */}
            <div className="rounded-xl border border-border bg-background-alt p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[0.7rem] uppercase tracking-[0.14em] text-foreground-faint block font-medium">
                  Live Runway Projection
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-display text-2xl sm:text-3xl text-foreground font-semibold">
                    {calculatedRunwayMonths}
                  </span>
                  <span className="text-xs text-foreground-soft font-medium">
                    Months Remaining
                  </span>
                </div>
                <span className="text-[0.72rem] text-emerald-700 font-medium block mt-1">
                  ✓ Healthy runway through late 2027
                </span>
              </div>

              <div className="w-full sm:w-48 space-y-1.5">
                <div className="flex justify-between text-[0.7rem] text-foreground-faint">
                  <span>Burn Rate Coverage</span>
                  <span className="font-mono">{((cashNum / (burnNum * 12)) * 100).toFixed(0)}% Target</span>
                </div>
                <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-finance)] rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(Number(calculatedRunwayMonths) * 4, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Inputs & Quick Adjusters */}
            <div className="space-y-4">
              {/* 1. Liquid Cash */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-foreground-soft">
                    Liquid Cash Reserves ($ USD) *
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleApplyPresetDelta('cash', 1.1)}
                      className="px-2 py-0.5 rounded-md border border-border text-[0.68rem] text-foreground-faint hover:text-foreground hover:bg-surface"
                    >
                      +10%
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashNum((c) => c + 100000)}
                      className="px-2 py-0.5 rounded-md border border-border text-[0.68rem] text-foreground-faint hover:text-foreground hover:bg-surface"
                    >
                      +$100k
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-foreground-faint font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    value={cashNum}
                    onChange={(e) => setCashNum(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-border bg-surface pl-8 pr-4 py-2.5 text-xs font-semibold text-foreground font-mono focus:border-[var(--color-finance)] focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Monthly Burn & Revenue in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-foreground-soft">
                      Gross Monthly Burn ($) *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetDelta('burn', 0.95)}
                      className="px-1.5 py-0.5 rounded border border-border text-[0.65rem] text-foreground-faint hover:text-foreground"
                    >
                      -5% Optimize
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-foreground-faint font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      required
                      value={burnNum}
                      onChange={(e) => setBurnNum(Number(e.target.value) || 0)}
                      className="w-full rounded-xl border border-border bg-surface pl-8 pr-4 py-2.5 text-xs font-semibold text-foreground font-mono focus:border-[var(--color-finance)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-foreground-soft">
                      Monthly Recurring Revenue ($)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetDelta('rev', 1.15)}
                      className="px-1.5 py-0.5 rounded border border-border text-[0.65rem] text-foreground-faint hover:text-foreground"
                    >
                      +15% Growth
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-foreground-faint font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      value={revNum}
                      onChange={(e) => setRevNum(Number(e.target.value) || 0)}
                      className="w-full rounded-xl border border-border bg-surface pl-8 pr-4 py-2.5 text-xs font-semibold text-foreground font-mono focus:border-[var(--color-finance)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Notes & Context */}
              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                  Reconciliation Notes & Assumptions
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Added Q4 customer receipts and AWS hosting optimization..."
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-foreground-faint focus:border-[var(--color-finance)] focus:outline-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs text-foreground-soft hover:text-foreground transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-all shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    <span>Recalibrating Runway...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Save Financial Snapshot</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
