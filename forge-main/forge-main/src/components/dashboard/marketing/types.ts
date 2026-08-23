export type ContentStatus = 'Draft' | 'Ready for Review' | 'Scheduled' | 'Published';
export type CampaignStatus = 'Active' | 'Draft' | 'Scheduled' | 'Completed';

export interface ContentDraft {
  id: string;
  title: string;
  channel: 'LinkedIn' | 'Press & Blog' | 'Website Copy' | 'Newsletter' | 'X / Twitter';
  campaignId: string;
  status: ContentStatus;
  scheduledFor?: string;
  author: string;
  excerpt: string;
  fullBody: string;
  lastUpdated: string;
  keyPoints: string[];
}

export interface Campaign {
  id: string;
  title: string;
  objective: string;
  audience: string;
  status: CampaignStatus;
  scheduledDate: string;
  lastActivity: string;
  contentCount: number;
  approvedCount: number;
  nextScheduledItem: string;
  summary: string;
}
