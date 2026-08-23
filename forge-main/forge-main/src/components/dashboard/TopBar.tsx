import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  ArrowUpRight,
  Check,
  ExternalLink,
  ChevronDown,
  User,
  Settings,
  LogOut,
  CheckCheck,
} from 'lucide-react';
import { DashboardNavId } from './types';
import { useForge } from '../../context/ForgeContext';

interface TopBarProps {
  activeNav: DashboardNavId;
  onOpenMobileMenu: () => void;
  onOpenCommand: () => void;
  onLogout: () => void;
  onSelectNav?: (id: DashboardNavId) => void;
}

const navTitles: Record<DashboardNavId, { title: string; breadcrumb: string }> = {
  overview: { title: 'Overview', breadcrumb: 'Acme Inc.' },
  command: { title: 'Command OS', breadcrumb: 'Executive Surface' },
  finance: { title: 'Finance', breadcrumb: 'Acme Inc.' },
  hiring: { title: 'Hiring Pipeline', breadcrumb: 'Talent' },
  legal: { title: 'Legal & Compliance', breadcrumb: 'Corporate' },
  marketing: { title: 'Marketing', breadcrumb: 'Growth' },
  approvals: { title: 'Approvals', breadcrumb: 'Governance' },
  calendar: { title: 'Company Calendar', breadcrumb: 'Operations' },
  activity: { title: 'Audit & Activity Log', breadcrumb: 'Operations' },
  profile: { title: 'Profile', breadcrumb: 'Founder' },
  settings: { title: 'Settings', breadcrumb: 'Workspace' },
};

export default function TopBar({
  activeNav,
  onOpenMobileMenu,
  onOpenCommand,
  onLogout,
  onSelectNav,
}: TopBarProps) {
  const { founder, startup, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useForge();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const current = navTitles[activeNav] || { title: 'Overview', breadcrumb: startup.name };
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleNotificationClick = (id: string, targetNav?: DashboardNavId) => {
    markNotificationAsRead(id);
    if (targetNav && onSelectNav) {
      onSelectNav(targetNav);
      setShowNotifications(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/70 glass-liquid px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden rounded-lg p-1.5 text-foreground-soft hover:bg-foreground/[0.05] hover:text-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Contextual Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-[0.82rem]">
          <span className="text-foreground-faint font-medium">{startup.name}</span>
          <span className="text-foreground-faint/60">/</span>
          <span className="font-semibold text-foreground">{current.title}</span>
        </div>
      </div>

      {/* Right: Search trigger, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Global Search / Command trigger */}
        <button
          onClick={onOpenCommand}
          className="group flex items-center gap-2 sm:gap-3 rounded-full glass-pill px-3.5 py-1.5 text-xs text-foreground-soft hover:text-foreground transition-all duration-150 shadow-xs cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 text-foreground-faint group-hover:text-foreground transition-colors" strokeWidth={1.75} />
          <span className="hidden sm:inline text-foreground-soft font-medium">Command or search...</span>
          <span className="inline sm:hidden text-foreground-soft">Command</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border/80 bg-foreground/[0.04] px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-faint">
            ⌘K
          </kbd>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            aria-label="Notifications"
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-surface/50 text-foreground-soft hover:border-foreground/20 hover:text-foreground transition-colors"
          >
            <Bell className="h-3.5 w-3.5" strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border/90 bg-surface p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="text-xs font-medium text-foreground">Notifications</span>
                <div className="flex items-center gap-2">
                  <span className="text-[0.65rem] text-foreground-faint uppercase tracking-wider">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      title="Mark all as read"
                      className="text-[0.65rem] text-foreground hover:underline flex items-center gap-0.5"
                    >
                      <CheckCheck className="h-3 w-3" />
                      <span>Read all</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-2 divide-y divide-border/40 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id, n.targetNav)}
                    className={`py-2.5 px-1 flex items-start gap-2.5 cursor-pointer rounded-lg hover:bg-foreground/[0.03] transition-colors ${
                      n.unread ? 'opacity-100' : 'opacity-70'
                    }`}
                  >
                    <span
                      className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                        n.unread ? 'bg-[var(--color-accent)]' : 'bg-foreground/20'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-foreground font-medium leading-snug">{n.title}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-[0.68rem] text-foreground-faint">
                        <span>{n.category}</span>
                        <span>·</span>
                        <span>{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="mt-2 w-full text-center py-1.5 text-xs text-foreground-soft hover:text-foreground transition-colors border-t border-border/60"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-full border border-border/70 bg-surface/50 pl-1 pr-2 sm:pr-2.5 py-1 hover:border-foreground/20 transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[0.65rem] font-medium text-background">
              {founder.avatarInitials || 'SL'}
            </div>
            <span className="hidden md:inline text-xs font-medium text-foreground">
              {founder.name.split(' ')[0]}
            </span>
            <ChevronDown className="h-3 w-3 text-foreground-faint" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border/90 bg-surface p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-border/60">
                <div className="text-xs font-medium text-foreground">{founder.name}</div>
                <div className="text-[0.68rem] text-foreground-faint truncate">{founder.email}</div>
              </div>
              <div className="py-1 space-y-0.5">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onSelectNav) onSelectNav('profile');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-foreground hover:bg-foreground/[0.05] transition-colors text-left"
                >
                  <User className="h-3.5 w-3.5 text-foreground-faint" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onSelectNav) onSelectNav('settings');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-foreground hover:bg-foreground/[0.05] transition-colors text-left"
                >
                  <Settings className="h-3.5 w-3.5 text-foreground-faint" />
                  <span>Settings</span>
                </button>
              </div>
              <div className="border-t border-border/60 pt-1">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-rose-800 hover:bg-rose-950/10 transition-colors text-left"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-800" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
