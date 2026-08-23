import React, { useState } from 'react';
import {
  ArrowRight, Building, GraduationCap, Clock, Star,
  Activity, MessageSquare, ChevronDown, ChevronUp, UserCheck
} from 'lucide-react';
import { Candidate, PipelineStage } from './types';
import { useForge } from '../../../context/ForgeContext';

interface CandidatePreviewProps {
  candidate: Candidate | null;
  onOpenFullReview: (candidate: Candidate) => void;
}

const STAGE_LABELS: Record<PipelineStage, string> = {
  new: 'New Inbound',
  screening: 'Screening',
  interview: 'Interview',
  final: 'Final Round',
  offer: 'Offer Staged',
};

const STAGE_COLORS: Record<PipelineStage, string> = {
  new: 'bg-foreground-faint/20 text-foreground-soft',
  screening: 'bg-blue-500/10 text-blue-400',
  interview: 'bg-amber-500/10 text-amber-500',
  final: 'bg-purple-500/10 text-purple-400',
  offer: 'bg-[var(--color-hiring)]/15 text-[var(--color-hiring)]',
};

const SCORE_RING_COLOR = (score: number) => {
  if (score >= 95) return 'text-[var(--color-hiring)]';
  if (score >= 85) return 'text-blue-400';
  return 'text-amber-500';
};

export default function CandidatePreview({
  candidate,
  onOpenFullReview,
}: CandidatePreviewProps) {
  const { roles } = useForge();
  const [notesExpanded, setNotesExpanded] = useState(false);

  if (!candidate) {
    return (
      <div className="glass rounded-2xl p-8 text-center border border-border/70 flex flex-col items-center justify-center gap-3 min-h-[260px]">
        <UserCheck className="h-7 w-7 text-foreground-faint/40" />
        <p className="text-xs text-foreground-faint max-w-[200px] leading-relaxed">
          Select any candidate from the pipeline to inspect their profile.
        </p>
      </div>
    );
  }

  const role = roles.find(r => r.id === candidate.roleId);
  const hasResources = role && (
    (role.screening_questions && role.screening_questions.length > 0) ||
    role.nda_content
  );

  return (
    <div className="glass rounded-2xl relative overflow-hidden border border-border/80 shadow-xs">
      {/* Top accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[var(--color-hiring)]/60 via-[var(--color-hiring)]/20 to-transparent" />

      <div className="p-6 sm:p-7 space-y-5">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[var(--color-hiring)]/30 to-[var(--color-hiring)]/5 border border-[var(--color-hiring)]/20 flex items-center justify-center shrink-0">
              <span className="text-base font-semibold text-[var(--color-hiring)]">
                {candidate.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
                {candidate.name}
              </h3>
              <p className="text-[0.72rem] text-foreground-soft mt-0.5">
                {candidate.roleTitle}
              </p>
            </div>
          </div>

          {/* Match score ring */}
          <div className="flex flex-col items-center shrink-0">
            <div className={`text-xl font-mono font-bold leading-none ${SCORE_RING_COLOR(candidate.matchScore)}`}>
              {candidate.matchScore}
              <span className="text-xs font-normal text-foreground-faint">%</span>
            </div>
            <span className="text-[0.62rem] text-foreground-faint mt-0.5 uppercase tracking-wider">Match</span>
          </div>
        </div>

        {/* ── Stage + Rating badges ── */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold ${STAGE_COLORS[candidate.stage]}`}>
            {STAGE_LABELS[candidate.stage]}
          </span>
          {candidate.rating && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[0.68rem] font-medium text-amber-500">
              <Star className="h-2.5 w-2.5 fill-amber-500" />
              {candidate.rating}
            </span>
          )}
          {hasResources && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-hiring)]/10 px-2.5 py-0.5 text-[0.68rem] font-medium text-[var(--color-hiring)]">
              <Activity className="h-2.5 w-2.5" />
              Resources Ready
            </span>
          )}
        </div>

        {/* ── Why this candidate ── */}
        <div className="rounded-xl border border-border/60 bg-background/40 p-3.5">
          <div className="text-[0.65rem] uppercase tracking-wider text-foreground-faint font-medium mb-1.5">
            FORGE Assessment
          </div>
          <p className="text-xs text-foreground-soft leading-relaxed">{candidate.matchReason}</p>
        </div>

        {/* ── Key metadata grid ── */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="rounded-xl border border-border/60 bg-surface/50 p-3">
            <div className="text-[0.62rem] uppercase tracking-wider text-foreground-faint mb-1">Company</div>
            <div className="flex items-center gap-1.5 font-medium text-foreground truncate">
              <Building className="h-3 w-3 text-foreground-faint shrink-0" />
              <span className="truncate">{candidate.currentCompany}</span>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-surface/50 p-3">
            <div className="text-[0.62rem] uppercase tracking-wider text-foreground-faint mb-1">Education</div>
            <div className="flex items-center gap-1.5 font-medium text-foreground truncate">
              <GraduationCap className="h-3 w-3 text-foreground-faint shrink-0" />
              <span className="truncate">{candidate.education}</span>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-surface/50 p-3">
            <div className="text-[0.62rem] uppercase tracking-wider text-foreground-faint mb-1">Experience</div>
            <div className="font-medium text-foreground">{candidate.experience}</div>
          </div>
          <div className="rounded-xl border border-border/60 bg-surface/50 p-3">
            <div className="text-[0.62rem] uppercase tracking-wider text-foreground-faint mb-1">Last Active</div>
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Clock className="h-3 w-3 text-foreground-faint shrink-0" />
              <span>{candidate.lastActivity}</span>
            </div>
          </div>
        </div>

        {/* ── Skills ── */}
        <div>
          <div className="text-[0.65rem] uppercase tracking-wider text-foreground-faint font-medium mb-2">
            Core Competencies
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-lg border border-border/70 bg-surface px-2.5 py-1 text-[0.7rem] text-foreground-soft font-mono hover:border-[var(--color-hiring)]/40 hover:text-foreground transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* ── Recruiter Notes ── */}
        {candidate.notes && (
          <div className="rounded-xl border border-border/60 bg-surface/30 overflow-hidden">
            <button
              onClick={() => setNotesExpanded(prev => !prev)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-[0.7rem] font-medium text-foreground-soft hover:text-foreground transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3 w-3" />
                <span>Recruiter Notes</span>
              </div>
              {notesExpanded
                ? <ChevronUp className="h-3 w-3 group-hover:text-foreground" />
                : <ChevronDown className="h-3 w-3 group-hover:text-foreground" />
              }
            </button>
            {notesExpanded && (
              <div className="px-3.5 pb-3 text-xs text-foreground-soft leading-relaxed border-t border-border/40 pt-2.5">
                {candidate.notes}
              </div>
            )}
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex items-center justify-between border-t border-border/50 pt-4">
          <span className="text-[0.68rem] text-foreground-faint">
            Pipeline · {STAGE_LABELS[candidate.stage]}
          </span>
          <button
            onClick={() => onOpenFullReview(candidate)}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all duration-150 shadow-2xs group cursor-pointer"
          >
            <span>Full Review & NDA</span>
            <ArrowRight className="h-3.5 w-3.5 text-background group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
