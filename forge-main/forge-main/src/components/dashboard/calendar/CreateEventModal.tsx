import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarEvent, CalendarDepartment } from './types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (event: Omit<CalendarEvent, 'id'>) => void;
}

export default function CreateEventModal({
  isOpen,
  onClose,
  onCreate,
}: CreateEventModalProps) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<CalendarDepartment>('hiring');
  const [date, setDate] = useState('2026-10-25');
  const [time, setTime] = useState('02:00 PM – 02:45 PM');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Google Meet / Video Link');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const dayNum = parseInt(date.split('-')[2] || '25', 10);

    const departmentLabels: Record<CalendarDepartment, string> = {
      hiring: 'Hiring',
      legal: 'Legal',
      marketing: 'Marketing',
      finance: 'Finance',
    };

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
      location,
      attendees: ['Sarah Lin (Founder)'],
    });

    setTitle('');
    setDescription('');
    onClose();
  };

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
          className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl z-10 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-foreground-soft" />
              <h3 className="font-display text-lg text-foreground font-medium">
                Create Event
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-foreground-faint hover:bg-foreground/[0.05] hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Title */}
            <div>
              <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Candidate Final Loop or Board Sync"
                className="w-full rounded-lg border border-border/80 bg-surface/70 px-3 py-2 text-xs text-foreground placeholder:text-foreground-faint focus:outline-none focus:border-foreground/40"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                Department
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['hiring', 'legal', 'marketing', 'finance'] as CalendarDepartment[]).map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setDepartment(dept)}
                    className={`rounded-lg px-2 py-1.5 text-xs capitalize transition-colors ${
                      department === dept
                        ? 'bg-foreground text-background font-medium'
                        : 'border border-border/70 bg-surface text-foreground-soft hover:text-foreground'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-border/80 bg-surface/70 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                />
              </div>
              <div>
                <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                  Time Window
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 10:00 AM – 10:45 AM"
                  className="w-full rounded-lg border border-border/80 bg-surface/70 px-3 py-2 text-xs text-foreground placeholder:text-foreground-faint focus:outline-none focus:border-foreground/40"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                Context / Notes
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief agenda or purpose..."
                className="w-full rounded-lg border border-border/80 bg-surface/70 px-3 py-2 text-xs text-foreground placeholder:text-foreground-faint focus:outline-none focus:border-foreground/40"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-1.5 text-xs text-foreground-soft hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:bg-foreground/90 transition-colors shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Save Event</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
