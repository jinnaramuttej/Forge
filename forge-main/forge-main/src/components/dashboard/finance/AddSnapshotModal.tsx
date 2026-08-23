import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, TrendingUp, Sparkles, DollarSign } from 'lucide-react';

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
  const [cash, setCash] = useState('284,500');
  const [monthlyBurn, setMonthlyBurn] = useState('19,200');
  const [monthlyRevenue, setMonthlyRevenue] = useState('42,800');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit({
        cash,
        monthlyBurn,
        monthlyRevenue,
        notes,
      });
      onClose();
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-foreground/25 backdrop-blur-xs"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 px-6 py-4 bg-background/50">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-finance)]" />
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
                Financial Snapshot
              </span>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-foreground-faint hover:bg-foreground/[0.05] hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
            <div>
              <h2 className="font-display text-xl text-foreground font-medium">
                Record Financial State
              </h2>
              <p className="mt-1 text-xs text-foreground-soft">
                Update liquid balances, burn rate, and revenue to recalculate current runway and runway projections.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                  Liquid Cash Balance ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-foreground-faint font-medium">
                    $
                  </span>
                  <input
                    type="text"
                    required
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface pl-8 pr-3.5 py-2.5 text-xs font-medium text-foreground focus:border-[var(--color-finance)] focus:outline-none"
                    placeholder="284,500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                    Net Monthly Burn ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-foreground-faint font-medium">
                      $
                    </span>
                    <input
                      type="text"
                      required
                      value={monthlyBurn}
                      onChange={(e) => setMonthlyBurn(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface pl-8 pr-3.5 py-2.5 text-xs font-medium text-foreground focus:border-[var(--color-finance)] focus:outline-none"
                      placeholder="19,200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                    Monthly Revenue ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-foreground-faint font-medium">
                      $
                    </span>
                    <input
                      type="text"
                      required
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface pl-8 pr-3.5 py-2.5 text-xs font-medium text-foreground focus:border-[var(--color-finance)] focus:outline-none"
                      placeholder="42,800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                  Context / Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-foreground-faint focus:border-[var(--color-finance)] focus:outline-none"
                  placeholder="e.g. End of month bank reconciliation with October customer prepayments..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-foreground-soft hover:text-foreground transition-colors px-2 py-1.5"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all duration-150 shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Recording...
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Save Snapshot</span>
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
