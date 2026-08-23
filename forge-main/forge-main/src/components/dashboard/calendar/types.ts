export type CalendarDepartment = 'hiring' | 'legal' | 'marketing' | 'finance';

export type EventStatus = 'confirmed' | 'upcoming' | 'deadline' | 'completed';

export interface CalendarEvent {
  id: string;
  title: string;
  department: CalendarDepartment;
  departmentLabel: string;
  date: string; // e.g. '2026-10-24'
  dayOfMonth: number;
  time: string; // e.g. '10:00 AM – 10:45 AM'
  status: EventStatus;
  statusLabel: string;
  description: string;
  attendees?: string[];
  location?: string;
  isUrgent?: boolean;
}
