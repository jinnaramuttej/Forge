import React from 'react';
import { Check, X, ArrowRight, FileText, ShieldCheck, Scale, CornerDownRight } from 'lucide-react';
import { LegalDocument } from './types';

interface DocumentPreviewProps {
  document: LegalDocument | null;
  onOpenReview: (doc: LegalDocument) => void;
  onApprove: (docId: string) => void;
  onReject: (docId: string) => void;
}

export default function DocumentPreview({
  document,
  onOpenReview,
  onApprove,
  onReject,
}: DocumentPreviewProps) {
  if (!document) {
    return (
      <div className="glass rounded-2xl p-8 text-center border border-border/70">
        <p className="text-xs text-foreground-faint">
          Select an agreement from the list to preview its clauses and approval state.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Paper-cut Layered Editorial Document Container */}
      <div className="relative">
        {/* Background Paper Sheets Stack Effect */}
        <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl border border-border/50 bg-[#F4EFE6] -z-10 shadow-xs" />
        <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-border/30 bg-[#EFE9DD] -z-20 shadow-xs hidden sm:block" />

        {/* Top Paper Sheet */}
        <div className="relative rounded-2xl border border-border/80 bg-surface p-6 sm:p-7 shadow-sm">
          {/* Header Metadata */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-legal)]" />
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-foreground-faint">
                {document.type}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-foreground-faint">
              <span>{document.governingLaw}</span>
              <span>·</span>
              <span>Effective {document.effectiveDate}</span>
            </div>
          </div>

          {/* Title & Counterparty */}
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-medium text-foreground tracking-tight">
              {document.title}
            </h3>
            <p className="mt-1 text-xs text-foreground-soft font-medium">
              Prepared for {document.counterparty} · Managed by {document.owner}
            </p>
          </div>

          {/* Document Summary */}
          <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-4 text-xs text-foreground-soft leading-relaxed">
            <span className="font-medium text-foreground">Executive Overview: </span>
            {document.summary}
          </div>

          {/* Key Clauses Preview */}
          <div className="mt-5 space-y-3">
            <div className="text-[0.68rem] uppercase tracking-wider text-foreground-faint font-medium">
              Key Stipulations & Covenants
            </div>
            <div className="space-y-2">
              {document.clauses.map((clause, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border/50 bg-surface/80 p-3 text-xs"
                >
                  <div className="font-medium text-foreground mb-0.5">
                    §{idx + 1}. {clause.title}
                  </div>
                  <div className="text-foreground-soft leading-relaxed">
                    {clause.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Liquid Glass Bottom Actions */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/60 pt-5">
            <button
              onClick={() => onOpenReview(document)}
              className="text-xs font-medium text-foreground-soft hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Inspect Full Legal Text</span>
              <ArrowRight className="h-3.5 w-3.5 text-foreground-faint" />
            </button>

            <div className="flex items-center gap-2">
              {document.status === 'Awaiting Review' ? (
                <>
                  <button
                    onClick={() => onReject(document.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-foreground-soft hover:bg-rose-50 hover:text-rose-800 hover:border-rose-200 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => onApprove(document.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-1.5 text-xs font-medium text-background hover:bg-foreground/90 transition-all shadow-2xs cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Approve & Sign</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onOpenReview(document)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-foreground hover:bg-surface transition-colors"
                >
                  <span>View Signed Copy</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
