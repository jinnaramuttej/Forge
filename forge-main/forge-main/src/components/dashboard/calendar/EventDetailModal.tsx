import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { CalendarEvent, CalendarDepartment } from './types';

interface EventDetailModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

const departmentBadges: Record<CalendarDepartment, { text: string; bg: string; dot: string }> = {
  legal: {
    text: 'text-[var(--color-legal)]',
    bg: 'bg-[var(--color-legal)]/10 border-[var(--color-legal)]/20',
    dot: 'bg-[var(--color-legal)]',
  },
  hiring: {
    text: 'text-[var(--color-hiring)]',
    bg: 'bg-[var(--color-hiring)]/10 border-[var(--color-hiring)]/20',
    dot: 'bg-[var(--color-hiring)]',
  },
  marketing: {
    text: 'text-[var(--color-accent)]',
    bg: 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/20',
    dot: 'bg-[var(--color-accent)]',
  },
  finance: {
    text: 'text-[var(--color-finance)]',
    bg: 'bg-[var(--color-finance)]/10 border-[var(--color-finance)]/20',
    dot: 'bg-[var(--color-finance)]',
  },
};

export default function EventDetailModal({
  event,
  onClose,
  onDelete,
  onToggleStatus,
}: EventDetailModalProps) {
  if (!event) return null;

  const badge = departmentBadges[event.department] || departmentBadges.legal;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-foreground/20 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl z-10 space-y-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium ${badge.bg} ${badge.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                  {event.departmentLabel}
                </span>

                <span className="rounded bg-foreground/[0.05] px-2 py-0.5 text-[0.68rem] text-foreground-soft font-mono">
                  {event.statusLabel}
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl text-foreground font-medium leading-snug">
                {event.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1 text-foreground-faint hover:bg-foreground/[0.05] hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Time & Location details */}
          <div className="rounded-xl border border-border/70 bg-background-alt/30 p-3.5 space-y-2 text-xs text-foreground-soft">
            <div className="flex items-center gap-2.5">
              <CalendarIcon className="h-4 w-4 text-foreground-faint" strokeWidth={1.75} />
              <span>{event.date}</span>
              <span>·</span>
              <Clock className="h-4 w-4 text-foreground-faint ml-1" strokeWidth={1.75} />
              <span className="font-mono">{event.time}</span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-foreground-faint" strokeWidth={1.75} />
                <span>{event.location}</span>
              </div>
            )}

            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-center gap-2.5 pt-1 border-t border-border/40">
                <Users className="h-4 w-4 text-foreground-faint" strokeWidth={1.75} />
                <span>{event.attendees.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <div className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
              Operational Context
            </div>
            <p className="text-xs sm:text-sm text-foreground-soft leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-between">
            {onDelete ? (
              <button
                onClick={() => {
                  onDelete(event.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 text-xs text-rose-800 hover:text-rose-950 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-lg border border-border/80 bg-surface px-4 py-1.5 text-xs font-medium text-foreground-soft hover:text-foreground transition-colors"
              >
                Close
              </button>
              {onToggleStatus && (
                <button
                  onClick={() => {
                    onToggleStatus(event.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:bg-foreground/90 transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Mark Completed</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
