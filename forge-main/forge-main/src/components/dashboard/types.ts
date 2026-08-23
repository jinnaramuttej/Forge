export type DashboardNavId =
  | 'overview'
  | 'command'
  | 'finance'
  | 'hiring'
  | 'legal'
  | 'marketing'
  | 'approvals'
  | 'calendar'
  | 'activity'
  | 'profile'
  | 'settings';

export interface AttentionItem {
  id: string;
  category: 'legal' | 'hiring' | 'marketing' | 'finance';
  categoryLabel: string;
  title: string;
  description: string;
  timeAgo: string;
  status: string;
  statusType: 'amber' | 'blue' | 'emerald' | 'rose' | 'neutral';
  actionLabel: string;
  details: {
    summary: string;
    keyPoints: string[];
    primaryAction: string;
    secondaryAction: string;
    metadata: { label: string; value: string }[];
  };
}

export interface PulseEvent {
  id: string;
  category: 'finance' | 'hiring' | 'legal' | 'marketing';
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
  system: string;
}

export interface SnapshotMetric {
  id: string;
  label: string;
  value: string;
  subtext: string;
  trend?: 'positive' | 'neutral' | 'attention';
  accentColor?: string;
}
