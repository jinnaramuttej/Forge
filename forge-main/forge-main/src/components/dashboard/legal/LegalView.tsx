import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import LegalOverview from './LegalOverview';
import DocumentList from './DocumentList';
import DocumentPreview from './DocumentPreview';
import ApprovalFlow from './ApprovalFlow';
import LegalInsight from './LegalInsight';
import CreateDocumentModal from './CreateDocumentModal';
import LegalReviewModal from './LegalReviewModal';
import { LegalDocument, DocumentStatus, ApprovalStep } from './types';

const initialDocuments: LegalDocument[] = [
  {
    id: 'doc-nda-foundry',
    title: 'Series Seed Mutual Non-Disclosure Agreement',
    type: 'Non-Disclosure Agreement',
    category: 'Commercial',
    status: 'Awaiting Review',
    currentStep: 'approval',
    counterparty: 'Foundry Group LP',
    owner: 'Sarah Lin',
    lastUpdated: '12m ago',
    governingLaw: 'Delaware, USA',
    effectiveDate: 'Oct 24, 2026',
    summary: 'Standard Delaware bilateral confidentiality protection prepared for Foundry Group diligence loop. Includes 24-month term with mutual trade secret safeguards.',
    clauses: [
      {
        title: 'Definition of Confidential Information',
        content: 'All proprietary software architectures, financial runway projections, customer contracts, and product roadmaps disclosed by either party.',
      },
      {
        title: 'Standard Exclusions & Independent Development',
        content: 'Carveouts for information in public domain or independently developed without reference to confidential disclosures.',
      },
      {
        title: 'Term & Termination',
        content: 'Confidentiality obligations survive for a period of two (2) years following the effective date of execution.',
      },
    ],
    riskRating: 'Clean',
  },
  {
    id: 'doc-contractor-design',
    title: 'Design Systems Lead Contractor Agreement (MSA)',
    type: 'Contractor Agreement',
    category: 'Employment',
    status: 'Awaiting Review',
    currentStep: 'review',
    counterparty: 'Studio Monochrome LLC',
    owner: 'Sarah Lin',
    lastUpdated: '1h ago',
    governingLaw: 'Delaware, USA',
    effectiveDate: 'Nov 01, 2026',
    summary: 'Master services agreement and statement of work covering Q4 design token refactor sprint. Incorporates strict work-for-hire assignment.',
    clauses: [
      {
        title: 'Scope of Work & Deliverables',
        content: 'Delivery of core design token libraries, icon assets, and accessibility compliance specifications.',
      },
      {
        title: 'Intellectual Property Assignment',
        content: 'All developed assets, code, and documentation constitute work-for-hire and assign 100% ownership to Acme Inc.',
      },
      {
        title: 'Invoicing & Compensation',
        content: 'Fixed monthly retainer of $4,200 billed Net 15 upon milestone acceptance.',
      },
    ],
    riskRating: 'Clean',
  },
  {
    id: 'doc-emp-aisha',
    title: 'Executive Employment Offer & Proprietary Information Agreement',
    type: 'Employment Agreement',
    category: 'Employment',
    status: 'Awaiting Review',
    currentStep: 'approval',
    counterparty: 'Aisha Khan',
    owner: 'Sarah Lin',
    lastUpdated: '2h ago',
    governingLaw: 'California, USA',
    effectiveDate: 'Nov 15, 2026',
    summary: 'Standard full-time exempt employment agreement with At-Will terms, $175K base compensation, 0.85% equity incentive grant, and CIIA agreement.',
    clauses: [
      {
        title: 'Position & Responsibilities',
        content: 'Role of Staff Frontend Engineer reporting to Chief Executive Officer.',
      },
      {
        title: 'Equity Grant Vesting Schedule',
        content: '4-year vesting schedule with a standard one (1) year cliff and monthly vesting thereafter.',
      },
      {
        title: 'Confidentiality & Inventions Assignment',
        content: 'Full assignment of all inventions developed during employment to the company.',
      },
    ],
    riskRating: 'Clean',
  },
  {
    id: 'doc-dpa-cloud',
    title: 'Customer Data Processing Addendum (GDPR & CCPA)',
    type: 'Data Processing Agreement',
    category: 'Compliance',
    status: 'Approved',
    currentStep: 'complete',
    counterparty: 'Enterprise Cloud Customer',
    owner: 'Sarah Lin',
    lastUpdated: 'Oct 19',
    governingLaw: 'Delaware / EU GDPR',
    effectiveDate: 'Oct 15, 2026',
    summary: 'Standard SOC2/GDPR data processing agreement specifying subprocessor controls and encryption at rest.',
    clauses: [
      {
        title: 'Security & Encryption Measures',
        content: 'All customer data encrypted using AES-256 at rest and TLS 1.3 in transit.',
      },
      {
        title: 'Subprocessor Authorization',
        content: '30-day notice requirement prior to onboarding new cloud hosting subprocessors.',
      },
    ],
    riskRating: 'Clean',
  },
  {
    id: 'doc-safe-advisor',
    title: 'Technical Advisory Board Equity Agreement (FAST)',
    type: 'Advisor Agreement',
    category: 'Corporate',
    status: 'Approved',
    currentStep: 'complete',
    counterparty: 'Dr. Aris Thorne',
    owner: 'Sarah Lin',
    lastUpdated: 'Oct 12',
    governingLaw: 'Delaware, USA',
    effectiveDate: 'Oct 01, 2026',
    summary: 'Founder Institute standard FAST advisory agreement granting 0.25% advisor equity for monthly architecture reviews.',
    clauses: [
      {
        title: 'Advisory Commitment',
        content: 'Quarterly board deep dives and 3 hours/month technical architecture consultation.',
      },
    ],
    riskRating: 'Clean',
  },
];

import { useForge } from '../../../context/ForgeContext';

export default function LegalView() {
  const { legalDocuments: documents, addLegalDocument, signLegalDocument, addActivity, showToast } = useForge();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(documents[0]?.id || null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reviewModalDoc, setReviewModalDoc] = useState<LegalDocument | null>(null);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0] || null;

  const handleCreateDocument = (
    docData: Omit<LegalDocument, 'id' | 'lastUpdated' | 'clauses' | 'riskRating'>
  ) => {
    addLegalDocument({
      ...docData,
      lastUpdated: 'Just now',
      clauses: [
        {
          title: 'Standard Protective Terms',
          content: 'Governed by Delaware general corporate law with bilateral mutual consideration.',
        },
      ],
      riskRating: 'Clean',
    });
  };

  const handleApproveDocument = (docId: string, note?: string) => {
    signLegalDocument(docId);
  };

  const handleRejectDocument = (docId: string, reason?: string) => {
    const doc = documents.find((d) => d.id === docId);
    addActivity('legal', 'Document revisions requested', `Revisions requested for ${doc?.title}. Reason: ${reason || 'Redlines needed.'}`);
    showToast(`Redlines requested for: ${doc?.title}`, 'info');
  };

  return (
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-legal)]" />
            <span>03 · Governance</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Legal
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            Keep important work moving.
          </p>
        </div>

        {/* Primary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all duration-150 shadow-2xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create document</span>
          </button>
        </div>
      </div>

      {/* Legal Overview Summary */}
      <LegalOverview
        activeCount={documents.length}
        awaitingReviewCount={documents.filter((d) => d.status === 'Awaiting Review').length}
        approvedCount={27}
        expiringSoonCount={2}
      />

      {/* Documents List */}
      <DocumentList
        documents={documents}
        selectedDocumentId={selectedDoc?.id || null}
        onSelectDocument={(doc) => setSelectedDocId(doc.id)}
      />

      {/* Grid: Document Preview (Left 7 cols) & Flow + Insight + Illustration (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Paper-cut Layered Preview */}
        <div className="lg:col-span-7 space-y-6">
          <DocumentPreview
            document={selectedDoc}
            onOpenReview={(doc) => setReviewModalDoc(doc)}
            onApprove={(id) => handleApproveDocument(id)}
            onReject={(id) => handleRejectDocument(id)}
          />
        </div>

        {/* Right Column: Approval Flow, Legal Insight & Hand-drawn Illustration */}
        <div className="lg:col-span-5 space-y-6">
          {/* Approval Step Flow */}
          <ApprovalFlow currentStep={selectedDoc?.currentStep || 'review'} />

          {/* Legal Intelligence Insight */}
          <LegalInsight />

          {/* Hand-drawn Editorial Illustration Card */}
          <div className="rounded-2xl border border-border/70 bg-surface/35 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 overflow-hidden">
            <div className="w-28 sm:w-32 shrink-0 flex items-center justify-center">
              <img
                src="/illustrations/legal-workflow.png"
                alt="Hand-drawn editorial illustration of a founder reviewing legal documents at an uncluttered desk"
                className="w-full h-auto select-none rounded-lg opacity-90 transition-opacity hover:opacity-100"
                draggable={false}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-legal)]" />
                <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
                  Corporate Governance
                </span>
              </div>
              <h4 className="mt-1 font-display text-base font-medium text-foreground">
                Agreements without the friction
              </h4>
              <p className="mt-1 text-xs text-foreground-soft leading-relaxed">
                Standard Delaware templates with automated risk screening so you can sign contracts in minutes, not days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Document Modal */}
      <CreateDocumentModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateDocument}
      />

      {/* Legal Review Modal */}
      <LegalReviewModal
        document={reviewModalDoc}
        onClose={() => setReviewModalDoc(null)}
        onApprove={handleApproveDocument}
        onReject={handleRejectDocument}
      />
    </div>
  );
}
