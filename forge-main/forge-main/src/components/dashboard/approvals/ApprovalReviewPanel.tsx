import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Edit3,
  ShieldCheck,
  Sparkles,
  FileText,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Info,
} from 'lucide-react';
import { ApprovalItem, ApprovalDepartment } from './types';

interface ApprovalReviewPanelProps {
  item: ApprovalItem;
  onBack: () => void;
  onApprove: (item: ApprovalItem, note?: string) => void;
  onReject: (item: ApprovalItem, reason: string) => void;
}

const departmentStyles: Record<ApprovalDepartment, { text: string; bg: string; border: string }> = {
  legal: {
    text: 'text-[var(--color-legal)]',
    bg: 'bg-[var(--color-legal)]/10',
    border: 'border-[var(--color-legal)]/25',
  },
  hiring: {
    text: 'text-[var(--color-hiring)]',
    bg: 'bg-[var(--color-hiring)]/10',
    border: 'border-[var(--color-hiring)]/25',
  },
  marketing: {
    text: 'text-[var(--color-accent)]',
    bg: 'bg-[var(--color-accent)]/10',
    border: 'border-[var(--color-accent)]/25',
  },
  finance: {
    text: 'text-[var(--color-finance)]',
    bg: 'bg-[var(--color-finance)]/10',
    border: 'border-[var(--color-finance)]/25',
  },
};

export default function ApprovalReviewPanel({
  item,
  onBack,
  onApprove,
  onReject,
}: ApprovalReviewPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(item.previewContent.body);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [copied, setCopied] = useState(false);

  const style = departmentStyles[item.department] || departmentStyles.legal;

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(editedBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteApprove = () => {
    onApprove(
      {
        ...item,
        previewContent: {
          ...item.previewContent,
          body: editedBody,
        },
      },
      approvalNote.trim() || undefined
    );
  };

  const handleExecuteReject = () => {
    if (!rejectReason.trim()) return;
    onReject(item, rejectReason.trim());
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Back button, department badge, and status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface/60 px-3 py-1.5 text-xs text-foreground-soft hover:border-foreground/30 hover:bg-surface hover:text-foreground transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to queue</span>
          </button>

          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
          >
            {item.departmentLabel} · {item.action}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-foreground-faint">
          <span>Staged by FORGE</span>
          <span>·</span>
          <span>{item.timeAgo}</span>
        </div>
      </div>

      {/* Main Review Glass Container */}
      <div className="glass rounded-2xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
        {/* Header Title & Department Meta */}
        <div className="space-y-2">
          <div className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-foreground-faint">
            Human-in-the-Loop Review
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-foreground font-medium tracking-tight">
            {item.title}
          </h2>
          <p className="text-xs sm:text-sm text-foreground-soft max-w-3xl leading-relaxed">
            {item.shortDescription}
          </p>
        </div>

        {/* Section 1: What FORGE Prepared */}
        <div className="rounded-xl border border-border/70 bg-surface/70 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-foreground-soft" strokeWidth={1.75} />
              <h3 className="font-display text-base text-foreground font-medium">
                What FORGE prepared
              </h3>
            </div>
            {item.whatForgePrepared.confidenceScore && (
              <span className="rounded-full bg-foreground/[0.05] border border-border/60 px-2.5 py-0.5 text-[0.7rem] font-mono text-foreground-soft">
                Audit Confidence: {item.whatForgePrepared.confidenceScore}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-foreground-soft leading-relaxed">
            {item.whatForgePrepared.summary}
          </p>

          {/* Highlights & Guardrails */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="space-y-2">
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
                Key Synthesis Points
              </span>
              <ul className="space-y-1.5 text-xs text-foreground-soft">
                {item.whatForgePrepared.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/60" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
                Autonomous Checks Verified
              </span>
              <ul className="space-y-1.5 text-xs text-foreground-soft">
                {item.whatForgePrepared.guardrailsChecked.map((g, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-finance)] shrink-0" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: Preview of Generated Result */}
        <div className="rounded-xl border border-border/70 bg-surface/90 p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-foreground-soft" strokeWidth={1.75} />
              <h3 className="font-display text-base text-foreground font-medium">
                {item.previewContent.heading}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPreview}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-2.5 py-1 text-xs text-foreground-soft hover:text-foreground transition-colors"
                title="Copy generated text"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-800" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  isEditing
                    ? 'bg-foreground text-background'
                    : 'border border-border/70 bg-surface text-foreground-soft hover:text-foreground'
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{isEditing ? 'Done Editing' : 'Edit / Review'}</span>
              </button>
            </div>
          </div>

          {/* Body Preview / Text Area */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                rows={10}
                className="w-full rounded-lg border border-foreground/30 bg-surface p-3 font-mono text-xs text-foreground leading-relaxed focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="Modify generated text or paste custom terms..."
              />
              <p className="text-[0.68rem] text-foreground-faint">
                You are modifying the draft content before executing founder sign-off.
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-background-alt/40 border border-border/40 p-4 sm:p-5 font-sans text-xs sm:text-[0.84rem] text-foreground-soft leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
              {editedBody}
            </div>
          )}

          {/* Tags if any */}
          {item.previewContent.tags && item.previewContent.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {item.previewContent.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-foreground/[0.04] border border-border/50 px-2 py-0.5 font-mono text-[0.68rem] text-foreground-faint"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Relevant Metadata Table */}
        <div className="rounded-xl border border-border/60 bg-surface/40 p-5 space-y-3">
          <div className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
            Governance & Audit Metadata
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {item.metadata.map((meta, idx) => (
              <div key={idx} className="space-y-0.5">
                <span className="text-[0.68rem] text-foreground-faint block truncate">
                  {meta.label}
                </span>
                <span className="text-xs font-medium text-foreground block truncate">
                  {meta.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rejection Prompt Drawer */}
        <AnimatePresence>
          {isRejecting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-rose-900/20 bg-rose-950/[0.03] p-4 sm:p-5 space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-rose-900">
                <AlertTriangle className="h-4 w-4" />
                <span>Specify reason for rejection or re-draft instructions</span>
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="e.g., Adjust non-solicitation term to 12 months, or change candidate compensation band to $160K base..."
                className="w-full rounded-lg border border-border bg-surface p-2.5 text-xs text-foreground placeholder:text-foreground-faint focus:outline-none focus:border-foreground/40"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsRejecting(false)}
                  className="rounded-lg px-3 py-1.5 text-xs text-foreground-soft hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteReject}
                  disabled={!rejectReason.trim()}
                  className="rounded-lg bg-rose-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-rose-950 transition-colors disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Action Footer */}
        <div className="pt-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Optional sign-off comment input */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Optional founder sign-off note (e.g. 'Looks great, proceed immediately')"
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-surface/60 px-3 py-2 text-xs text-foreground placeholder:text-foreground-faint/70 focus:outline-none focus:border-foreground/40"
            />
          </div>

          {/* Action Buttons: Reject / Edit / Approve */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              onClick={() => setIsRejecting(!isRejecting)}
              className="rounded-lg border border-border/80 bg-surface px-4 py-2 text-xs font-medium text-rose-900/80 hover:bg-rose-950/[0.04] hover:text-rose-900 hover:border-rose-900/30 transition-all"
            >
              <span className="flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5" />
                <span>Reject</span>
              </span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="hidden sm:inline-flex rounded-lg border border-border/80 bg-surface px-4 py-2 text-xs font-medium text-foreground-soft hover:bg-foreground/[0.03] hover:text-foreground transition-all"
            >
              <span className="flex items-center gap-1.5">
                <Edit3 className="h-3.5 w-3.5" />
                <span>{isEditing ? 'View Preview' : 'Edit / Review'}</span>
              </span>
            </button>

            <button
              onClick={handleExecuteApprove}
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all shadow-xs"
            >
              <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
              <span>Approve & Execute</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
