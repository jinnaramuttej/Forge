import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Building2,
  Globe,
  Mail,
  ShieldCheck,
  Edit3,
  ExternalLink,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import { FounderProfile, StartupInfo } from './types';

const defaultFounder: FounderProfile = {
  name: 'Sarah Lin',
  email: 'founder@acme.com',
  role: 'Founder & Chief Executive Officer',
  avatarInitials: 'SL',
  location: 'San Francisco, CA',
  bio: 'Building autonomous company operations. Former VP of Product Engineering with 10+ years in distributed systems.',
};

const defaultStartup: StartupInfo = {
  name: 'Acme Inc.',
  industry: 'Enterprise Software & Autonomous Ops',
  stage: 'Seed Stage ($2.4M Raised)',
  website: 'https://acme.build',
  description:
    'Building the unified operating system for high-velocity tech companies. Orchestrating finance, hiring loops, legal compliance, and launch campaigns into a single synchronized graph.',
  foundedYear: '2026',
  headquarters: 'San Francisco, CA',
  entityType: 'Delaware C-Corporation',
};

import { useForge } from '../../../context/ForgeContext';

export default function ProfileView() {
  const { founder, startup, updateFounder, updateStartup } = useForge();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (newFounder: FounderProfile, newStartup: StartupInfo) => {
    updateFounder(newFounder);
    updateStartup(newStartup);
    setToastMessage('Profile and workspace details updated successfully.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-16 right-4 sm:right-8 z-50 flex items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-2.5 shadow-lg text-xs font-medium text-foreground"
          >
            <CheckCircle2 className="h-4 w-4 text-[var(--color-finance)]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
            <span>Identity & Workspace</span>
            <span>·</span>
            <span>Account Profile</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Profile
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            Your founder identity and workspace information.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => setIsEditOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all shadow-xs"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit profile →</span>
        </button>
      </div>

      {/* Main Editorial Container */}
      <div className="space-y-8">
        {/* Founder Profile Block */}
        <div className="rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Refined Avatar */}
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background font-display text-xl sm:text-2xl font-medium shadow-md">
                {founder.avatarInitials || 'SL'}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-display text-2xl sm:text-3xl text-foreground font-medium">
                    {founder.name}
                  </h2>
                  <span className="rounded-full bg-[var(--color-finance)]/10 text-[var(--color-finance)] border border-[var(--color-finance)]/20 px-2 py-0.5 text-[0.68rem] font-medium">
                    Active Owner
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-foreground-soft font-medium">
                  {founder.role}
                </div>
                <div className="flex items-center gap-3 text-[0.72rem] text-foreground-faint pt-0.5">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {founder.email}
                  </span>
                  {founder.location && (
                    <>
                      <span>·</span>
                      <span>{founder.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs">
            <div className="space-y-1">
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint block">
                Executive Role
              </span>
              <span className="font-medium text-foreground text-sm block">
                {founder.role}
              </span>
              <span className="text-foreground-soft text-[0.75rem]">
                Authorized signatory for board, bank & legal executions.
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint block">
                Authentication
              </span>
              <span className="font-medium text-foreground text-sm block">
                Google Workspace SSO
              </span>
              <span className="text-foreground-soft text-[0.75rem]">
                2-Factor Authentication enforced via security key.
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint block">
                Governance Clearance
              </span>
              <span className="font-medium text-foreground text-sm block">
                Level 4 (Full Autonomous Access)
              </span>
              <span className="text-foreground-soft text-[0.75rem]">
                Full authority over autonomous agent proposals & approvals.
              </span>
            </div>
          </div>
        </div>

        {/* Startup Information Block */}
        <div className="rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-5 w-5 text-foreground-soft" strokeWidth={1.75} />
              <h2 className="font-display text-xl text-foreground font-medium">
                Startup Information
              </h2>
            </div>
            <a
              href={startup.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-foreground-soft hover:text-foreground transition-colors"
            >
              <span>{startup.website.replace('https://', '')}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="space-y-1">
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint block">
                Startup Name
              </span>
              <span className="font-display text-base font-medium text-foreground block">
                {startup.name}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint block">
                Industry
              </span>
              <span className="font-medium text-foreground text-xs sm:text-sm block">
                {startup.industry}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint block">
                Funding Stage
              </span>
              <span className="font-medium text-foreground text-xs sm:text-sm block">
                {startup.stage}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint block">
                Entity Structure
              </span>
              <span className="font-medium text-foreground text-xs sm:text-sm block">
                {startup.entityType}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border/40">
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint block">
              Company Mission & Description
            </span>
            <p className="text-xs sm:text-sm text-foreground-soft leading-relaxed max-w-4xl">
              {startup.description}
            </p>
          </div>
        </div>

        {/* About your workspace Section */}
        <div className="rounded-2xl border border-border/70 bg-surface/30 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-border/50 pb-3">
            <Sparkles className="h-4 w-4 text-foreground-soft" strokeWidth={1.75} />
            <h3 className="font-display text-base text-foreground font-medium">
              About your workspace
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-foreground-soft leading-relaxed max-w-3xl">
            {startup.name} is connected to the FORGE Operational Graph. 4 autonomous agents actively draft legal agreements, monitor financial runway, screen talent pipelines, and stage marketing campaigns with human-in-the-loop governance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl border border-border/60 bg-surface/60 p-3 space-y-1">
              <span className="text-[0.68rem] font-mono text-foreground-faint">Connected Systems</span>
              <div className="text-xs font-medium text-foreground">Stripe, SVB, Greenhouse, Delaware DOS</div>
            </div>

            <div className="rounded-xl border border-border/60 bg-surface/60 p-3 space-y-1">
              <span className="text-[0.68rem] font-mono text-foreground-faint">Autonomy Status</span>
              <div className="text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                <span>Synchronized & Guarded</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-surface/60 p-3 space-y-1">
              <span className="text-[0.68rem] font-mono text-foreground-faint">Decision Protocol</span>
              <div className="text-xs font-medium text-foreground">One-Click Founder Sign-off</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        founder={founder}
        startup={startup}
        onSave={handleSave}
      />
    </div>
  );
}
