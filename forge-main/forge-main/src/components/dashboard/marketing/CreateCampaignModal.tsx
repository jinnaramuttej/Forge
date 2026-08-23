import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Megaphone, Sparkles } from 'lucide-react';
import { Campaign } from './types';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaign: Omit<Campaign, 'id' | 'lastActivity' | 'contentCount' | 'approvedCount' | 'nextScheduledItem'>) => void;
}

export default function CreateCampaignModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateCampaignModalProps) {
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [audience, setAudience] = useState('Technical Founders & Early Adopters');
  const [scheduledDate, setScheduledDate] = useState('Nov 15, 2026');
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit({
        title: title.trim(),
        objective: objective.trim() || 'Drive product awareness and qualified user acquisition.',
        audience,
        status: 'Active',
        scheduledDate,
        summary: summary.trim() || `Strategic founder campaign focused on ${title.trim()}.`,
      });
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
          className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 px-6 py-4 bg-background/50">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
                Plan New Campaign
              </span>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-foreground-faint hover:bg-foreground/[0.05] hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4.5">
            <div>
              <h2 className="font-display text-xl text-foreground font-medium">
                Create Campaign
              </h2>
              <p className="mt-1 text-xs text-foreground-soft">
                Define the campaign objective, target audience and staging timeline.
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Product Launch v1.2, Q4 Investor Update, Spring Keynote"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-[var(--color-accent)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground-soft mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-[var(--color-accent)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-soft mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="text"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-[var(--color-accent)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1">
                  Objective & Core Angle
                </label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  rows={2}
                  placeholder="e.g. Establish FORGE as the premier operating system for early-stage startup founders..."
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-foreground-faint focus:border-[var(--color-accent)] focus:outline-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-5">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-foreground-soft hover:text-foreground transition-colors px-2 py-1.5"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Create Campaign</span>
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
