export interface FounderProfile {
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
  location?: string;
  bio?: string;
}

export interface StartupInfo {
  name: string;
  industry: string;
  stage: string;
  website: string;
  description: string;
  foundedYear: string;
  headquarters: string;
  entityType: string;
}
