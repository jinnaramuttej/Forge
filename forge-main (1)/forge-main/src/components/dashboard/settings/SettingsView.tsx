import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Building2,
  Bell,
  Sliders,
  Shield,
  CheckCircle2,
  LogOut,
  Moon,
  Sun,
  Laptop,
  Lock,
  Key,
  Globe,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
} from 'lucide-react';

interface SettingsViewProps {
  onLogout: () => void;
}

type SettingsSection = 'account' | 'workspace' | 'notifications' | 'preferences' | 'security';

import { useForge } from '../../../context/ForgeContext';

export default function SettingsView({ onLogout }: SettingsViewProps) {
  const { founder, startup, updateFounder, updateStartup, showToast } = useForge();
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');

  // Account State
  const [email, setEmail] = useState(founder.email);
  const [profileVisibility, setProfileVisibility] = useState(true);

  // Workspace State
  const [startupName, setStartupName] = useState(startup.name);
  const [industry, setIndustry] = useState(startup.industry);
  const [startupStage, setStartupStage] = useState(startup.stage);
  const [currency, setCurrency] = useState('USD ($)');
  const [timezone, setTimezone] = useState('America/Los_Angeles (PST)');

  // Notification Toggles
  const [notifyApprovals, setNotifyApprovals] = useState(true);
  const [notifyHiring, setNotifyHiring] = useState(true);
  const [notifyFinance, setNotifyFinance] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);

  // Preferences State
  const [themeMode, setThemeMode] = useState<'warm' | 'mono'>('warm');
  const [defaultView, setDefaultView] = useState('overview');
  const [dateFormat, setDateFormat] = useState('MMM DD, YYYY');

  // Password Modal / Demo state
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const navItems: { id: SettingsSection; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'workspace', label: 'Workspace', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
            <span>Configuration & Controls</span>
            <span>·</span>
            <span>Organization</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Settings
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            Manage your FORGE workspace.
          </p>
        </div>
      </div>

      {/* Main Settings Layout: Left Nav List (4 cols) & Right Form Panel (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation List */}
        <div className="lg:col-span-4 rounded-2xl border border-border/70 bg-surface/40 p-3 sm:p-4 space-y-1">
          {/* Mobile responsive horizontal tabs */}
          <div className="flex lg:flex-col overflow-x-auto gap-1 scrollbar-none pb-1 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all shrink-0 lg:w-full ${
                    isActive
                      ? 'bg-foreground text-background shadow-xs'
                      : 'text-foreground-soft hover:bg-foreground/[0.04] hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={isActive ? 2 : 1.6} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:block pt-4 mt-4 border-t border-border/50">
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-rose-900/80 hover:bg-rose-950/[0.04] hover:text-rose-900 transition-colors"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.6} />
              <span>Sign out</span>
            </button>
          </div>
        </div>

        {/* Content Area Panel */}
        <div className="lg:col-span-8 rounded-2xl border border-border/70 bg-surface/60 p-6 sm:p-8 space-y-6">
          {/* 1. ACCOUNT SETTINGS */}
          {activeSection === 'account' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border/50 pb-4">
                <h2 className="font-display text-xl text-foreground font-medium">
                  Account Settings
                </h2>
                <p className="text-xs text-foreground-soft mt-0.5">
                  Manage your personal founder credentials and access.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                    Email Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-border/80 bg-surface/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                    />
                    <button
                      onClick={() => showToast('Email address updated.')}
                      className="rounded-lg border border-border/80 bg-surface px-4 py-2 text-xs font-medium text-foreground-soft hover:text-foreground transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-foreground">Password</div>
                      <div className="text-[0.72rem] text-foreground-faint">
                        Last updated 2 weeks ago · 2FA Enforced
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setPasswordUpdated(true);
                        showToast('Password reset link sent to your email.');
                      }}
                      className="rounded-lg border border-border/80 bg-surface px-3.5 py-1.5 text-xs font-medium text-foreground-soft hover:text-foreground transition-colors"
                    >
                      Change password
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-foreground">
                        Profile Visibility
                      </div>
                      <div className="text-[0.72rem] text-foreground-faint">
                        Display profile in public investor & partner portal
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setProfileVisibility(!profileVisibility);
                        showToast(
                          `Profile visibility set to ${
                            !profileVisibility ? 'Public' : 'Private'
                          }.`
                        );
                      }}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        profileVisibility ? 'bg-foreground' : 'bg-foreground/20'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-background transition duration-200 ease-in-out ${
                          profileVisibility ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. WORKSPACE SETTINGS */}
          {activeSection === 'workspace' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border/50 pb-4">
                <h2 className="font-display text-xl text-foreground font-medium">
                  Workspace Configuration
                </h2>
                <p className="text-xs text-foreground-soft mt-0.5">
                  Update primary parameters for Acme Inc.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                      Startup Name
                    </label>
                    <input
                      type="text"
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      className="w-full rounded-lg border border-border/80 bg-surface/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                      Funding Stage
                    </label>
                    <input
                      type="text"
                      value={startupStage}
                      onChange={(e) => setStartupStage(e.target.value)}
                      className="w-full rounded-lg border border-border/80 bg-surface/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                    Industry Domain
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full rounded-lg border border-border/80 bg-surface/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                  <div>
                    <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                      Primary Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full rounded-lg border border-border/80 bg-surface/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                    >
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                      Workspace Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full rounded-lg border border-border/80 bg-surface/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                    >
                      <option>America/Los_Angeles (PST)</option>
                      <option>America/New_York (EST)</option>
                      <option>Europe/London (GMT)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => showToast('Workspace settings saved.')}
                    className="rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-colors shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. NOTIFICATIONS SETTINGS */}
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border/50 pb-4">
                <h2 className="font-display text-xl text-foreground font-medium">
                  Notification Preferences
                </h2>
                <p className="text-xs text-foreground-soft mt-0.5">
                  Control which autonomous agents notify you for approvals and updates.
                </p>
              </div>

              <div className="space-y-4 divide-y divide-border/40">
                <div className="flex items-center justify-between pt-2 first:pt-0">
                  <div>
                    <div className="text-xs font-medium text-foreground">
                      Approval Notifications
                    </div>
                    <div className="text-[0.72rem] text-foreground-faint">
                      Alert immediately when an NDA, hire offer, or invoice needs sign-off
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifyApprovals(!notifyApprovals)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      notifyApprovals ? 'bg-foreground' : 'bg-foreground/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-background transition duration-200 ease-in-out ${
                        notifyApprovals ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <div className="text-xs font-medium text-foreground">
                      Hiring Pipeline Updates
                    </div>
                    <div className="text-[0.72rem] text-foreground-faint">
                      Receive notifications when top candidate scores exceed 90th percentile
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifyHiring(!notifyHiring)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      notifyHiring ? 'bg-foreground' : 'bg-foreground/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-background transition duration-200 ease-in-out ${
                        notifyHiring ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <div className="text-xs font-medium text-foreground">
                      Finance & Burn Alerts
                    </div>
                    <div className="text-[0.72rem] text-foreground-faint">
                      Weekly summary of bank reconciliation and cash runway shifts
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifyFinance(!notifyFinance)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      notifyFinance ? 'bg-foreground' : 'bg-foreground/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-background transition duration-200 ease-in-out ${
                        notifyFinance ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <div className="text-xs font-medium text-foreground">
                      Marketing & Launch Alerts
                    </div>
                    <div className="text-[0.72rem] text-foreground-faint">
                      Staged drafts for press, Substack, and Product Hunt announcements
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifyMarketing(!notifyMarketing)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      notifyMarketing ? 'bg-foreground' : 'bg-foreground/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-background transition duration-200 ease-in-out ${
                        notifyMarketing ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 4. PREFERENCES */}
          {activeSection === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border/50 pb-4">
                <h2 className="font-display text-xl text-foreground font-medium">
                  Workspace Preferences
                </h2>
                <p className="text-xs text-foreground-soft mt-0.5">
                  Tailor the look and default operational surfaces.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[0.72rem] font-medium text-foreground-soft mb-2">
                    Visual Aesthetic Theme
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setThemeMode('warm');
                        showToast('Warm Editorial theme selected.');
                      }}
                      className={`rounded-xl border p-3.5 text-left transition-all ${
                        themeMode === 'warm'
                          ? 'border-foreground bg-surface shadow-xs ring-1 ring-foreground/20'
                          : 'border-border/70 bg-surface/40 hover:border-foreground/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-medium text-xs text-foreground">Warm Editorial (Default)</span>
                        <div className="h-3 w-3 rounded-full bg-[#F6F1E8] border border-foreground/20" />
                      </div>
                      <p className="text-[0.68rem] text-foreground-soft">
                        Classic Fraunces typography with warm off-white surface tones.
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setThemeMode('mono');
                        showToast('Minimal Monochrome theme selected.');
                      }}
                      className={`rounded-xl border p-3.5 text-left transition-all ${
                        themeMode === 'mono'
                          ? 'border-foreground bg-surface shadow-xs ring-1 ring-foreground/20'
                          : 'border-border/70 bg-surface/40 hover:border-foreground/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-medium text-xs text-foreground">Minimal Monochrome</span>
                        <div className="h-3 w-3 rounded-full bg-white border border-foreground/30" />
                      </div>
                      <p className="text-[0.68rem] text-foreground-soft">
                        High contrast, stark ink foundation with neutral paper accents.
                      </p>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                  <div>
                    <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                      Default Startup View
                    </label>
                    <select
                      value={defaultView}
                      onChange={(e) => {
                        setDefaultView(e.target.value);
                        showToast(`Default view set to ${e.target.value}.`);
                      }}
                      className="w-full rounded-lg border border-border/80 bg-surface/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                    >
                      <option value="overview">Executive Overview</option>
                      <option value="approvals">Pending Approvals</option>
                      <option value="finance">Finance Ledger</option>
                      <option value="hiring">Talent Pipeline</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                      Date Display Format
                    </label>
                    <select
                      value={dateFormat}
                      onChange={(e) => {
                        setDateFormat(e.target.value);
                        showToast(`Date format set to ${e.target.value}.`);
                      }}
                      className="w-full rounded-lg border border-border/80 bg-surface/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                    >
                      <option>MMM DD, YYYY (Oct 24, 2026)</option>
                      <option>DD MMM YYYY (24 Oct 2026)</option>
                      <option>YYYY-MM-DD (2026-10-24)</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. SECURITY */}
          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border/50 pb-4">
                <h2 className="font-display text-xl text-foreground font-medium">
                  Security & Active Sessions
                </h2>
                <p className="text-xs text-foreground-soft mt-0.5">
                  Demo security controls and authentication state.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-border/70 bg-surface/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4 text-foreground-soft" />
                      <span className="text-xs font-medium text-foreground">Current Active Session</span>
                    </div>
                    <span className="rounded-full bg-emerald-950/10 text-emerald-800 text-[0.65rem] font-medium px-2 py-0.5 border border-emerald-800/20">
                      Active Now
                    </span>
                  </div>
                  <div className="text-[0.72rem] text-foreground-soft space-y-0.5 pl-6">
                    <div>Chrome on macOS · San Francisco, CA (IP: 198.51.100.24)</div>
                    <div className="text-foreground-faint font-mono">Session Token: SHA-256 (Valid for 14d)</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-foreground">Two-Factor Authentication</div>
                    <div className="text-[0.72rem] text-foreground-faint">FIDO2 WebAuthn Hardware Key Active</div>
                  </div>
                  <span className="text-xs text-[var(--color-finance)] font-medium">Configured</span>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-rose-900">Sign out of all sessions</div>
                    <div className="text-[0.72rem] text-foreground-faint">
                      Terminate access and return to public launch site
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="rounded-lg border border-rose-900/30 bg-rose-950/[0.04] px-4 py-1.5 text-xs font-medium text-rose-900 hover:bg-rose-950/[0.08] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
