import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Users, Briefcase, Sparkles, Filter } from 'lucide-react';
import HiringOverview from './HiringOverview';
import OpenRolesList from './OpenRolesList';
import CandidatePipeline from './CandidatePipeline';
import CandidatePreview from './CandidatePreview';
import HiringInsight from './HiringInsight';
import CreateRoleModal from './CreateRoleModal';
import CandidateReviewModal from './CandidateReviewModal';
import { Candidate, Role, CandidateStage } from './types';
import { useForge } from '../../../context/ForgeContext';

export default function HiringView() {
  const { roles, candidates, addRole, updateCandidateStage, showToast } = useForge();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(candidates[0] || null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'roles' | 'insights'>('pipeline');
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [reviewModalCandidate, setReviewModalCandidate] = useState<Candidate | null>(null);

  const handleCreateRole = (roleData: Omit<Role, 'id' | 'candidatesCount' | 'currentStage' | 'lastActivity'>) => {
    addRole({
      ...roleData,
      candidatesCount: 0,
      currentStage: 'Initial sourcing',
      lastActivity: 'Just now',
    });
    showToast(`Published open role: ${roleData.title}`, 'success');
  };

  const handleAdvanceCandidate = (candidateId: string, action: 'offer' | 'advance' | 'reject') => {
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    if (action === 'offer') {
      updateCandidateStage(candidateId, 'offer');
      showToast(`Offer staged for ${cand.name}`, 'success');
    } else if (action === 'advance') {
      const nextStageMap: Record<CandidateStage, CandidateStage> = {
        new: 'screening',
        screening: 'interview',
        interview: 'final',
        final: 'offer',
        offer: 'offer',
      };
      updateCandidateStage(candidateId, nextStageMap[cand.stage] || 'offer');
      showToast(`Advanced ${cand.name} to ${nextStageMap[cand.stage]}`, 'info');
    }
  };

  // Filter candidates if role is selected
  const displayedCandidates = selectedRoleId
    ? candidates.filter((c) => c.roleId === selectedRoleId)
    : candidates;

  return (
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-hiring)]" />
            <span>02 · Talent</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Talent & Hiring
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            Pipeline orchestration, team consensus scorecards, and offer staging.
          </p>
        </div>

        {/* Contextual Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateRoleModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-all duration-150 shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Open Position</span>
          </button>
        </div>
      </div>

      {/* Hiring Overview (Clean Metrics Ribbon) */}
      <HiringOverview
        openRolesCount={roles.length}
        candidatesCount={candidates.length}
        interviewsCount={7}
        offersCount={2}
      />

      {/* Segmented Sub-Navigation Bar */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'pipeline', label: 'Candidate Pipeline', icon: Users },
            { id: 'roles', label: 'Open Headcount & Roles', icon: Briefcase },
            { id: 'insights', label: 'Sourcing Intelligence', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-foreground-soft hover:text-foreground hover:bg-foreground/[0.04]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {selectedRoleId && (
          <button
            onClick={() => setSelectedRoleId(null)}
            className="text-xs text-[var(--color-hiring)] hover:underline flex items-center gap-1"
          >
            <span>Filtered by role · Clear filter</span>
          </button>
        )}
      </div>

      {/* Tab 1: Candidate Pipeline */}
      {activeTab === 'pipeline' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Candidate Pipeline Kanban */}
          <CandidatePipeline
            candidates={displayedCandidates}
            selectedCandidateId={selectedCandidate?.id || null}
            onSelectCandidate={(cand) => setSelectedCandidate(cand)}
          />

          {/* Candidate Preview Detail */}
          <CandidatePreview
            candidate={selectedCandidate}
            onOpenFullReview={(cand) => setReviewModalCandidate(cand)}
          />
        </motion.div>
      )}

      {/* Tab 2: Open Roles */}
      {activeTab === 'roles' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <OpenRolesList
            roles={roles}
            selectedRoleId={selectedRoleId}
            onSelectRole={(id) => {
              setSelectedRoleId(id);
              if (id) setActiveTab('pipeline');
            }}
          />
        </motion.div>
      )}

      {/* Tab 3: Sourcing Intelligence */}
      {activeTab === 'insights' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <HiringInsight />

          <div className="rounded-2xl border border-border/70 bg-surface/35 p-6 flex flex-col sm:flex-row items-center gap-5 overflow-hidden">
            <div className="w-28 sm:w-32 shrink-0 flex items-center justify-center">
              <img
                src="/illustrations/hiring-team.png"
                alt="Team members collaborating in unison"
                className="w-full h-auto select-none opacity-90"
                draggable={false}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-hiring)]" />
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-foreground-faint">
                  Talent Density
                </span>
              </div>
              <h4 className="mt-1 font-display text-base font-medium text-foreground">
                High conviction hiring loops
              </h4>
              <p className="mt-1 text-xs text-foreground-soft leading-relaxed">
                Connect interview consensus, compensation bands, and onboarding legal documents directly to the founder command center.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={createRoleModalOpen}
        onClose={() => setCreateRoleModalOpen(false)}
        onSubmit={handleCreateRole}
      />

      {/* Candidate Review Modal */}
      <CandidateReviewModal
        candidate={reviewModalCandidate}
        onClose={() => setReviewModalCandidate(null)}
        onAdvanceStage={handleAdvanceCandidate}
      />
    </div>
  );
}
