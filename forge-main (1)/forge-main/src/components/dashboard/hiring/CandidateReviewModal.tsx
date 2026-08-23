import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Building, GraduationCap, Sparkles, UserCheck } from 'lucide-react';
import { Candidate } from './types';

interface CandidateReviewModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  onAdvanceStage: (candidateId: string, action: 'offer' | 'advance' | 'reject') => void;
}

export default function CandidateReviewModal({
  candidate,
  onClose,
  onAdvanceStage,
}: CandidateReviewModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerNote, setOfferNote] = useState('');

  if (!candidate) return null;

  const handleAction = (action: 'offer' | 'advance' | 'reject') => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onAdvanceStage(candidate.id, action);
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
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-hiring)]" />
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
                Candidate Evaluation Loop
              </span>
              <span className="text-foreground-faint/40">·</span>
              <span className="rounded-full bg-[var(--color-hiring)]/10 px-2 py-0.5 text-[0.68rem] text-[var(--color-hiring)] font-mono font-medium">
                {candidate.matchScore}% Match
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
                {candidate.name}
              </h2>
              <p className="mt-1 text-sm text-foreground-soft">
                {candidate.roleTitle} · {candidate.experience}
              </p>
            </div>

            {/* Match synthesis */}
            <div className="rounded-xl border border-border/70 bg-background/50 p-4">
              <div className="text-[0.68rem] uppercase tracking-wider text-foreground-faint font-medium mb-1">
                FORGE Talent Assessment
              </div>
              <p className="text-xs text-foreground-soft leading-relaxed">
                {candidate.matchReason}
              </p>
            </div>

            {/* Background & Skills Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border/60 bg-surface/50 p-3">
                <span className="text-[0.65rem] uppercase text-foreground-faint tracking-wider">Company</span>
                <div className="mt-1 font-medium text-foreground">{candidate.currentCompany}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-surface/50 p-3">
                <span className="text-[0.65rem] uppercase text-foreground-faint tracking-wider">Education</span>
                <div className="mt-1 font-medium text-foreground">{candidate.education}</div>
              </div>
            </div>

            {/* Core Competencies */}
            <div>
              <div className="text-[0.68rem] uppercase tracking-wider text-foreground-faint font-medium mb-2">
                Validated Competencies
              </div>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg border border-border/70 bg-surface px-2.5 py-1 text-xs text-foreground-soft font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Founder Note / Offer terms */}
            <div>
              <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                Founder compensation notes or instructions (optional)
              </label>
              <textarea
                value={offerNote}
                onChange={(e) => setOfferNote(e.target.value)}
                placeholder="e.g. Standard $175K base + 0.85% equity package with standard 4-year vesting..."
                rows={2}
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-foreground-faint focus:border-[var(--color-hiring)] focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-border/70 bg-background/60 px-6 py-4">
            <button
              onClick={onClose}
              className="text-xs text-foreground-soft hover:text-foreground transition-colors px-2 py-1.5"
            >
              Close
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleAction('advance')}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground-soft hover:text-foreground hover:bg-surface transition-all"
              >
                <span>Advance Stage</span>
              </button>

              <button
                onClick={() => handleAction('offer')}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all shadow-xs"
              >
                {isSubmitting ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Approve & Issue Offer</span>
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
