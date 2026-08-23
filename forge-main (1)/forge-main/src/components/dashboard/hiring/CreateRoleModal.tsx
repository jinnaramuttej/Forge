import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Users,
  Sparkles,
  TrendingDown,
  Briefcase,
  Layers,
  Clock,
  DollarSign,
  Award,
} from 'lucide-react';
import { Role } from './types';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (role: Omit<Role, 'id' | 'candidatesCount' | 'currentStage' | 'lastActivity'>) => void;
}

interface RoleArchetype {
  id: string;
  title: string;
  department: string;
  baseSalaryRange: string;
  equityRange: string;
  monthlyBurnImpact: number;
  tags: string[];
}

const ROLE_ARCHETYPES: RoleArchetype[] = [
  {
    id: 'frontend',
    title: 'Founding Frontend Engineer',
    department: 'Engineering',
    baseSalaryRange: '$140k – $165k',
    equityRange: '0.75% – 1.25%',
    monthlyBurnImpact: 12500,
    tags: ['React 19', 'TypeScript', 'Design Systems', 'Performance'],
  },
  {
    id: 'product-design',
    title: 'Lead Product Designer',
    department: 'Design',
    baseSalaryRange: '$130k – $155k',
    equityRange: '0.50% – 1.00%',
    monthlyBurnImpact: 11800,
    tags: ['Figma Masters', 'Prototyping', 'Design Tokens', 'User Research'],
  },
  {
    id: 'growth',
    title: 'Head of Growth & Acquisition',
    department: 'Growth',
    baseSalaryRange: '$125k – $150k',
    equityRange: '0.50% – 0.90%',
    monthlyBurnImpact: 11000,
    tags: ['Paid Channels', 'Content Loops', 'Product Led Growth', 'Analytics'],
  },
  {
    id: 'ai-infra',
    title: 'AI / Backend Systems Engineer',
    department: 'Engineering',
    baseSalaryRange: '$155k – $180k',
    equityRange: '0.80% – 1.50%',
    monthlyBurnImpact: 14000,
    tags: ['Python/FastAPI', 'Vector DBs', 'Distributed Systems', 'LLM Ops'],
  },
];

export default function CreateRoleModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateRoleModalProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<RoleArchetype>(ROLE_ARCHETYPES[0]);
  const [title, setTitle] = useState(ROLE_ARCHETYPES[0].title);
  const [department, setDepartment] = useState(ROLE_ARCHETYPES[0].department);
  const [seniority, setSeniority] = useState<'Founding' | 'Lead' | 'Senior' | 'Staff'>('Founding');
  const [targetDate, setTargetDate] = useState('Nov 30, 2026');
  const [pipelineType, setPipelineType] = useState<'Fast-Track (3 Steps)' | 'Standard Loop (4 Steps)' | 'Executive (5 Steps)'>('Fast-Track (3 Steps)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>(ROLE_ARCHETYPES[0].tags);

  if (!isOpen) return null;

  const handleSelectArchetype = (arch: RoleArchetype) => {
    setSelectedArchetype(arch);
    setTitle(arch.title);
    setDepartment(arch.department);
    setActiveTags(arch.tags);
  };

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit({
        title: title.trim(),
        department,
        status: 'Active',
        targetDate,
      });
      onClose();
    }, 450);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-foreground/30 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-background-alt">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[var(--color-hiring)]/10 border border-[var(--color-hiring)]/20 flex items-center justify-center text-[var(--color-hiring)]">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                    Talent Architecture Studio
                  </span>
                  <span className="rounded-full bg-[var(--color-hiring)]/15 px-2 py-0.5 text-[0.65rem] font-medium text-[var(--color-hiring)]">
                    Auto-Runway Sync
                  </span>
                </div>
                <p className="text-[0.72rem] text-foreground-soft">
                  Stage high-impact roles, forecast burn rate, and calibrate hiring loops
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-foreground-faint hover:bg-foreground/[0.06] hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* 1. Role Archetypes Preset Grid */}
            <div>
              <label className="block text-xs font-medium text-foreground-soft mb-2 flex items-center justify-between">
                <span>Select Role Archetype</span>
                <span className="text-[0.7rem] text-foreground-faint">
                  Benchmarked against Series A startups
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ROLE_ARCHETYPES.map((arch) => {
                  const isSelected = selectedArchetype.id === arch.id;
                  return (
                    <button
                      key={arch.id}
                      type="button"
                      onClick={() => handleSelectArchetype(arch)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-foreground bg-surface shadow-xs ring-1 ring-foreground/20'
                          : 'border-border bg-background hover:bg-surface hover:border-foreground/20'
                      }`}
                    >
                      <span className="text-xs font-semibold text-foreground truncate w-full mb-1">
                        {arch.title}
                      </span>
                      <span className="text-[0.65rem] text-[var(--color-hiring)] font-medium">
                        {arch.department}
                      </span>
                      <span className="text-[0.68rem] text-foreground-faint mt-1.5 font-mono">
                        ~${(arch.monthlyBurnImpact / 1000).toFixed(1)}k/mo
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Title & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                  Position Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-foreground-faint focus:border-[var(--color-hiring)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground focus:border-[var(--color-hiring)] focus:outline-none"
                >
                  <option value="Engineering">Engineering & AI</option>
                  <option value="Design">Product & Design</option>
                  <option value="Growth">Growth & Marketing</option>
                  <option value="Product">Product Management</option>
                  <option value="Operations">Operations & Legal</option>
                </select>
              </div>
            </div>

            {/* 3. Seniority & Target Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                  Seniority Level
                </label>
                <div className="flex gap-1.5">
                  {(['Founding', 'Lead', 'Senior', 'Staff'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSeniority(lvl)}
                      className={`flex-1 rounded-xl py-2 text-[0.72rem] font-medium border text-center transition-all ${
                        seniority === lvl
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border bg-surface text-foreground-soft hover:text-foreground'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                  Target Start Date
                </label>
                <input
                  type="text"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground focus:border-[var(--color-hiring)] focus:outline-none"
                  placeholder="Nov 30, 2026"
                />
              </div>
            </div>

            {/* 4. Live Runway & Budget Impact Card */}
            <div className="rounded-xl border border-border bg-background-alt p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
                  <TrendingDown className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-foreground block">
                    Calculated Runway Impact
                  </span>
                  <span className="text-[0.72rem] text-foreground-soft">
                    {selectedArchetype.baseSalaryRange} base · {selectedArchetype.equityRange} equity
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-surface border border-border text-foreground font-semibold">
                  -${(selectedArchetype.monthlyBurnImpact / 1000).toFixed(1)}k/mo
                </span>
                <span className="text-[0.7rem] text-foreground-faint">
                  (-0.8 mo runway delta)
                </span>
              </div>
            </div>

            {/* 5. Core Competency Tags */}
            <div>
              <label className="block text-xs font-medium text-foreground-soft mb-2 flex items-center justify-between">
                <span>Core Competencies & Stack</span>
                <span className="text-[0.7rem] text-foreground-faint">
                  Auto-mapped to candidate scorecards
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'React 19',
                  'TypeScript',
                  'Figma Masters',
                  'Python/FastAPI',
                  'Vector DBs',
                  'Design Systems',
                  'Product Led Growth',
                  'LLM Ops',
                  'Distributed Systems',
                ].map((tag) => {
                  const isChecked = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[0.72rem] font-medium border transition-all ${
                        isChecked
                          ? 'border-[var(--color-hiring)]/50 bg-[var(--color-hiring)]/10 text-[var(--color-hiring)]'
                          : 'border-border bg-surface text-foreground-faint hover:text-foreground-soft'
                      }`}
                    >
                      <Check className={`h-3 w-3 ${isChecked ? 'opacity-100' : 'opacity-20'}`} />
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs text-foreground-soft hover:text-foreground transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-all shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    <span>Publishing Role...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Stage Open Position</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
