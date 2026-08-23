import { SearchResultItem, SearchResultGroup, QuickActionItem } from './types';
import { MOCK_SEARCH_ITEMS, MOCK_QUICK_ACTIONS, SUGGESTED_COMMANDS } from './mockData';
import { ForgeState } from '../types/forge';

export async function searchWorkspace(query: string, state?: ForgeState): Promise<SearchResultItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Build live search corpus if state is passed
  let itemsToSearch = MOCK_SEARCH_ITEMS;

  if (state) {
    const liveDocItems: SearchResultItem[] = state.legalDocuments.map((doc) => ({
      id: doc.id,
      title: doc.title,
      subtitle: `${doc.type} · ${doc.counterparty} (${doc.status})`,
      group: 'Documents',
      targetNav: 'legal',
      department: 'legal',
      badge: doc.status,
    }));

    const liveCandidateItems: SearchResultItem[] = state.candidates.map((cand) => ({
      id: cand.id,
      title: cand.name,
      subtitle: `${cand.roleTitle} · Stage: ${cand.stage.toUpperCase()} (${cand.matchScore}/100)`,
      group: 'People',
      targetNav: 'hiring',
      department: 'hiring',
      badge: cand.stage.toUpperCase(),
    }));

    const liveCampaignItems: SearchResultItem[] = state.campaigns.map((camp) => ({
      id: camp.id,
      title: camp.title,
      subtitle: `${camp.objective} (${camp.status})`,
      group: 'Campaigns',
      targetNav: 'marketing',
      department: 'marketing',
      badge: camp.status,
    }));

    const liveActivityItems: SearchResultItem[] = state.activities.slice(0, 10).map((act) => ({
      id: act.id,
      title: `${act.action} — ${act.time}`,
      subtitle: act.shortDescription,
      group: 'Activities',
      targetNav: 'activity',
      department: act.department,
    }));

    const pageItems: SearchResultItem[] = [
      { id: 'p-ov', title: 'Overview', subtitle: 'Executive pulse & metrics', group: 'Pages', targetNav: 'overview' },
      { id: 'p-fin', title: 'Finance', subtitle: `Runway: ${state.finance.runway}, Burn: ${state.finance.monthlyBurn}`, group: 'Pages', targetNav: 'finance', department: 'finance' },
      { id: 'p-hir', title: 'Hiring', subtitle: `${state.candidates.length} active candidates in pipeline`, group: 'Pages', targetNav: 'hiring', department: 'hiring' },
      { id: 'p-leg', title: 'Legal', subtitle: `${state.legalDocuments.length} contracts & corporate vault`, group: 'Pages', targetNav: 'legal', department: 'legal' },
      { id: 'p-mkt', title: 'Marketing', subtitle: `${state.campaigns.length} campaigns & press releases`, group: 'Pages', targetNav: 'marketing', department: 'marketing' },
      { id: 'p-app', title: 'Approvals', subtitle: `${state.approvals.length} pending actions`, group: 'Pages', targetNav: 'approvals', badge: `${state.approvals.length} Pending` },
      { id: 'p-cal', title: 'Calendar', subtitle: `${state.calendarEvents.length} scheduled events`, group: 'Pages', targetNav: 'calendar' },
      { id: 'p-act', title: 'Activity', subtitle: `${state.activities.length} audit logs`, group: 'Pages', targetNav: 'activity' },
      { id: 'p-pro', title: 'Profile', subtitle: `${state.founder.name} (${state.founder.role})`, group: 'Pages', targetNav: 'profile' },
      { id: 'p-set', title: 'Settings', subtitle: 'Workspace preferences & security', group: 'Pages', targetNav: 'settings' },
    ];

    itemsToSearch = [
      ...pageItems,
      ...liveDocItems,
      ...liveCandidateItems,
      ...liveCampaignItems,
      ...liveActivityItems,
    ];
  }

  return itemsToSearch.filter((item) => {
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.group.toLowerCase().includes(q) ||
      (item.department && item.department.toLowerCase().includes(q))
    );
  });
}

export function groupSearchResults(
  items: SearchResultItem[]
): { group: SearchResultGroup; items: SearchResultItem[] }[] {
  const groupsOrder: SearchResultGroup[] = ['Pages', 'Documents', 'People', 'Campaigns', 'Activities'];
  const grouped: { group: SearchResultGroup; items: SearchResultItem[] }[] = [];

  for (const group of groupsOrder) {
    const matching = items.filter((i) => i.group === group);
    if (matching.length > 0) {
      grouped.push({ group, items: matching });
    }
  }

  return grouped;
}

export function getQuickActions(): QuickActionItem[] {
  return MOCK_QUICK_ACTIONS;
}

export function getSuggestedCommands(): string[] {
  return SUGGESTED_COMMANDS;
}
