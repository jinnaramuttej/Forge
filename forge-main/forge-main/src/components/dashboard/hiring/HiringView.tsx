import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Users, ArrowUpRight } from 'lucide-react';
import HiringOverview from './HiringOverview';
import OpenRolesList from './OpenRolesList';
import CandidatePipeline from './CandidatePipeline';
import CandidatePreview from './CandidatePreview';
import HiringInsight from './HiringInsight';
import CreateRoleModal from './CreateRoleModal';
import CandidateReviewModal from './CandidateReviewModal';
import { Candidate, Role, CandidateStage } from './types';

const initialRoles: Role[] = [
  {
    id: 'role-fe',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    candidatesCount: 11,
    currentStage: 'Final loops (2 candidates)',
    lastActivity: '45m ago',
    status: 'Interviewing',
    targetDate: 'Nov 15, 2026',
  },
  {
    id: 'role-des',
    title: 'Product Designer',
    department: 'Design',
    candidatesCount: 8,
    currentStage: 'Design portfolio review',
    lastActivity: '2h ago',
    status: 'Interviewing',
    targetDate: 'Dec 01, 2026',
  },
  {
    id: 'role-growth',
    title: 'Growth Lead',
    department: 'Growth',
    candidatesCount: 5,
    currentStage: 'Offer stage (1 candidate)',
    lastActivity: 'Yesterday',
    status: 'Reviewing',
    targetDate: 'Nov 20, 2026',
  },
  {
    id: 'role-be',
    title: 'Backend Engineer',
    department: 'Engineering',
    candidatesCount: 4,
    currentStage: 'Initial technical screens',
    lastActivity: 'Oct 20',
    status: 'Active',
    targetDate: 'Dec 15, 2026',
  },
];

const initialCandidates: Candidate[] = [
  {
    id: 'cand-marcus',
    name: 'Marcus Chen',
    roleId: 'role-fe',
    roleTitle: 'Senior Frontend Engineer',
    stage: 'new',
    experience: '5 yrs exp',
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    matchScore: 94,
    matchReason: 'Strong open-source UI component author. High alignment with FORGE web client requirements.',
    lastActivity: '1h ago',
    rating: 'Strong Fit',
    currentCompany: 'Vercel Ecosystem',
    education: 'B.S. CS, UC Berkeley',
    notes: 'Excellently structured GitHub portfolio.',
  },
  {
    id: 'cand-elena',
    name: 'Elena Rostov',
    roleId: 'role-growth',
    roleTitle: 'Growth Lead',
    stage: 'new',
    experience: '6 yrs exp',
    skills: ['PLG Funnels', 'SQL', 'Lifecycle', 'Experimentation'],
    matchScore: 89,
    matchReason: 'Scaled early-stage B2B developer tool from $20K to $150K MRR.',
    lastActivity: '3h ago',
    rating: 'Reviewing',
    currentCompany: 'Linear Partner Co',
    education: 'B.A. Economics, Stanford',
    notes: 'Strong analytical mindset.',
  },
  {
    id: 'cand-theo',
    name: 'Theo Dumas',
    roleId: 'role-fe',
    roleTitle: 'Senior Frontend Engineer',
    stage: 'screening',
    experience: '7 yrs exp',
    skills: ['Performance', 'WebGL', 'TypeScript', 'WASM'],
    matchScore: 92,
    matchReason: 'Deep systems UI performance optimization experience. Passed initial screening loop.',
    lastActivity: 'Yesterday',
    rating: 'Screening Passed',
    currentCompany: 'Figma Ecosystem',
    education: 'M.S. Software Eng, ETH Zurich',
    notes: 'Very articulate on frontend performance profiling.',
  },
  {
    id: 'cand-carlos',
    name: 'Carlos Mendez',
    roleId: 'role-be',
    roleTitle: 'Backend Engineer',
    stage: 'screening',
    experience: '4 yrs exp',
    skills: ['Go', 'PostgreSQL', 'Distributed Systems', 'Kafka'],
    matchScore: 88,
    matchReason: 'Experience building real-time data sync engines at seed-stage startup.',
    lastActivity: '2d ago',
    rating: 'Screening Scheduled',
    currentCompany: 'Supabase Ecosystem',
    education: 'B.S. CS, UT Austin',
    notes: 'Good technical fundamentals.',
  },
  {
    id: 'cand-maya',
    name: 'Maya Lin',
    roleId: 'role-des',
    roleTitle: 'Product Designer',
    stage: 'interview',
    experience: '6 yrs exp',
    skills: ['Figma', 'Design Systems', 'Micro-interactions', 'Typography'],
    matchScore: 95,
    matchReason: 'Exceptional craft and editorial typography aesthetic. Matches FORGE design philosophy.',
    lastActivity: 'Today, 9 AM',
    rating: 'Deep Dive Complete',
    currentCompany: 'Notion Community',
    education: 'B.F.A. Interaction Design, RISD',
    notes: 'Superb portfolio walkthrough.',
  },
  {
    id: 'cand-soren',
    name: 'Soren Patel',
    roleId: 'role-fe',
    roleTitle: 'Senior Frontend Engineer',
    stage: 'interview',
    experience: '5 yrs exp',
    skills: ['React', 'State Machines', 'Animation', 'TypeScript'],
    matchScore: 91,
    matchReason: 'Experienced in canvas rendering and complex web application state graphs.',
    lastActivity: 'Oct 21',
    rating: 'Technical Screened',
    currentCompany: 'Retool Alum',
    education: 'B.S. Computer Eng, Waterloo',
    notes: 'Solid algorithmic and systems thinking.',
  },
  {
    id: 'cand-aisha',
    name: 'Aisha Khan',
    roleId: 'role-fe',
    roleTitle: 'Senior Frontend Engineer',
    stage: 'final',
    experience: '8 yrs exp',
    skills: ['Architecture', 'React', 'TypeScript', 'Design Systems'],
    matchScore: 96,
    matchReason: 'Unanimous 4/4 positive feedback from all engineering and founder interviews.',
    lastActivity: '45m ago',
    rating: 'Consensus Yes',
    currentCompany: 'Stripe UI Core',
    education: 'B.S. & M.S. CS, MIT',
    notes: 'Lead candidate for Q4 frontend milestones.',
  },
  {
    id: 'cand-liam',
    name: 'Liam Wright',
    roleId: 'role-growth',
    roleTitle: 'Growth Lead',
    stage: 'offer',
    experience: '7 yrs exp',
    skills: ['Developer Marketing', 'Conversion', 'Metrics', 'Community'],
    matchScore: 93,
    matchReason: 'Offer letter drafted. Awaiting final founder signature and closing package.',
    lastActivity: 'Yesterday',
    rating: 'Offer Extended',
    currentCompany: 'Datadog Alum',
    education: 'B.S. Marketing & Math, NYU',
    notes: 'Ready to sign before Nov 1.',
  },
];

import { useForge } from '../../../context/ForgeContext';

export default function HiringView() {
  const {
    roles,
    candidates,
    updateCandidateStage,
    addRole,
  } = useForge();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(candidates[0] || null);
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [reviewModalCandidate, setReviewModalCandidate] = useState<Candidate | null>(null);

  const handleCreateRole = (roleData: Omit<Role, 'id' | 'candidatesCount' | 'currentStage' | 'lastActivity'>) => {
    addRole({
      ...roleData,
      candidatesCount: 0,
      currentStage: 'Initial sourcing',
      lastActivity: 'Just now',
    });
  };

  const handleAdvanceCandidate = (candidateId: string, action: 'offer' | 'advance' | 'reject') => {
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    if (action === 'offer') {
      updateCandidateStage(candidateId, 'offer');
    } else if (action === 'advance') {
      const nextStageMap: Record<CandidateStage, CandidateStage> = {
        new: 'screening',
        screening: 'interview',
        interview: 'final',
        final: 'offer',
        offer: 'offer',
      };
      updateCandidateStage(candidateId, nextStageMap[cand.stage] || 'offer');
    }
  };

  // Filter candidates if role is selected
  const displayedCandidates = selectedRoleId
    ? candidates.filter((c) => c.roleId === selectedRoleId)
    : candidates;

  return (
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-hiring)]" />
            <span>02 · Talent</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Hiring
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            Build the right team without losing track of the process.
          </p>
        </div>

        {/* Contextual Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateRoleModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all duration-150 shadow-2xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create role</span>
          </button>
        </div>
      </div>

      {/* Hiring Overview Summary */}
      <HiringOverview
        openRolesCount={roles.length}
        candidatesCount={candidates.length}
        interviewsCount={7}
        offersCount={2}
      />

      {/* Open Roles List */}
      <OpenRolesList
        roles={roles}
        selectedRoleId={selectedRoleId}
        onSelectRole={setSelectedRoleId}
      />

      {/* Candidate Pipeline */}
      <CandidatePipeline
        candidates={displayedCandidates}
        selectedCandidateId={selectedCandidate?.id || null}
        onSelectCandidate={(cand) => {
          setSelectedCandidate(cand);
        }}
      />

      {/* Grid: Candidate Preview (Left 7 cols) & Insight + Illustration (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Selected Candidate Detail Fragment */}
        <div className="lg:col-span-7 space-y-6">
          <CandidatePreview
            candidate={selectedCandidate}
            onOpenFullReview={(cand) => setReviewModalCandidate(cand)}
          />
        </div>

        {/* Right: AI Sourcing Insight & Editorial Illustration */}
        <div className="lg:col-span-5 space-y-6">
          <HiringInsight />

          {/* Hand-drawn Editorial Illustration Card */}
          <div className="rounded-2xl border border-border/70 bg-surface/35 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 overflow-hidden">
            <div className="w-28 sm:w-32 shrink-0 flex items-center justify-center">
              <img
                src="/illustrations/hiring-team.png"
                alt="Editorial hand-drawn illustration of team members collaborating in unison"
                className="w-full h-auto select-none opacity-90 transition-opacity hover:opacity-100"
                draggable={false}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-hiring)]" />
                <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
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
        </div>
      </div>

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
