import React from 'react';
import { PulseEvent } from './types';

interface OperatingPulseProps {
  events: PulseEvent[];
  onViewActivity?: () => void;
}

export default function OperatingPulse({
  events,
  onViewActivity,
}: OperatingPulseProps) {
  const getCategoryDot = (cat: PulseEvent['category']) => {
    switch (cat) {
      case 'finance':
        return 'var(--color-finance)';
      case 'hiring':
        return 'var(--color-hiring)';
      case 'legal':
        return 'var(--color-legal)';
      case 'marketing':
        return 'var(--color-accent)';
      default:
        return 'var(--color-foreground)';
    }
  };

  return (
    <section aria-labelledby="operating-pulse-heading" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          id="operating-pulse-heading"
          className="font-display text-lg sm:text-xl font-medium tracking-tight text-foreground"
        >
          Operating Pulse
        </h2>

        {onViewActivity && (
          <button
            onClick={onViewActivity}
            className="text-xs text-foreground-soft hover:text-foreground transition-colors"
          >
            Full timeline
          </button>
        )}
      </div>

      {/* Timeline List */}
      <div className="rounded-xl border border-border/70 bg-surface/40 p-4 sm:p-5">
        <div className="relative space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border/60">
          {events.map((event) => {
            const dotColor = getCategoryDot(event.category);
            return (
              <div key={event.id} className="relative flex items-start gap-3.5 pl-0 group">
                {/* Timeline dot */}
                <span
                  className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-surface bg-surface flex items-center justify-center relative z-10"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                </span>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <span className="text-xs font-medium text-foreground group-hover:text-foreground">
                      {event.title}
                    </span>
                    <span className="text-[0.68rem] text-foreground-faint font-mono">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[0.78rem] text-foreground-soft leading-snug">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
