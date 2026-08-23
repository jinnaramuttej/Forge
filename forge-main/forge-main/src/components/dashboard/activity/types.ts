export type ActivityDepartment = 'finance' | 'hiring' | 'legal' | 'marketing';

export interface ActivityEvent {
  id: string;
  time: string;
  dateGroup: 'Today' | 'Yesterday' | 'Earlier this week' | 'Last week';
  department: ActivityDepartment;
  departmentLabel: string;
  action: string;
  shortDescription: string;
  actor?: string;
  system?: string;
}
