import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, FileText, ArrowRight, ShieldCheck, Layers, Scale } from 'lucide-react';
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
    title: 'Enterprise Customer Data Processing Agreement (DPA)',
    type: 'Data Processing Agreement',
    category: 'Compliance',
    status: 'Draft',
    currentStep: 'draft',
    counterparty: 'Vanguard Data Systems',
    owner: 'Sarah Lin',
    lastUpdated: 'Yesterday',
    governingLaw: 'Delaware, USA',
    effectiveDate: 'Oct 28, 2026',
    summary: 'GDPR and CCPA compliant data processing addendum governing automated tenant isolation and telemetry data ingestion.',
    clauses: [
      {
        title: 'Security Safeguards & Sub-processors',
        content: 'Technical security controls and notice period for addition of sub-processors.',
      },
      {
        title: 'Data Subject Rights & Breach Notification',
        content: '72-hour prompt incident notification protocol and data deletion support.',
      },
    ],
    riskRating: 'Clean',
  },
  {
    id: 'doc-safe-angel',
    title: 'Y Combinator Post-Money SAFE (Valuation Cap: $14M)',
    type: 'SAFE Agreement',
    category: 'Corporate',
    status: 'Complete',
    currentStep: 'complete',
    counterparty: 'Foundry Angel Syndicate',
    owner: 'Sarah Lin',
    lastUpdated: 'Oct 20',
    governingLaw: 'Delaware, USA',
    effectiveDate: 'Oct 20, 2026',
    summary: 'Executed $150K post-money SAFE instrument at $14M valuation cap. Funds wired and reconciled in company operating account.',
    clauses: [
      {
        title: 'Valuation Cap & Conversion Terms',
        content: 'Post-money valuation cap of $14,000,000 USD converting at next equity financing round.',
      },
    ],
    riskRating: 'Clean',
  },
];

import { useForge } from '../../../context/ForgeContext';

export default function LegalView() {
  const { addActivity, showToast } = useForge();
  const [documents, setDocuments] = useState<LegalDocument[]>(initialDocuments);
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDocuments[0].id);
  const [activeTab, setActiveTab] = useState<'contracts' | 'approvals' | 'compliance'>('contracts');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reviewModalDoc, setReviewModalDoc] = useState<LegalDocument | null>(null);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleCreateDocument = (newDocData: Omit<LegalDocument, 'id' | 'lastUpdated' | 'clauses' | 'riskRating'>) => {
    const newDoc: LegalDocument = {
      ...newDocData,
      id: `doc-${Date.now()}`,
      lastUpdated: 'Just now',
      clauses: [
        {
          title: 'Standard Terms & Warranties',
          content: 'Mutual representations and warranties standard for Delaware governing law agreements.',
        },
        {
          title: 'IP & Confidentiality Protection',
          content: 'Comprehensive covenant protecting company trade secrets and work product.',
        },
      ],
      riskRating: 'Clean',
    };

    setDocuments([newDoc, ...documents]);
    setSelectedDocId(newDoc.id);
    addActivity('legal', 'Document generated', `Generated new ${newDoc.type} for ${newDoc.counterparty}.`);
    showToast(`Created document: ${newDoc.title}`, 'success');
  };

  const handleApproveDocument = (docId: string, note?: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          const nextStep: ApprovalStep = d.currentStep === 'draft' ? 'review' : d.currentStep === 'review' ? 'approval' : 'complete';
          const nextStatus: DocumentStatus = nextStep === 'complete' ? 'Complete' : 'Awaiting Review';
          return { ...d, currentStep: nextStep, status: nextStatus, lastUpdated: 'Just now' };
        }
        return d;
      })
    );

    const doc = documents.find((d) => d.id === docId);
    addActivity('legal', 'Document signed & approved', `Executed agreement: ${doc?.title}.${note ? ` Note: "${note}"` : ''}`);
    showToast(`Signed & executed: ${doc?.title}`, 'success');
  };

  const handleRejectDocument = (docId: string, reason?: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'Draft', currentStep: 'draft', lastUpdated: 'Just now' } : d))
    );

    const doc = documents.find((d) => d.id === docId);
    addActivity('legal', 'Document revisions requested', `Revisions requested for ${doc?.title}. Reason: ${reason || 'Redlines needed.'}`);
    showToast(`Redlines requested for: ${doc?.title}`, 'info');
  };

  return (
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-legal)]" />
            <span>03 · Governance</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Legal & Compliance
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            Delaware agreements, IP protection, and SAFE governance.
          </p>
        </div>

        {/* Primary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-all duration-150 shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Draft Agreement</span>
          </button>
        </div>
      </div>

      {/* Legal Overview (Clean Metrics Ribbon) */}
      <LegalOverview
        activeCount={documents.length}
        awaitingReviewCount={documents.filter((d) => d.status === 'Awaiting Review').length}
        approvedCount={27}
        expiringSoonCount={2}
      />

      {/* Segmented Sub-Navigation Bar */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'contracts', label: 'Active Contracts & Preview', icon: FileText },
            { id: 'approvals', label: 'Execution & Workflow', icon: CheckCircle2 },
            { id: 'compliance', label: 'Delaware Compliance', icon: ShieldCheck },
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

        <span className="text-[0.72rem] text-foreground-faint hidden sm:inline font-mono">
          Jurisdiction: Delaware, USA
        </span>
      </div>

      {/* Tab 1: Contracts & Document Preview */}
      {activeTab === 'contracts' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Documents List */}
          <DocumentList
            documents={documents}
            selectedDocumentId={selectedDoc?.id || null}
            onSelectDocument={(doc) => setSelectedDocId(doc.id)}
          />

          {/* Document Preview */}
          <DocumentPreview
            document={selectedDoc}
            onOpenReview={(doc) => setReviewModalDoc(doc)}
            onApprove={(id) => handleApproveDocument(id)}
            onReject={(id) => handleRejectDocument(id)}
          />
        </motion.div>
      )}

      {/* Tab 2: Execution & Workflow */}
      {activeTab === 'approvals' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-6 space-y-6">
            <ApprovalFlow currentStep={selectedDoc?.currentStep || 'review'} />
          </div>
          <div className="lg:col-span-6 space-y-6">
            <LegalInsight />
          </div>
        </motion.div>
      )}

      {/* Tab 3: Delaware Compliance */}
      {activeTab === 'compliance' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <LegalInsight />

          <div className="rounded-2xl border border-border/70 bg-surface/35 p-6 flex flex-col sm:flex-row items-center gap-5 overflow-hidden">
            <div className="w-28 sm:w-32 shrink-0 flex items-center justify-center">
              <img
                src="/illustrations/legal-workflow.png"
                alt="Founder reviewing legal documents"
                className="w-full h-auto select-none rounded-lg opacity-90"
                draggable={false}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-legal)]" />
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-foreground-faint">
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
        </motion.div>
      )}

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
