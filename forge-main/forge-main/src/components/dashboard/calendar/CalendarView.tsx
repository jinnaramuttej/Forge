import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import EventDetailModal from './EventDetailModal';
import CreateEventModal from './CreateEventModal';
import { CalendarEvent, CalendarDepartment } from './types';
import { useForge } from '../../../context/ForgeContext';

const initialEvents: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Candidate Interview · Theo Dumas',
    department: 'hiring',
    departmentLabel: 'Hiring',
    date: 'Fri, Oct 24, 2026',
    dayOfMonth: 24,
    time: '03:00 PM – 03:45 PM',
    status: 'confirmed',
    statusLabel: 'Confirmed',
    description: 'Round 1 technical deep dive and UI craftsmanship architecture review with Founder.',
    attendees: ['Sarah Lin (Founder)', 'Theo Dumas (Candidate)'],
    location: 'Google Meet',
    isUrgent: true,
  },
  {
    id: 'ev-2',
    title: 'NDA Review Deadline · Foundry Group',
    department: 'legal',
    departmentLabel: 'Legal',
    date: 'Mon, Oct 27, 2026',
    dayOfMonth: 27,
    time: '11:00 AM EST',
    status: 'deadline',
    statusLabel: 'Sign-off Deadline',
    description: 'Mutual confidentiality execution window for Series Seed data room access.',
    attendees: ['Sarah Lin', 'Foundry Group General Counsel'],
    location: 'FORGE Approvals Workspace',
  },
  {
    id: 'ev-3',
    title: 'Product Launch · FORGE OS v1.2 GA',
    department: 'marketing',
    departmentLabel: 'Marketing',
    date: 'Tue, Oct 28, 2026',
    dayOfMonth: 28,
    time: '09:00 AM EST',
    status: 'upcoming',
    statusLabel: 'Milestone',
    description: 'Simultaneous public launch across Product Hunt, Tech Press Wires, and Founder LinkedIn.',
    attendees: ['Sarah Lin', 'Design Partners Beta Cohort'],
    location: 'Public Release',
  },
  {
    id: 'ev-4',
    title: 'Monthly Finance & Payroll Review',
    department: 'finance',
    departmentLabel: 'Finance',
    date: 'Thu, Oct 30, 2026',
    dayOfMonth: 30,
    time: '04:00 PM – 04:30 PM',
    status: 'upcoming',
    statusLabel: 'Executive Run',
    description: 'Review reconciled bank feeds, monthly burn rate ($34.2K), and direct contractor disbursements.',
    attendees: ['Sarah Lin', 'Silicon Valley Bank Automated Feed'],
    location: 'Finance Dashboard',
  },
  {
    id: 'ev-5',
    title: 'Marketing Campaign Staging · Substack Deep Dive',
    department: 'marketing',
    departmentLabel: 'Marketing',
    date: 'Fri, Oct 31, 2026',
    dayOfMonth: 31,
    time: '01:30 PM – 02:15 PM',
    status: 'upcoming',
    statusLabel: 'Staged',
    description: 'Longform editorial piece: "Building the Autonomous Startup: Behind the Engineering of FORGE".',
    attendees: ['Sarah Lin (Author)'],
    location: 'Substack Editorial Draft',
  },
];

const departmentColors: Record<CalendarDepartment, { text: string; bg: string; dot: string; border: string }> = {
  legal: {
    text: 'text-[var(--color-legal)]',
    bg: 'bg-[var(--color-legal)]/10',
    dot: 'bg-[var(--color-legal)]',
    border: 'border-[var(--color-legal)]/30',
  },
  hiring: {
    text: 'text-[var(--color-hiring)]',
    bg: 'bg-[var(--color-hiring)]/10',
    dot: 'bg-[var(--color-hiring)]',
    border: 'border-[var(--color-hiring)]/30',
  },
  marketing: {
    text: 'text-[var(--color-accent)]',
    bg: 'bg-[var(--color-accent)]/10',
    dot: 'bg-[var(--color-accent)]',
    border: 'border-[var(--color-accent)]/30',
  },
  finance: {
    text: 'text-[var(--color-finance)]',
    bg: 'bg-[var(--color-finance)]/10',
    dot: 'bg-[var(--color-finance)]',
    border: 'border-[var(--color-finance)]/30',
  },
};

export default function CalendarView() {
  const { calendarEvents: events, addCalendarEvent, deleteCalendarEvent, toggleCalendarEvent } = useForge();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState<'all' | CalendarDepartment>('all');
  const [currentMonth, setCurrentMonth] = useState('October 2026');

  // October 2026 starts on Thursday (index 4 in 0-based Sun..Sat)
  const daysInMonth = 31;
  const startDayOffset = 4; // Thursday

  const calendarDays = Array.from({ length: 35 }, (_, idx) => {
    const dayNum = idx - startDayOffset + 1;
    const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
    const dayEvents = isCurrentMonth
      ? events.filter(
          (e: CalendarEvent) =>
            e.dayOfMonth === dayNum &&
            (filterDepartment === 'all' || e.department === filterDepartment)
        )
      : [];
    const isToday = isCurrentMonth && dayNum === 24;

    return {
      index: idx,
      dayNum: isCurrentMonth ? dayNum : dayNum < 1 ? 30 + dayNum : dayNum - daysInMonth,
      isCurrentMonth,
      isToday,
      events: dayEvents,
    };
  });

  const handleCreateEvent = (newEventData: Omit<CalendarEvent, 'id'>) => {
    addCalendarEvent(newEventData);
  };

  const handleDeleteEvent = (id: string) => {
    deleteCalendarEvent(id);
    if (selectedEvent && selectedEvent.id === id) {
      setSelectedEvent(null);
    }
  };

  const handleToggleStatus = (id: string) => {
    toggleCalendarEvent(id);
    if (selectedEvent && selectedEvent.id === id) {
      setSelectedEvent((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === 'completed' ? 'upcoming' : 'completed',
              statusLabel: prev.status === 'completed' ? 'Upcoming' : 'Completed',
            }
          : null
      );
    }
  };

  const filteredUpcomingEvents = events.filter(
    (e: CalendarEvent) => filterDepartment === 'all' || e.department === filterDepartment
  );

  return (
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
            <span>Operations & Schedule</span>
            <span>·</span>
            <span>Key Milestones</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Calendar
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            Keep important work and deadlines in view.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Department Filter */}
          <div className="hidden sm:flex items-center gap-1 border border-border/70 rounded-lg p-0.5 bg-surface/50 text-xs">
            {(['all', 'hiring', 'legal', 'marketing', 'finance'] as const).map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDepartment(dept)}
                className={`rounded px-2.5 py-1 text-xs capitalize transition-colors ${
                  filterDepartment === dept
                    ? 'bg-foreground text-background font-medium shadow-2xs'
                    : 'text-foreground-soft hover:text-foreground'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create event</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Month Calendar (Left 65%) & Upcoming Events (Right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Monthly Calendar View */}
        <div className="lg:col-span-8 rounded-2xl border border-border/70 bg-surface/40 p-5 sm:p-6 space-y-4">
          {/* Month Header Nav */}
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg sm:text-xl text-foreground font-medium">
                {currentMonth}
              </h2>
              <span className="rounded-full bg-foreground/[0.05] px-2 py-0.5 text-[0.68rem] font-mono text-foreground-soft">
                Today: Oct 24
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                aria-label="Previous month"
                className="rounded-md p-1.5 text-foreground-faint hover:bg-foreground/[0.05] hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Next month"
                className="rounded-md p-1.5 text-foreground-faint hover:bg-foreground/[0.05] hover:text-foreground transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Desktop/Tablet Month Grid */}
          <div className="hidden sm:block">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center pb-2 border-b border-border/40">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <span key={d} className="text-[0.68rem] font-medium uppercase tracking-wider text-foreground-faint">
                  {d}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 pt-2">
              {calendarDays.map((day) => (
                <div
                  key={day.index}
                  className={`min-h-[76px] rounded-lg p-1.5 flex flex-col justify-between border transition-all ${
                    day.isToday
                      ? 'border-foreground/40 bg-surface shadow-2xs'
                      : day.isCurrentMonth
                      ? 'border-border/40 bg-surface/30 hover:border-foreground/20 hover:bg-surface/70'
                      : 'border-transparent opacity-30 pointer-events-none'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono ${
                        day.isToday
                          ? 'flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background font-medium'
                          : 'text-foreground-soft'
                      }`}
                    >
                      {day.dayNum}
                    </span>
                  </div>

                  {/* Day Events stack */}
                  <div className="space-y-1 mt-1">
                    {day.events.map((ev: CalendarEvent) => {
                      const color = departmentColors[ev.department];
                      return (
                        <button
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className={`w-full text-left truncate rounded px-1.5 py-0.5 text-[0.68rem] font-medium transition-all ${color.bg} ${color.text} hover:opacity-80`}
                        >
                          <span className="truncate block">{ev.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Agenda representation */}
          <div className="block sm:hidden divide-y divide-border/40 pt-2">
            {events.map((ev: CalendarEvent) => {
              const color = departmentColors[ev.department];
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className="py-3 flex items-start justify-between gap-3 cursor-pointer hover:bg-foreground/[0.02]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${color.dot}`} />
                      <span className="text-xs font-medium text-foreground">{ev.title}</span>
                    </div>
                    <div className="text-[0.7rem] text-foreground-faint flex items-center gap-2 pl-4">
                      <span>{ev.date}</span>
                      <span>·</span>
                      <span>{ev.time}</span>
                    </div>
                  </div>
                  <span className={`text-[0.65rem] px-1.5 py-0.5 rounded ${color.bg} ${color.text}`}>
                    {ev.departmentLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Upcoming Events List */}
        <div className="lg:col-span-4 rounded-2xl border border-border/70 bg-surface/40 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h3 className="font-display text-base text-foreground font-medium">
              Upcoming Schedule
            </h3>
            <span className="text-[0.68rem] text-foreground-faint font-mono">
              {filteredUpcomingEvents.length} events
            </span>
          </div>

          <div className="space-y-3">
            {filteredUpcomingEvents.map((ev: CalendarEvent) => {
              const color = departmentColors[ev.department];
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`group rounded-xl border border-border/70 bg-surface/60 p-3.5 space-y-2 cursor-pointer hover:border-foreground/30 hover:bg-surface hover:shadow-xs transition-all`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[0.68rem] font-medium ${color.bg} ${color.text}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${color.dot}`} />
                      {ev.departmentLabel}
                    </span>
                    <span className="text-[0.68rem] text-foreground-faint font-mono">
                      {ev.date.split(',')[0]}
                    </span>
                  </div>

                  <h4 className="font-display text-sm text-foreground font-medium leading-snug group-hover:text-foreground">
                    {ev.title}
                  </h4>

                  <div className="flex items-center gap-3 text-[0.72rem] text-foreground-soft pt-1 border-t border-border/40">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-foreground-faint" />
                      <span className="font-mono">{ev.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onDelete={handleDeleteEvent}
        onToggleStatus={handleToggleStatus}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateEvent}
      />
    </div>
  );
}
