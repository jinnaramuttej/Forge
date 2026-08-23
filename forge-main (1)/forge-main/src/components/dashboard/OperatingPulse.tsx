import React from 'react';
import { PulseEvent } from './types';
import { Activity } from 'lucide-react';

interface OperatingPulseProps {
  events: PulseEvent[];
  onViewActivity?: () => void;
}

export default function OperatingPulse({
  events,
  onViewActivity,
}: OperatingPulseProps) {
  const getCategoryTheme = (cat: PulseEvent['category']) => {
    switch (cat) {
      case 'finance':
        return { dot: 'var(--color-finance)', tag: 'Finance' };
      case 'hiring':
        return { dot: 'var(--color-hiring)', tag: 'Hiring' };
      case 'legal':
        return { dot: 'var(--color-legal)', tag: 'Legal' };
      case 'marketing':
        return { dot: 'var(--color-accent)', tag: 'Marketing' };
      default:
        return { dot: 'var(--color-foreground)', tag: 'System' };
    }
  };

  return (
    <section aria-labelledby="operating-pulse-heading" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-foreground-soft" />
          <h2
            id="operating-pulse-heading"
            className="font-display text-lg font-medium tracking-tight text-foreground"
          >
            Operating Pulse
          </h2>
        </div>

        {onViewActivity && (
          <button
            onClick={onViewActivity}
            className="text-xs text-foreground-soft hover:text-foreground transition-colors font-medium cursor-pointer"
          >
            Full timeline →
          </button>
        )}
      </div>

      {/* Open Timeline Feed (Zero Card Box Enclosure) */}
      <div className="divide-y divide-border/60">
        {events.map((event) => {
          const theme = getCategoryTheme(event.category);
          return (
            <div key={event.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
              {/* Category Dot */}
              <span
                className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: theme.dot }}
              />

              {/* Event Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground truncate">
                    {event.title}
                  </span>
                  <span className="text-[0.68rem] text-foreground-faint font-mono shrink-0">
                    {event.timestamp}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-foreground-soft leading-normal">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
