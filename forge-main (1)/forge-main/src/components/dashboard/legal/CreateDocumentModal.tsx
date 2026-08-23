import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  FileText,
  Sparkles,
  ShieldCheck,
  Building2,
  Scale,
  Clock,
  Layers,
  ArrowRight,
  Info,
  Wand2,
} from 'lucide-react';
import { LegalDocument } from './types';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (doc: Omit<LegalDocument, 'id' | 'lastUpdated' | 'clauses' | 'riskRating'>) => void;
}

interface TemplatePreset {
  id: string;
  name: string;
  category: 'Commercial' | 'Employment' | 'Corporate' | 'Compliance';
  defaultTitle: string;
  governingLaw: string;
  summary: string;
  clausesCount: number;
  badgeColor: string;
  defaultClauses: string[];
}

const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'nda',
    name: 'Mutual NDA',
    category: 'Commercial',
    defaultTitle: 'Mutual Non-Disclosure Agreement',
    governingLaw: 'Delaware, USA',
    summary: 'Standard two-way confidentiality protection for technical diligence and commercial exploration.',
    clausesCount: 14,
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    defaultClauses: ['2-Year Confidentiality Term', 'Mutual IP Protection', 'Defend Trade Secrets Act Notice'],
  },
  {
    id: 'contractor',
    name: 'Contractor Agreement',
    category: 'Employment',
    defaultTitle: 'Master Independent Contractor Agreement',
    governingLaw: 'Delaware, USA',
    summary: 'Comprehensive contractor scope with strict IP assignment, confidentiality, and milestone billing.',
    clausesCount: 22,
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    defaultClauses: ['Full Work-for-Hire Assignment', 'Net-30 Invoice Terms', 'Non-Solicitation (12 Mo)'],
  },
  {
    id: 'safe',
    name: 'Advisor / Investor SAFE',
    category: 'Corporate',
    defaultTitle: 'Simple Agreement for Future Equity (SAFE)',
    governingLaw: 'Delaware, USA',
    summary: 'Standard post-money valuation cap SAFE agreement adapted for angel investors & strategic advisors.',
    clausesCount: 18,
    badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    defaultClauses: ['Post-Money Valuation Cap', 'Information Rights', 'Standard MFN Clause'],
  },
  {
    id: 'msa',
    name: 'Enterprise MSA',
    category: 'Commercial',
    defaultTitle: 'Master Services Agreement & SLA',
    governingLaw: 'New York, USA',
    summary: 'B2B software & services agreement with customizable liability caps and 99.9% uptime commitments.',
    clausesCount: 31,
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    defaultClauses: ['12-Mo Aggregate Liability Cap', 'Enterprise SLA Tier', 'GDPR/SOC-2 Compliance Rider'],
  },
];

export default function CreateDocumentModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateDocumentModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplatePreset>(TEMPLATE_PRESETS[0]);
  const [title, setTitle] = useState(TEMPLATE_PRESETS[0].defaultTitle);
  const [category, setCategory] = useState<'Commercial' | 'Employment' | 'Corporate' | 'Compliance'>(
    TEMPLATE_PRESETS[0].category
  );
  const [counterparty, setCounterparty] = useState('');
  const [governingLaw, setGoverningLaw] = useState(TEMPLATE_PRESETS[0].governingLaw);
  const [summary, setSummary] = useState(TEMPLATE_PRESETS[0].summary);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [activeClauses, setActiveClauses] = useState<string[]>(TEMPLATE_PRESETS[0].defaultClauses);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'configure' | 'preview'>('configure');

  if (!isOpen) return null;

  const handleSelectTemplate = (tpl: TemplatePreset) => {
    setSelectedTemplate(tpl);
    setTitle(tpl.defaultTitle);
    setCategory(tpl.category);
    setGoverningLaw(tpl.governingLaw);
    setSummary(tpl.summary);
    setActiveClauses(tpl.defaultClauses);
  };

  const toggleClause = (clause: string) => {
    setActiveClauses((prev) =>
      prev.includes(clause) ? prev.filter((c) => c !== clause) : [...prev, clause]
    );
  };

  const handleApplyAiPrompt = () => {
    if (!customPrompt.trim()) return;
    // Smart heuristic auto-fill based on prompt
    const p = customPrompt.toLowerCase();
    if (p.includes('contractor') || p.includes('developer') || p.includes('designer')) {
      handleSelectTemplate(TEMPLATE_PRESETS[1]);
      setTitle(`Contractor Agreement – ${customPrompt.slice(0, 30)}...`);
    } else if (p.includes('safe') || p.includes('invest') || p.includes('advisor')) {
      handleSelectTemplate(TEMPLATE_PRESETS[2]);
    } else if (p.includes('enterprise') || p.includes('msa') || p.includes('vendor')) {
      handleSelectTemplate(TEMPLATE_PRESETS[3]);
    }
    setSummary(`Custom AI-structured document generated from: "${customPrompt.trim()}". Includes standard indemnification and IP covenants.`);
    setShowAiPrompt(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !counterparty.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit({
        title: title.trim(),
        type: selectedTemplate.name,
        category,
        status: 'Draft',
        currentStep: 'draft',
        counterparty: counterparty.trim(),
        owner: 'Sarah Lin',
        governingLaw,
        effectiveDate: 'Oct 24, 2026',
        summary: summary.trim() || `Standard ${selectedTemplate.name} generated for ${counterparty.trim()}.`,
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

        {/* Modal Studio Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden my-auto"
        >
          {/* Studio Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-background-alt">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[var(--color-legal)]/10 border border-[var(--color-legal)]/20 flex items-center justify-center text-[var(--color-legal)]">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                    Legal Document Studio
                  </span>
                  <span className="rounded-full bg-[var(--color-legal)]/15 px-2 py-0.5 text-[0.65rem] font-medium text-[var(--color-legal)]">
                    Delaware Compliant
                  </span>
                </div>
                <p className="text-[0.72rem] text-foreground-soft">
                  Create airtight legal instruments with automated clause protection
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 rounded-lg bg-surface p-0.5 border border-border">
                <button
                  type="button"
                  onClick={() => setActiveTab('configure')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    activeTab === 'configure'
                      ? 'bg-foreground text-background shadow-xs'
                      : 'text-foreground-soft hover:text-foreground'
                  }`}
                >
                  Configure
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-foreground text-background shadow-xs'
                      : 'text-foreground-soft hover:text-foreground'
                  }`}
                >
                  Live Preview
                </button>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-foreground-faint hover:bg-foreground/[0.06] hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* AI Quick Generator Prompt Banner */}
          <div className="px-6 pt-4 pb-2">
            {!showAiPrompt ? (
              <button
                type="button"
                onClick={() => setShowAiPrompt(true)}
                className="w-full flex items-center justify-between gap-3 rounded-xl border border-dashed border-[var(--color-legal)]/40 bg-[var(--color-legal)]/[0.04] px-3.5 py-2.5 text-xs text-foreground-soft hover:border-[var(--color-legal)] hover:bg-[var(--color-legal)]/[0.08] transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--color-legal)] group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-foreground">
                    Draft with AI Assistant
                  </span>
                  <span className="text-[0.7rem] text-foreground-faint hidden sm:inline">
                    – Describe agreement terms in plain English
                  </span>
                </div>
                <span className="text-[0.7rem] font-medium text-[var(--color-legal)] group-hover:underline">
                  Open Prompt →
                </span>
              </button>
            ) : (
              <div className="rounded-xl border border-[var(--color-legal)]/30 bg-[var(--color-legal)]/[0.04] p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Wand2 className="h-3.5 w-3.5 text-[var(--color-legal)]" />
                    <span>Describe the agreement terms</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAiPrompt(false)}
                    className="text-[0.7rem] text-foreground-faint hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. 6-month React frontend contractor for Acme Labs, $120/hr, California law"
                    className="flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-foreground-faint focus:border-[var(--color-legal)] focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyAiPrompt();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyAiPrompt}
                    className="rounded-lg bg-[var(--color-legal)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--color-legal)]/90 transition-colors shrink-0"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Form Body */}
          <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
            {activeTab === 'configure' ? (
              <>
                {/* 1. Template Presets Selection */}
                <div>
                  <label className="block text-xs font-medium text-foreground-soft mb-2 flex items-center justify-between">
                    <span>Select Document Archetype</span>
                    <span className="text-[0.7rem] text-foreground-faint">
                      4 Standard Templates
                    </span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {TEMPLATE_PRESETS.map((tpl) => {
                      const isSelected = selectedTemplate.id === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => handleSelectTemplate(tpl)}
                          className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all relative ${
                            isSelected
                              ? 'border-foreground bg-surface shadow-xs ring-1 ring-foreground/20'
                              : 'border-border bg-background hover:bg-surface hover:border-foreground/20'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1.5">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {tpl.name}
                            </span>
                            {isSelected && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-legal)]" />
                            )}
                          </div>
                          <span className={`text-[0.65rem] px-1.5 py-0.5 rounded border ${tpl.badgeColor}`}>
                            {tpl.category}
                          </span>
                          <span className="text-[0.68rem] text-foreground-faint mt-1.5">
                            {tpl.clausesCount} vetted clauses
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Document Core Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                      Agreement Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Mutual Non-Disclosure Agreement"
                      className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-foreground-faint focus:border-[var(--color-legal)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                      Counterparty Entity *
                    </label>
                    <input
                      type="text"
                      required
                      value={counterparty}
                      onChange={(e) => setCounterparty(e.target.value)}
                      placeholder="e.g. Acme Labs Inc, Foundry Group"
                      className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-foreground-faint focus:border-[var(--color-legal)] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Governing Law & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                      Governing Jurisdiction
                    </label>
                    <select
                      value={governingLaw}
                      onChange={(e) => setGoverningLaw(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground focus:border-[var(--color-legal)] focus:outline-none"
                    >
                      <option value="Delaware, USA">Delaware, USA (Standard Founder Choice)</option>
                      <option value="California, USA">California, USA</option>
                      <option value="New York, USA">New York, USA</option>
                      <option value="England & Wales, UK">England & Wales, UK</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                      Operational Category
                    </label>
                    <div className="flex gap-1.5">
                      {(['Commercial', 'Employment', 'Corporate', 'Compliance'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`flex-1 rounded-xl py-2 px-1 text-[0.7rem] font-medium border text-center transition-all ${
                            category === cat
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border bg-surface text-foreground-soft hover:text-foreground'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Active Smart Clauses Checklist */}
                <div>
                  <label className="block text-xs font-medium text-foreground-soft mb-2 flex items-center justify-between">
                    <span>Protective Clause Addons</span>
                    <span className="text-[0.7rem] text-[var(--color-legal)] font-medium">
                      {activeClauses.length} active covenants
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '2-Year Confidentiality Term',
                      'Full Work-for-Hire Assignment',
                      'Non-Solicitation (12 Mo)',
                      'Post-Money Valuation Cap',
                      'Mutual IP Protection',
                      'Accelerated Electronic Execution',
                      'Defend Trade Secrets Act Notice',
                    ].map((clause) => {
                      const isIncluded = activeClauses.includes(clause);
                      return (
                        <button
                          key={clause}
                          type="button"
                          onClick={() => toggleClause(clause)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.72rem] font-medium border transition-all ${
                            isIncluded
                              ? 'border-[var(--color-legal)]/40 bg-[var(--color-legal)]/10 text-[var(--color-legal)]'
                              : 'border-border bg-surface text-foreground-faint hover:text-foreground-soft'
                          }`}
                        >
                          <Check
                            className={`h-3 w-3 ${
                              isIncluded ? 'opacity-100' : 'opacity-20'
                            }`}
                          />
                          <span>{clause}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Executive Summary */}
                <div>
                  <label className="block text-xs font-medium text-foreground-soft mb-1.5">
                    Instrument Summary & Context
                  </label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={2}
                    placeholder="Brief description of the business context..."
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-foreground-faint focus:border-[var(--color-legal)] focus:outline-none"
                  />
                </div>
              </>
            ) : (
              /* Live Preview Tab */
              <div className="rounded-xl border border-border bg-background-alt p-5 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[var(--color-legal)]" />
                    <span className="font-semibold text-foreground">
                      {title || 'Untitled Agreement'}
                    </span>
                  </div>
                  <span className="rounded bg-emerald-500/10 text-emerald-700 px-2 py-0.5 text-[0.7rem]">
                    Ready to Stage
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[0.72rem] text-foreground-soft">
                  <div>
                    <span className="text-foreground-faint block">Party A:</span>
                    <span className="text-foreground font-medium">Acme Corp (Sarah Lin)</span>
                  </div>
                  <div>
                    <span className="text-foreground-faint block">Party B:</span>
                    <span className="text-foreground font-medium">{counterparty || '[Counterparty Name]'}</span>
                  </div>
                  <div>
                    <span className="text-foreground-faint block">Jurisdiction:</span>
                    <span className="text-foreground font-medium">{governingLaw}</span>
                  </div>
                  <div>
                    <span className="text-foreground-faint block">Classification:</span>
                    <span className="text-foreground font-medium">{category}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <span className="text-[0.7rem] text-foreground-faint block mb-1">
                    Covenants Included:
                  </span>
                  <div className="space-y-1 text-[0.7rem] text-foreground-soft">
                    {activeClauses.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-[var(--color-legal)] font-bold">§{i + 1}.0</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Studio Footer */}
            <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
              <div className="flex items-center gap-2 text-[0.72rem] text-foreground-soft">
                <ShieldCheck className="h-4 w-4 text-[var(--color-legal)]" />
                <span>Auto-staged to Founder Approvals</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-xs text-foreground-soft hover:text-foreground transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !counterparty.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-all shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      <span>Generating Draft...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Draft Legal Document</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
