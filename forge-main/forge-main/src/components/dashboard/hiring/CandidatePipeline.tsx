import React from 'react';
import { Candidate, PipelineStage } from './types';

interface CandidatePipelineProps {
  candidates: Candidate[];
  selectedCandidateId: string | null;
  onSelectCandidate: (candidate: Candidate) => void;
}

const stages: { id: PipelineStage; label: string }[] = [
  { id: 'new', label: 'New' },
  { id: 'screening', label: 'Screening' },
  { id: 'interview', label: 'Interview' },
  { id: 'final', label: 'Final' },
  { id: 'offer', label: 'Offer' },
];

export default function CandidatePipeline({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
}: CandidatePipelineProps) {
  return (
    <section aria-labelledby="candidate-pipeline-heading" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          id="candidate-pipeline-heading"
          className="font-display text-lg sm:text-xl font-medium tracking-tight text-foreground"
        >
          Candidate Pipeline
        </h2>
        <span className="text-xs text-foreground-faint font-mono">
          Stage Velocity: 12.4 days
        </span>
      </div>

      {/* Pipeline Stages Horizontal Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {stages.map((st, idx) => {
          const stageCandidates = candidates.filter((c) => c.stage === st.id);

          return (
            <div
              key={st.id}
              className="flex flex-col rounded-2xl border border-border/70 bg-surface/40 p-3.5 min-h-[220px]"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[0.65rem] font-mono text-foreground-faint">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-medium text-foreground uppercase tracking-wider">
                    {st.label}
                  </span>
                </div>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground/[0.06] font-mono text-[0.65rem] text-foreground-soft">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Stage Candidate Cards */}
              <div className="space-y-2.5 flex-1">
                {stageCandidates.length === 0 ? (
                  <div className="flex h-28 items-center justify-center text-center text-[0.72rem] text-foreground-faint/70 italic">
                    No candidates
                  </div>
                ) : (
                  stageCandidates.map((cand) => {
                    const isSelected = selectedCandidateId === cand.id;
                    return (
                      <div
                        key={cand.id}
                        onClick={() => onSelectCandidate(cand)}
                        className={`group relative rounded-xl border p-3 cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? 'border-[var(--color-hiring)] bg-surface shadow-xs ring-1 ring-[var(--color-hiring)]/30'
                            : 'border-border/60 bg-surface/70 hover:border-foreground/20 hover:bg-surface'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="font-medium text-xs text-foreground group-hover:text-foreground truncate">
                            {cand.name}
                          </div>
                          <span className="text-[0.65rem] font-mono text-[var(--color-hiring)] font-medium shrink-0">
                            {cand.matchScore}%
                          </span>
                        </div>

                        <div className="mt-1 text-[0.7rem] text-foreground-soft truncate">
                          {cand.roleTitle}
                        </div>

                        <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-1.5 text-[0.65rem] text-foreground-faint">
                          <span className="truncate">{cand.currentCompany}</span>
                          <span className="shrink-0">{cand.lastActivity}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
