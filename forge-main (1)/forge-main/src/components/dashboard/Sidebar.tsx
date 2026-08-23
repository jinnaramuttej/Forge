import React from 'react';
import {
  LayoutDashboard,
  Terminal,
  TrendingUp,
  Users,
  Scale,
  Megaphone,
  CheckCircle2,
  Calendar,
  Activity,
  Settings,
  User,
  X,
} from 'lucide-react';
import { DashboardNavId } from './types';

interface SidebarProps {
  activeId: DashboardNavId;
  onSelect: (id: DashboardNavId) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const primaryNav: { id: DashboardNavId; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'command', label: 'Command', icon: Terminal },
  { id: 'finance', label: 'Finance', icon: TrendingUp },
  { id: 'hiring', label: 'Hiring', icon: Users },
  { id: 'legal', label: 'Legal', icon: Scale },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
];

const secondaryNav: { id: DashboardNavId; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; badge?: string }[] = [
  { id: 'approvals', label: 'Approvals', icon: CheckCircle2, badge: '3' },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'activity', label: 'Activity', icon: Activity },
];

import { useForge } from '../../context/ForgeContext';

export default function Sidebar({
  activeId,
  onSelect,
  isOpenMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const { approvals, startup, founder } = useForge();
  const pendingApprovalsCount = approvals.length;

  const dynamicSecondaryNav = [
    {
      id: 'approvals' as DashboardNavId,
      label: 'Approvals',
      icon: CheckCircle2,
      badge: pendingApprovalsCount > 0 ? String(pendingApprovalsCount) : undefined,
    },
    { id: 'calendar' as DashboardNavId, label: 'Calendar', icon: Calendar },
    { id: 'activity' as DashboardNavId, label: 'Activity', icon: Activity },
  ];

  const content = (
    <div className="flex h-full flex-col justify-between p-5 lg:p-6">
      {/* Top Section */}
      <div>
        {/* Brand Wordmark */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-[1.35rem] font-medium tracking-tight text-foreground">
              FORGE
            </span>
            <span className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-foreground-faint">
              v1.0
            </span>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              aria-label="Close sidebar"
              className="lg:hidden rounded-md p-1.5 text-foreground-faint hover:bg-foreground/[0.05] hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Divider / spacing */}
        <div className="mt-4 mb-5 border-b border-border/50" />

        {/* Primary Navigation */}
        <div className="space-y-0.5">
          <div className="px-3 pb-1.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
            Core Operations
          </div>
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[0.84rem] transition-all duration-150 ${
                  isActive
                    ? 'font-medium text-foreground bg-foreground/[0.05]'
                    : 'text-foreground-soft hover:bg-foreground/[0.03] hover:text-foreground'
                }`}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute left-1.5 h-1.5 w-1.5 rounded-full bg-foreground" />
                )}
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? 'text-foreground ml-1' : 'text-foreground-faint group-hover:text-foreground-soft'
                  }`}
                  strokeWidth={isActive ? 2 : 1.6}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-border/60" />

        {/* Secondary Navigation */}
        <div className="space-y-0.5">
          <div className="px-3 pb-1.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
            Workflow
          </div>
          {dynamicSecondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-[0.84rem] transition-all duration-150 ${
                  isActive
                    ? 'font-medium text-foreground bg-foreground/[0.05]'
                    : 'text-foreground-soft hover:bg-foreground/[0.03] hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isActive && (
                    <span className="absolute left-1.5 h-1.5 w-1.5 rounded-full bg-foreground" />
                  )}
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-foreground ml-1' : 'text-foreground-faint group-hover:text-foreground-soft'
                    }`}
                    strokeWidth={isActive ? 2 : 1.6}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-foreground/[0.07] px-1.5 py-0.5 text-[0.68rem] font-mono text-foreground-soft">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile & Settings */}
      <div className="mt-6 border-t border-border/60 pt-4 space-y-1">
        <button
          onClick={() => {
            onSelect('settings');
            if (onCloseMobile) onCloseMobile();
          }}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[0.84rem] transition-colors ${
            activeId === 'settings'
              ? 'font-medium text-foreground bg-foreground/[0.05]'
              : 'text-foreground-soft hover:bg-foreground/[0.03] hover:text-foreground'
          }`}
        >
          <Settings className="h-4 w-4 text-foreground-faint" strokeWidth={1.6} />
          <span>Settings</span>
        </button>

        {/* User Card (Profile Navigation) */}
        <div
          onClick={() => {
            onSelect('profile');
            if (onCloseMobile) onCloseMobile();
          }}
          className={`mt-2 flex items-center justify-between rounded-lg px-3 py-2 transition-colors cursor-pointer ${
            activeId === 'profile'
              ? 'bg-foreground/[0.06] ring-1 ring-border text-foreground'
              : 'hover:bg-foreground/[0.03]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background font-medium text-xs shadow-2xs">
              {founder.avatarInitials || 'SL'}
            </div>
            <div className="min-w-0 flex flex-col leading-tight">
              <span className="truncate text-xs font-medium text-foreground">
                {founder.name}
              </span>
              <span className="truncate text-[0.68rem] text-foreground-faint">
                {founder.role}
              </span>
            </div>
          </div>
          <span className="text-[0.65rem] font-mono text-foreground-faint uppercase">
            Profile
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Sticky Scrolled Left) */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border/70 bg-surface/35 backdrop-blur-sm select-none sticky top-0 h-screen overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-xs transition-opacity duration-200"
          />

          {/* Drawer Body */}
          <div className="relative z-10 w-72 max-w-[85vw] bg-surface border-r border-border shadow-2xl flex flex-col">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
