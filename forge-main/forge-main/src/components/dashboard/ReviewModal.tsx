import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, FileText, UserCheck, Megaphone, ArrowRight, ShieldCheck } from 'lucide-react';
import { AttentionItem } from './types';

interface ReviewModalProps {
  item: AttentionItem | null;
  onClose: () => void;
  onApprove: (itemId: string, note?: string) => void;
}

export default function ReviewModal({
  item,
  onClose,
  onApprove,
}: ReviewModalProps) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const handleAction = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onApprove(item.id, note);
      onClose();
    }, 600);
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
          className="fixed inset-0 bg-foreground/30 backdrop-blur-xs"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 px-6 py-4 bg-background/50">
            <div className="flex items-center gap-2.5">
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
                {item.categoryLabel} Review
              </span>
              <span className="text-foreground-faint/40">·</span>
              <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[0.68rem] text-foreground-soft font-mono">
                {item.status}
              </span>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-foreground-faint hover:bg-foreground/[0.05] hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6">
            <div>
              <h2 className="font-display text-2xl text-foreground font-medium tracking-tight">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground-soft">
                {item.details.summary}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-border/70 bg-background/40 p-4">
              {item.details.metadata.map((meta, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-[0.68rem] uppercase tracking-wider text-foreground-faint">
                    {meta.label}
                  </span>
                  <span className="mt-0.5 text-xs font-medium text-foreground">
                    {meta.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Key verification checklist / points */}
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-foreground-faint mb-3">
                Key Considerations
              </div>
              <ul className="space-y-2">
                {item.details.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground-soft leading-relaxed">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground-faint" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Optional Founder Note */}
            <div>
              <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                Add founder instructions or signature note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Approved with standard 2-year confidentiality clause..."
                rows={2}
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-foreground-faint focus:border-foreground/30 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-border/70 bg-background/60 px-6 py-4">
            <button
              onClick={onClose}
              className="text-xs text-foreground-soft hover:text-foreground transition-colors px-3 py-2"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAction}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all duration-150 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Executing...
                  </>
                ) : (
                  <>
                    <span>{item.details.primaryAction}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
