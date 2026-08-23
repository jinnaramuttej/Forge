import { DashboardNavId } from '../components/dashboard/types';

export type CommandDepartment =
  | 'legal'
  | 'finance'
  | 'hiring'
  | 'marketing'
  | 'approvals'
  | 'calendar'
  | 'activity'
  | 'system';

export interface CommandProcessingStep {
  phase: 'understanding' | 'preparing' | 'ready';
  label: string;
  subtext: string;
}

export interface CommandResult {
  id: string;
  query: string;
  department: CommandDepartment;
  departmentLabel: string;
  title: string;
  summary: string;
  actionLabel: string;
  targetNav: DashboardNavId;
  metadata?: { label: string; value: string }[];
  tags?: string[];
}

export type SearchResultGroup = 'Pages' | 'Documents' | 'People' | 'Campaigns' | 'Activities';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  group: SearchResultGroup;
  targetNav: DashboardNavId;
  department?: 'legal' | 'finance' | 'hiring' | 'marketing';
  badge?: string;
  iconName?: string;
}

export interface QuickActionItem {
  id: string;
  label: string;
  category: string;
  targetNav: DashboardNavId;
  shortcut?: string;
}
