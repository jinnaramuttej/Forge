import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, FileText, ArrowRight, ShieldCheck, Scale } from 'lucide-react';
import { LegalDocument } from './types';

interface LegalReviewModalProps {
  document: LegalDocument | null;
  onClose: () => void;
  onApprove: (docId: string, note?: string) => void;
  onReject: (docId: string, reason?: string) => void;
}

export default function LegalReviewModal({
  document,
  onClose,
  onApprove,
  onReject,
}: LegalReviewModalProps) {
  const [signatureNote, setSignatureNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!document) return null;

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onApprove(document.id, signatureNote);
      onClose();
    }, 550);
  };

  const handleReject = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onReject(document.id, signatureNote);
      onClose();
    }, 550);
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

        {/* Modal Window */}
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
              <span className="h-2 w-2 rounded-full bg-[var(--color-legal)]" />
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
                Legal Document Inspection
              </span>
              <span className="text-foreground-faint/40">·</span>
              <span className="rounded-full bg-[var(--color-legal)]/10 px-2 py-0.5 text-[0.68rem] text-[var(--color-legal)] font-mono font-medium">
                {document.status}
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
              <h2 className="font-display text-2xl font-medium text-foreground">
                {document.title}
              </h2>
              <p className="mt-1 text-xs text-foreground-soft font-medium">
                Party: {document.counterparty} · Governing Law: {document.governingLaw}
              </p>
            </div>

            {/* Document Brief */}
            <div className="rounded-xl border border-border/70 bg-background/50 p-4 text-xs text-foreground-soft leading-relaxed">
              <span className="font-medium text-foreground">Summary: </span>
              {document.summary}
            </div>

            {/* Clauses breakdown */}
            <div className="space-y-3">
              <div className="text-[0.68rem] uppercase tracking-wider text-foreground-faint font-medium">
                Full Clauses Breakdown
              </div>
              <div className="space-y-2.5">
                {document.clauses.map((cl, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-surface/60 p-3.5 text-xs">
                    <div className="font-medium text-foreground mb-1">
                      Clause {i + 1}: {cl.title}
                    </div>
                    <div className="text-foreground-soft leading-relaxed">
                      {cl.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature note */}
            <div>
              <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                Add founder signature note or redline reason (optional)
              </label>
              <textarea
                value={signatureNote}
                onChange={(e) => setSignatureNote(e.target.value)}
                placeholder="e.g. Countersigned on behalf of Acme Inc. under standard Delaware law provisions..."
                rows={2}
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-foreground-faint focus:border-[var(--color-legal)] focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-border/70 bg-background/60 px-6 py-4">
            <button
              onClick={onClose}
              className="text-xs text-foreground-soft hover:text-foreground transition-colors px-2 py-1.5"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2.5">
              {document.status === 'Awaiting Review' ? (
                <>
                  <button
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground-soft hover:bg-rose-50 hover:text-rose-800 hover:border-rose-200 transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Request Redlines</span>
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all shadow-xs"
                  >
                    {isSubmitting ? (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Sign & Approve</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
