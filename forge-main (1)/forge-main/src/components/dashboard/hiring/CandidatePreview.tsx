import React from 'react';
import { ArrowRight, Sparkles, Check, Building, GraduationCap, Briefcase } from 'lucide-react';
import { Candidate } from './types';

interface CandidatePreviewProps {
  candidate: Candidate | null;
  onOpenFullReview: (candidate: Candidate) => void;
}

export default function CandidatePreview({
  candidate,
  onOpenFullReview,
}: CandidatePreviewProps) {
  if (!candidate) {
    return (
      <div className="glass rounded-2xl p-6 text-center border border-border/70">
        <p className="text-xs text-foreground-faint">
          Select any candidate from the pipeline to inspect their profile.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 sm:p-7 relative overflow-hidden border border-border/80 shadow-xs">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-hiring)]" />
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
            Candidate Detail
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-hiring)]/10 px-2.5 py-0.5 text-xs font-mono font-medium text-[var(--color-hiring)]">
          <span>{candidate.matchScore}% Match</span>
        </div>
      </div>

      {/* Main Info */}
      <div className="space-y-4">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-medium text-foreground">
            {candidate.name}
          </h3>
          <p className="text-xs sm:text-sm text-foreground-soft mt-0.5">
            {candidate.roleTitle} · {candidate.experience}
          </p>
        </div>

        {/* Relevance summary */}
        <div className="rounded-xl border border-border/60 bg-background/40 p-3.5 text-xs text-foreground-soft leading-relaxed">
          <span className="font-medium text-foreground">Why this candidate: </span>
          {candidate.matchReason}
        </div>

        {/* Context metadata */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-foreground-soft">
            <Building className="h-3.5 w-3.5 text-foreground-faint shrink-0" />
            <span className="truncate">{candidate.currentCompany}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground-soft">
            <GraduationCap className="h-3.5 w-3.5 text-foreground-faint shrink-0" />
            <span className="truncate">{candidate.education}</span>
          </div>
        </div>

        {/* Skills Tag Cloud */}
        <div>
          <div className="text-[0.68rem] uppercase tracking-wider text-foreground-faint mb-2 font-medium">
            Core Competencies
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-lg border border-border/70 bg-surface px-2.5 py-1 text-[0.7rem] text-foreground-soft font-mono"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="border-t border-border/50 pt-4 flex justify-end">
          <button
            onClick={() => onOpenFullReview(candidate)}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all duration-150 shadow-2xs group cursor-pointer"
          >
            <span>Review candidate</span>
            <ArrowRight className="h-3.5 w-3.5 text-background group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
