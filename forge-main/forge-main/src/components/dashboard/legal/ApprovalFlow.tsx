import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { ApprovalStep } from './types';

interface ApprovalFlowProps {
  currentStep: ApprovalStep;
}

const steps: { id: ApprovalStep; label: string; stepNumber: string }[] = [
  { id: 'draft', label: 'Draft', stepNumber: '01' },
  { id: 'review', label: 'Review', stepNumber: '02' },
  { id: 'approval', label: 'Approval', stepNumber: '03' },
  { id: 'complete', label: 'Complete', stepNumber: '04' },
];

export default function ApprovalFlow({ currentStep }: ApprovalFlowProps) {
  const stepOrder: Record<ApprovalStep, number> = {
    draft: 1,
    review: 2,
    approval: 3,
    complete: 4,
  };

  const currentOrder = stepOrder[currentStep] || 2;

  return (
    <div className="rounded-2xl border border-border/70 bg-surface/40 p-4 sm:p-5">
      <div className="flex items-center justify-between border-b border-border/50 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-legal)]" />
          <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
            Governance Flow
          </span>
        </div>
        <span className="text-[0.68rem] text-foreground-faint font-mono">
          Stage {currentOrder} of 4
        </span>
      </div>

      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {steps.map((step, idx) => {
          const stepNum = stepOrder[step.id];
          const isPassed = stepNum < currentOrder;
          const isCurrent = stepNum === currentOrder;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1.5 text-center flex-1 min-w-0">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono transition-all ${
                    isPassed
                      ? 'bg-[var(--color-legal)] text-white'
                      : isCurrent
                      ? 'border-2 border-[var(--color-legal)] bg-surface text-foreground font-medium shadow-2xs'
                      : 'border border-border/70 bg-background/50 text-foreground-faint'
                  }`}
                >
                  {isPassed ? <Check className="h-3.5 w-3.5" /> : step.stepNumber}
                </div>
                <span
                  className={`text-[0.72rem] tracking-wide truncate ${
                    isCurrent
                      ? 'font-medium text-foreground'
                      : isPassed
                      ? 'text-foreground-soft'
                      : 'text-foreground-faint'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`h-px flex-1 max-w-[32px] sm:max-w-[48px] -mt-5 transition-colors ${
                    stepNum < currentOrder ? 'bg-[var(--color-legal)]' : 'bg-border/60'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
