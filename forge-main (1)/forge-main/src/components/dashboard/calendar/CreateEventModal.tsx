import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Video,
  Users,
  MapPin,
  Check,
  Sparkles,
} from 'lucide-react';
import { CalendarEvent, CalendarDepartment } from './types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (event: Omit<CalendarEvent, 'id'>) => void;
}

interface EventArchetype {
  id: string;
  name: string;
  dept: CalendarDepartment;
  defaultTime: string;
  defaultLocation: string;
  defaultDescription: string;
}

const EVENT_ARCHETYPES: EventArchetype[] = [
  {
    id: 'interview',
    name: 'Candidate Interview',
    dept: 'hiring',
    defaultTime: '02:00 PM – 02:45 PM',
    defaultLocation: 'Google Meet · Video Conference',
    defaultDescription: '45-minute technical system design and founder alignment session.',
  },
  {
    id: 'investor',
    name: 'Investor Briefing',
    dept: 'finance',
    defaultTime: '11:00 AM – 11:30 AM',
    defaultLocation: 'Zoom Executive Room',
    defaultDescription: 'Monthly financial metrics briefing and product trajectory overview.',
  },
  {
    id: 'legal',
    name: 'Legal Counsel Review',
    dept: 'legal',
    defaultTime: '04:00 PM – 04:30 PM',
    defaultLocation: 'Encrypted Video Line',
    defaultDescription: 'Final sign-off on enterprise MSA clauses and IP covenants.',
  },
  {
    id: 'marketing',
    name: 'Launch Go-Live Sync',
    dept: 'marketing',
    defaultTime: '09:30 AM – 10:00 AM',
    defaultLocation: 'War Room · HQ / Remote',
    defaultDescription: 'Coordinating Product Hunt assets, Twitter threads, and press release.',
  },
];

export default function CreateEventModal({
  isOpen,
  onClose,
  onCreate,
}: CreateEventModalProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<EventArchetype>(EVENT_ARCHETYPES[0]);
  const [title, setTitle] = useState(EVENT_ARCHETYPES[0].name);
  const [department, setDepartment] = useState<CalendarDepartment>(EVENT_ARCHETYPES[0].dept);
  const [date, setDate] = useState('2026-10-25');
  const [duration, setDuration] = useState('45 min');
  const [time, setTime] = useState('02:00 PM – 02:45 PM');
  const [description, setDescription] = useState(EVENT_ARCHETYPES[0].defaultDescription);
  const [location, setLocation] = useState(EVENT_ARCHETYPES[0].defaultLocation);
  const [autoVideoLink, setAutoVideoLink] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectArchetype = (arch: EventArchetype) => {
    setSelectedArchetype(arch);
    setTitle(arch.name);
    setDepartment(arch.dept);
    setTime(arch.defaultTime);
    setLocation(arch.defaultLocation);
    setDescription(arch.defaultDescription);
  };

  const handleDurationChange = (dur: string) => {
    setDuration(dur);
    if (dur === '15 min') setTime('02:00 PM – 02:15 PM');
    if (dur === '30 min') setTime('02:00 PM – 02:30 PM');
    if (dur === '45 min') setTime('02:00 PM – 02:45 PM');
    if (dur === '60 min') setTime('02:00 PM – 03:00 PM');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const dayNum = parseInt(date.split('-')[2] || '25', 10);

    const departmentLabels: Record<CalendarDepartment, string> = {
      hiring: 'Hiring',
      legal: 'Legal',
      marketing: 'Marketing',
      finance: 'Finance',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onCreate({
        title: title.trim(),
        department,
        departmentLabel: departmentLabels[department],
        date: 'Oct 25, 2026',
        dayOfMonth: dayNum,
        time,
        status: 'upcoming',
        statusLabel: 'Upcoming',
        description: description.trim() || 'Operational event staged in FORGE calendar.',
        location: autoVideoLink ? 'Google Meet · meet.google.com/for-ge-ops' : location,
        attendees: ['Sarah Lin (Founder)', 'Team Leads'],
      });
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-foreground/30 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-background-alt">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-foreground/10 border border-border flex items-center justify-center text-foreground">
                <CalendarIcon className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                    Executive Schedule Studio
                  </span>
                  <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[0.65rem] font-medium text-foreground">
                    Auto-Staging
                  </span>
                </div>
                <p className="text-[0.72rem] text-foreground-soft">
                  Schedule founder milestones, candidate syncs, and board reviews
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-foreground-faint hover:bg-foreground/[0.06] hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* 1. Event Type Presets */}
            <div>
              <label className="block text-xs font-medium text-foreground-soft mb-2 flex items-center justify-between">
                <span>Select Event Type</span>
                <span className="text-[0.7rem] text-foreground-faint">
                  4 Operational Archetypes
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EVENT_ARCHETYPES.map((arch) => {
                  const isSelected = selectedArchetype.id === arch.id;
                  return (
                    <button
                      key={arch.id}
                      type="button"
                      onClick={() => handleSelectArchetype(arch)}
                      className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-foreground bg-surface shadow-xs ring-1 ring-foreground/20'
                          : 'border-border bg-background hover:bg-surface hover:border-foreground/20'
                      }`}
                    >
                      <span className="text-[0.75rem] font-semibold text-foreground truncate w-full mb-1">
                        {arch.name}
                      </span>
                      <span className="text-[0.65rem] text-foreground-soft capitalize">
                        {arch.dept}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Title & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Candidate Final Loop"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-foreground-faint focus:border-foreground/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                  Department
                </label>
                <div className="flex gap-1">
                  {(['hiring', 'legal', 'marketing', 'finance'] as CalendarDepartment[]).map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setDepartment(dept)}
                      className={`flex-1 rounded-xl py-2 text-[0.7rem] font-medium capitalize border transition-all ${
                        department === dept
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border bg-surface text-foreground-soft hover:text-foreground'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Duration & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                  Duration Preset
                </label>
                <div className="flex gap-1.5">
                  {['15 min', '30 min', '45 min', '60 min'].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => handleDurationChange(dur)}
                      className={`flex-1 rounded-xl py-2 text-[0.72rem] font-medium border transition-all ${
                        duration === dur
                          ? 'border-foreground bg-surface font-bold text-foreground shadow-xs'
                          : 'border-border bg-background text-foreground-faint hover:text-foreground-soft'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                  Time Slot Window
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground focus:border-foreground/40 focus:outline-none"
                />
              </div>
            </div>

            {/* 4. Location & Auto Google Meet link */}
            <div className="rounded-xl border border-border bg-background-alt p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700">
                  <Video className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-foreground block">
                    Auto-Generate Video Conference Link
                  </span>
                  <span className="text-[0.7rem] text-foreground-faint">
                    meet.google.com/for-ge-ops (Encrypted founder room)
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={autoVideoLink}
                onChange={(e) => setAutoVideoLink(e.target.checked)}
                className="h-4 w-4 rounded accent-foreground cursor-pointer"
              />
            </div>

            {/* 5. Context Notes */}
            <div>
              <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                Meeting Context & Agenda
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief agenda items..."
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-foreground-faint focus:border-foreground/40 focus:outline-none"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs text-foreground-soft hover:text-foreground transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-all shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Confirm & Stage Event</span>
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
