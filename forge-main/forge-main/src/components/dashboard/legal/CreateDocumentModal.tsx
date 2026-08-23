import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, FileText, Sparkles } from 'lucide-react';
import { LegalDocument } from './types';
import { apiClient } from '../../../services/apiClient';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (doc: Omit<LegalDocument, 'id' | 'lastUpdated' | 'clauses' | 'riskRating'>) => void;
}

export default function CreateDocumentModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateDocumentModalProps) {
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('Non-Disclosure Agreement');
  const [category, setCategory] = useState<'Commercial' | 'Employment' | 'Corporate' | 'Compliance'>('Commercial');
  const [counterparty, setCounterparty] = useState('');
  const [partyName, setPartyName] = useState('');
  const [location, setLocation] = useState('Telangana');
  const [governingLaw, setGoverningLaw] = useState('Delaware, USA');
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pollingStatus, setPollingStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || (!counterparty.trim() && !partyName.trim())) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setPollingStatus('Drafting agreement...');

    try {
      const { document_id } = await apiClient.generateLegalDocument({
        document_type: docType,
        business_id: 'current',
        details: {
          party_name: partyName.trim() || counterparty.trim(),
          purpose: summary.trim(),
          location: location.trim()
        }
      });

      setPollingStatus('Compiling statutory requirements...');

      const result = await apiClient.pollUntilDone(() => apiClient.pollLegalDocument(document_id));

      if (result.status === 'error' || result.status === 'Failed') {
        throw new Error(result.error_message || 'Agent failed to generate legal document');
      }

      onSubmit({
        title: title.trim(),
        type: docType,
        category,
        status: 'Draft',
        currentStep: 'draft',
        counterparty: counterparty.trim() || partyName.trim(),
        partyName: partyName.trim() || counterparty.trim(),
        location: location.trim(),
        owner: 'Sarah Lin',
        governingLaw,
        effectiveDate: 'Oct 24, 2026',
        summary: summary.trim() || `Standard ${docType} generated for ${counterparty.trim() || partyName.trim()}.`,
        draft_content: result.draft_content,
        statutory_data: result.statutory_data
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
      setPollingStatus(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-foreground/25 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 px-6 py-4 bg-background/50">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-legal)]" />
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
                Generate Legal Document
              </span>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-foreground-faint hover:bg-foreground/[0.05] hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4.5">
            <div>
              <h2 className="font-display text-xl text-foreground font-medium">
                Draft Agreement
              </h2>
              <p className="mt-1 text-xs text-foreground-soft">
                FORGE initializes a standardized Delaware agreement draft ready for internal and counterparty review.
              </p>
            </div>

            <div className="space-y-3.5">
              {errorMsg && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
                  {errorMsg}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mutual Non-Disclosure Agreement, Master Services Agreement"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-[var(--color-legal)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground-soft mb-1">
                    Document Type
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => {
                      setDocType(e.target.value);
                      if (e.target.value.includes('Employment')) setCategory('Employment');
                      else if (e.target.value.includes('Data')) setCategory('Compliance');
                      else if (e.target.value.includes('SAFE')) setCategory('Corporate');
                      else setCategory('Commercial');
                    }}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-[var(--color-legal)] focus:outline-none"
                  >
                    <option value="Non-Disclosure Agreement">Non-Disclosure Agreement</option>
                    <option value="Contractor Agreement">Contractor Agreement</option>
                    <option value="Employment Agreement">Employment Agreement</option>
                    <option value="Data Processing Agreement">Data Processing Agreement</option>
                    <option value="Advisor SAFE Agreement">Advisor SAFE Agreement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-soft mb-1">
                    Party Name (Counterparty)
                  </label>
                  <input
                    type="text"
                    required
                    value={partyName}
                    onChange={(e) => {
                      setPartyName(e.target.value);
                      setCounterparty(e.target.value);
                    }}
                    placeholder="e.g. Acme Labs, Foundry Group"
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:border-[var(--color-legal)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Telangana"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:border-[var(--color-legal)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-soft mb-1">
                  Summary / Objective
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  placeholder="e.g. Bilateral confidentiality protection for upcoming technical diligence..."
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-foreground-faint focus:border-[var(--color-legal)] focus:outline-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-5">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-foreground-soft hover:text-foreground transition-colors px-2 py-1.5"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || (!counterparty.trim() && !partyName.trim())}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    <span>{pollingStatus || 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Create Document</span>
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
