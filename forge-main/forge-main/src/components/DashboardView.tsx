import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Scale,
  CheckCircle2,
  Calendar as CalendarIcon,
  Activity as ActivityIcon,
  Menu,
  Sparkles,
} from 'lucide-react';
import Sidebar from './dashboard/Sidebar';
import TopBar from './dashboard/TopBar';
import FinanceView from './dashboard/finance/FinanceView';
import HiringView from './dashboard/hiring/HiringView';
import LegalView from './dashboard/legal/LegalView';
import MarketingView from './dashboard/marketing/MarketingView';
import ApprovalsView from './dashboard/approvals/ApprovalsView';
import CalendarView from './dashboard/calendar/CalendarView';
import ActivityView from './dashboard/activity/ActivityView';
import ProfileView from './dashboard/profile/ProfileView';
import SettingsView from './dashboard/settings/SettingsView';
import OverviewView from './dashboard/OverviewView';
import CommandModal from './dashboard/CommandModal';
import { DashboardNavId } from './dashboard/types';
import { ForgeProvider, useForge } from '../context/ForgeContext';

interface DashboardViewProps {
  onLogout: () => void;
}

function DashboardInner({ onLogout }: DashboardViewProps) {
  const { approvals, toast } = useForge();
  const [activeNav, setActiveNav] = useState<DashboardNavId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalCommandOpen, setGlobalCommandOpen] = useState(false);

  const pendingApprovalsCount = approvals.length;

  // Keyboard shortcut listener for Command Palette (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalCommandOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-foreground selection:text-background">
      {/* High-Visibility Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed bottom-6 right-4 sm:right-8 z-[9999] max-w-md w-[calc(100vw-2rem)] sm:w-auto flex items-start gap-3.5 rounded-2xl glass-liquid p-4 sm:p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.14)]"
          >
            {/* Status Icon Badge */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                toast.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                  : toast.type === 'info'
                  ? 'bg-[var(--color-hiring)]/10 border-[var(--color-hiring)]/30 text-[var(--color-hiring)]'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
            </div>

            {/* Content Text */}
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-foreground-faint">
                  System Notification
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="mt-0.5 text-xs sm:text-[0.84rem] font-medium text-foreground leading-snug">
                {toast.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 min-h-screen">
        {/* Left Application Sidebar (Sticky on desktop) */}
        <Sidebar
          activeId={activeNav}
          onSelect={(id) => {
            if (id === 'command') {
              setGlobalCommandOpen(true);
            } else {
              setActiveNav(id);
            }
          }}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Application Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <TopBar
            activeNav={activeNav}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onOpenCommand={() => setGlobalCommandOpen(true)}
            onLogout={onLogout}
            onSelectNav={(id) => setActiveNav(id)}
          />

          {/* Main Content Area (with bottom padding for mobile dock) */}
          <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
            {activeNav === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <OverviewView
                  onNavigate={(id) => setActiveNav(id)}
                  onNavigateToApprovals={() => setActiveNav('approvals')}
                  onNavigateToActivity={() => setActiveNav('activity')}
                  onNavigateToFinance={() => setActiveNav('finance')}
                  onNavigateToHiring={() => setActiveNav('hiring')}
                  onNavigateToLegal={() => setActiveNav('legal')}
                  onNavigateToMarketing={() => setActiveNav('marketing')}
                />
              </motion.div>
            ) : activeNav === 'finance' ? (
              <motion.div
                key="finance"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <FinanceView />
              </motion.div>
            ) : activeNav === 'hiring' ? (
              <motion.div
                key="hiring"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <HiringView />
              </motion.div>
            ) : activeNav === 'legal' ? (
              <motion.div
                key="legal"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <LegalView />
              </motion.div>
            ) : activeNav === 'marketing' ? (
              <motion.div
                key="marketing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <MarketingView />
              </motion.div>
            ) : activeNav === 'approvals' ? (
              <motion.div
                key="approvals"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ApprovalsView />
              </motion.div>
            ) : activeNav === 'calendar' ? (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <CalendarView />
              </motion.div>
            ) : activeNav === 'activity' ? (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ActivityView />
              </motion.div>
            ) : activeNav === 'profile' ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProfileView />
              </motion.div>
            ) : activeNav === 'settings' ? (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <SettingsView onLogout={onLogout} />
              </motion.div>
            ) : (
              <motion.div
                key={activeNav}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10"
              >
                <div className="border border-border/70 rounded-2xl bg-surface/40 p-8 sm:p-12 text-center max-w-xl mx-auto mt-12">
                  <div className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-foreground-faint">
                    Module Preview
                  </div>
                  <h2 className="mt-2 font-display text-2xl text-foreground font-medium capitalize">
                    {activeNav} Module
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-foreground-soft leading-relaxed">
                    This pillar integrates directly with FORGE's core operational graph.
                  </p>
                  <button
                    onClick={() => setActiveNav('overview')}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-colors shadow-2xs"
                  >
                    Return to Overview
                  </button>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Dock (Fixed at bottom on small viewports) */}
      <nav
        aria-label="Mobile Navigation Dock"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/92 backdrop-blur-md border-t border-border/80 px-2 py-1.5 flex items-center justify-around shadow-lg"
      >
        <button
          onClick={() => setActiveNav('overview')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-colors ${
            activeNav === 'overview' ? 'text-foreground font-medium' : 'text-foreground-faint hover:text-foreground'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" strokeWidth={activeNav === 'overview' ? 2 : 1.6} />
          <span className="text-[0.62rem]">Overview</span>
        </button>

        <button
          onClick={() => setActiveNav('finance')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-colors ${
            activeNav === 'finance' ? 'text-foreground font-medium' : 'text-foreground-faint hover:text-foreground'
          }`}
        >
          <TrendingUp className="h-4 w-4" strokeWidth={activeNav === 'finance' ? 2 : 1.6} />
          <span className="text-[0.62rem]">Finance</span>
        </button>

        <button
          onClick={() => setActiveNav('approvals')}
          className={`relative flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-colors ${
            activeNav === 'approvals' ? 'text-foreground font-medium' : 'text-foreground-faint hover:text-foreground'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" strokeWidth={activeNav === 'approvals' ? 2 : 1.6} />
          <span className="text-[0.62rem]">Approvals</span>
          {pendingApprovalsCount > 0 && (
            <span className="absolute top-1 right-2 h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveNav('calendar')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-colors ${
            activeNav === 'calendar' ? 'text-foreground font-medium' : 'text-foreground-faint hover:text-foreground'
          }`}
        >
          <CalendarIcon className="h-4 w-4" strokeWidth={activeNav === 'calendar' ? 2 : 1.6} />
          <span className="text-[0.62rem]">Calendar</span>
        </button>

        <button
          onClick={() => setActiveNav('activity')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-colors ${
            activeNav === 'activity' ? 'text-foreground font-medium' : 'text-foreground-faint hover:text-foreground'
          }`}
        >
          <ActivityIcon className="h-4 w-4" strokeWidth={activeNav === 'activity' ? 2 : 1.6} />
          <span className="text-[0.62rem]">Activity</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-foreground-faint hover:text-foreground transition-colors"
        >
          <Menu className="h-4 w-4" strokeWidth={1.6} />
          <span className="text-[0.62rem]">More</span>
        </button>
      </nav>

      {/* Global Command Palette */}
      <CommandModal
        isOpen={globalCommandOpen}
        onClose={() => setGlobalCommandOpen(false)}
        onNavigate={(id) => setActiveNav(id)}
      />
    </div>
  );
}

export default function DashboardView(props: DashboardViewProps) {
  return (
    <ForgeProvider>
      <DashboardInner {...props} />
    </ForgeProvider>
  );
}
