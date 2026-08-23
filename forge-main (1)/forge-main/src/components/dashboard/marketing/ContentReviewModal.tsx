import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, FileText, ArrowRight, Clock, Send, Sparkles } from 'lucide-react';
import { ContentDraft, ContentStatus } from './types';

interface ContentReviewModalProps {
  draft: ContentDraft | null;
  onClose: () => void;
  onUpdateStatus: (draftId: string, newStatus: ContentStatus) => void;
}

export default function ContentReviewModal({
  draft,
  onClose,
  onUpdateStatus,
}: ContentReviewModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedBody, setEditedBody] = useState('');

  React.useEffect(() => {
    if (draft) {
      setEditedBody(draft.fullBody);
    }
  }, [draft]);

  if (!draft) return null;

  const handleAction = (status: ContentStatus) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onUpdateStatus(draft.id, status);
      onClose();
    }, 450);
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
              <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
                {draft.channel} Staging
              </span>
              <span className="text-foreground-faint/40">·</span>
              <span className="rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 text-[0.68rem] text-[var(--color-accent)] font-mono font-medium">
                {draft.status}
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
                {draft.title}
              </h2>
              <p className="mt-1 text-xs text-foreground-soft font-medium">
                Author: {draft.author} · Target Window: {draft.scheduledFor || 'Embargo Launch'}
              </p>
            </div>

            {/* Strategic Pillars */}
            <div className="space-y-2">
              <div className="text-[0.68rem] uppercase tracking-wider text-foreground-faint font-medium">
                Key Narrative Themes
              </div>
              <ul className="space-y-1.5">
                {draft.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-foreground-soft">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Draft Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-foreground">
                  Draft Copy
                </label>
                <span className="text-[0.68rem] text-foreground-faint font-mono">
                  {editedBody.length} characters
                </span>
              </div>
              <textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                rows={7}
                className="w-full rounded-xl border border-border/80 bg-background/50 p-4 font-sans text-xs sm:text-sm text-foreground leading-relaxed focus:border-[var(--color-accent)] focus:outline-none"
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
              {draft.status !== 'Scheduled' && draft.status !== 'Published' && (
                <button
                  onClick={() => handleAction('Scheduled')}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground-soft hover:text-foreground hover:bg-surface transition-all"
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>Stage for Embargo</span>
                </button>
              )}

              <button
                onClick={() => handleAction('Published')}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all shadow-xs"
              >
                {isSubmitting ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Approve & Publish</span>
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
