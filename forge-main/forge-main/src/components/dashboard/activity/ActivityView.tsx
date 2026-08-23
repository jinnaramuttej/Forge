import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Filter,
  Search,
  CheckCircle2,
  FileText,
  Users,
  Megaphone,
  TrendingUp,
  Scale,
  Sparkles,
} from 'lucide-react';
import { ActivityEvent, ActivityDepartment } from './types';

const initialActivityEvents: ActivityEvent[] = [
  // Today
  {
    id: 'act-1',
    time: '10:42',
    dateGroup: 'Today',
    department: 'legal',
    departmentLabel: 'Legal',
    action: 'NDA drafted',
    shortDescription: 'Standard bilateral non-disclosure agreement generated for Studio Monochrome contract designer.',
    actor: 'FORGE Legal Guard',
  },
  {
    id: 'act-2',
    time: '09:30',
    dateGroup: 'Today',
    department: 'hiring',
    departmentLabel: 'Hiring',
    action: 'Candidate shortlisted',
    shortDescription: 'Theo Dumas advanced to Technical Deep Dive for Staff Frontend Engineer (42 screened).',
    actor: 'FORGE Talent Engine',
  },
  {
    id: 'act-3',
    time: '08:55',
    dateGroup: 'Today',
    department: 'finance',
    departmentLabel: 'Finance',
    action: 'Financial snapshot updated',
    shortDescription: 'Bank feeds reconciled. Net cash burn calibrated at $34.2K/mo with 21.8 months runway.',
    actor: 'FORGE Finance Ledger',
  },

  // Yesterday
  {
    id: 'act-4',
    time: '16:15',
    dateGroup: 'Yesterday',
    department: 'marketing',
    departmentLabel: 'Marketing',
    action: 'Campaign prepared',
    shortDescription: 'Product Hunt launch checklist, high-res typography collateral & copy staged.',
    actor: 'FORGE Growth Agent',
  },
  {
    id: 'act-5',
    time: '14:00',
    dateGroup: 'Yesterday',
    department: 'legal',
    departmentLabel: 'Legal',
    action: 'Agreement approved',
    shortDescription: 'Series Seed Mutual NDA with Foundry Group LP signed and archived to corporate vault.',
    actor: 'Sarah Lin (Founder)',
  },
  {
    id: 'act-6',
    time: '11:20',
    dateGroup: 'Yesterday',
    department: 'hiring',
    departmentLabel: 'Hiring',
    action: 'Interview scheduled',
    shortDescription: 'Aisha Khan accepted invitation for Friday 3:00 PM architecture review.',
    actor: 'FORGE Talent Engine',
  },

  // Earlier this week
  {
    id: 'act-7',
    time: 'Oct 22',
    dateGroup: 'Earlier this week',
    department: 'finance',
    departmentLabel: 'Finance',
    action: 'SAFE note executed',
    shortDescription: '$150K angel allocation closed & deposited into Silicon Valley Bank operational account.',
    actor: 'Sarah Lin (Founder)',
  },
  {
    id: 'act-8',
    time: 'Oct 21',
    dateGroup: 'Earlier this week',
    department: 'marketing',
    departmentLabel: 'Marketing',
    action: 'LinkedIn announcement staged',
    shortDescription: 'Founder release brief prepared for FORGE OS v1.2 GA embargo date.',
    actor: 'FORGE Growth Agent',
  },
  {
    id: 'act-9',
    time: 'Oct 20',
    dateGroup: 'Earlier this week',
    department: 'legal',
    departmentLabel: 'Legal',
    action: 'Corporate resolution passed',
    shortDescription: 'Unanimous written consent of directors adopted for 2026 stock incentive plan.',
    actor: 'Board of Directors',
  },
];

const departmentColors: Record<ActivityDepartment, { text: string; bg: string; dot: string; border: string }> = {
  finance: {
    text: 'text-[var(--color-finance)]',
    bg: 'bg-[var(--color-finance)]/10',
    dot: 'bg-[var(--color-finance)]',
    border: 'border-[var(--color-finance)]/25',
  },
  hiring: {
    text: 'text-[var(--color-hiring)]',
    bg: 'bg-[var(--color-hiring)]/10',
    dot: 'bg-[var(--color-hiring)]',
    border: 'border-[var(--color-hiring)]/25',
  },
  legal: {
    text: 'text-[var(--color-legal)]',
    bg: 'bg-[var(--color-legal)]/10',
    dot: 'bg-[var(--color-legal)]',
    border: 'border-[var(--color-legal)]/25',
  },
  marketing: {
    text: 'text-[var(--color-accent)]',
    bg: 'bg-[var(--color-accent)]/10',
    dot: 'bg-[var(--color-accent)]',
    border: 'border-[var(--color-accent)]/25',
  },
};

import { useForge } from '../../../context/ForgeContext';

const dateGroups = ['Today', 'Yesterday', 'Earlier this week'] as const;

export default function ActivityView() {
  const { activities: events } = useForge();
  const [filterDepartment, setFilterDepartment] = useState<'all' | ActivityDepartment>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((item) => {
    const matchesDept = filterDepartment === 'all' || item.department === filterDepartment;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.departmentLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.actor && item.actor.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
            <span>Audit Trail & Operations</span>
            <span>·</span>
            <span>Live Stream</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Activity
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            Everything important that happened across your workspace.
          </p>
        </div>

        {/* Live Pulse Badge */}
        <div className="flex items-center gap-2">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-foreground-soft font-medium shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-[var(--color-finance)] animate-pulse" />
            <span>Audit log real-time sync</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
        {/* Simple Department Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['all', 'finance', 'hiring', 'legal', 'marketing'] as const).map((dept) => {
            const count =
              dept === 'all'
                ? events.length
                : events.filter((e) => e.department === dept).length;

            return (
              <button
                key={dept}
                onClick={() => setFilterDepartment(dept)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs capitalize transition-colors ${
                  filterDepartment === dept
                    ? 'bg-foreground text-background font-medium shadow-xs'
                    : 'text-foreground-soft hover:bg-foreground/[0.04] hover:text-foreground'
                }`}
              >
                <span>{dept}</span>
                <span
                  className={`text-[0.68rem] px-1 rounded ${
                    filterDepartment === dept
                      ? 'bg-background/20 text-background'
                      : 'bg-foreground/[0.06] text-foreground-faint'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-faint" />
          <input
            type="text"
            placeholder="Search activity stream..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/70 bg-surface/50 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-foreground-faint/70 focus:border-foreground/40 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Chronological Activity Stream */}
      {filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-surface/30 p-12 text-center">
          <Clock className="mx-auto h-8 w-8 text-foreground-faint mb-2" strokeWidth={1.5} />
          <h3 className="font-display text-lg text-foreground font-medium">No activity found</h3>
          <p className="mt-1 text-xs text-foreground-soft">
            No events match the selected department or query.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {dateGroups.map((group) => {
            const groupEvents = filteredEvents.filter((e) => e.dateGroup === group);
            if (groupEvents.length === 0) return null;

            return (
              <div key={group} className="space-y-3">
                {/* Date Group Header */}
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-sm text-foreground font-medium tracking-wide uppercase text-foreground-faint text-[0.72rem]">
                    {group}
                  </h3>
                  <div className="flex-1 border-t border-border/50" />
                </div>

                {/* Events list for date group */}
                <div className="rounded-2xl border border-border/70 bg-surface/40 divide-y divide-border/40 overflow-hidden">
                  {groupEvents.map((item) => {
                    const color = departmentColors[item.department];

                    return (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-foreground/[0.015] transition-colors"
                      >
                        {/* Left: Time, Department badge, Action, Description */}
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          {/* Timestamp Pill */}
                          <span className="shrink-0 mt-0.5 font-mono text-xs text-foreground-faint w-12">
                            {item.time}
                          </span>

                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Department Tag */}
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[0.68rem] font-medium border ${color.bg} ${color.text} ${color.border}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${color.dot}`} />
                                {item.departmentLabel}
                              </span>

                              <span className="text-foreground-faint/60">·</span>

                              {/* Action Name */}
                              <span className="font-display text-sm sm:text-base font-medium text-foreground">
                                {item.action}
                              </span>
                            </div>

                            {/* Short Description */}
                            <p className="text-xs sm:text-[0.82rem] text-foreground-soft leading-relaxed">
                              {item.shortDescription}
                            </p>
                          </div>
                        </div>

                        {/* Right: Actor info */}
                        {item.actor && (
                          <div className="shrink-0 text-[0.7rem] text-foreground-faint pl-15 sm:pl-0 self-start sm:self-center">
                            <span>{item.actor}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
