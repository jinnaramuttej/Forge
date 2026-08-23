import React, { useState } from 'react';
import { Search, ChevronRight, FileText, Filter } from 'lucide-react';
import { LegalDocument, DocumentStatus } from './types';

interface DocumentListProps {
  documents: LegalDocument[];
  selectedDocumentId: string | null;
  onSelectDocument: (doc: LegalDocument) => void;
}

export default function DocumentList({
  documents,
  selectedDocumentId,
  onSelectDocument,
}: DocumentListProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter((doc) => {
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'Awaiting Review':
        return 'bg-[var(--color-legal)]/10 text-[var(--color-legal)] border-[var(--color-legal)]/30';
      case 'Approved':
      case 'Complete':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
      case 'Draft':
        return 'bg-foreground/[0.05] text-foreground-soft border-border/60';
      case 'Rejected':
        return 'bg-rose-50 text-rose-800 border-rose-200/60';
      default:
        return 'bg-surface text-foreground-faint';
    }
  };

  return (
    <section aria-labelledby="documents-list-heading" className="space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2
            id="documents-list-heading"
            className="font-display text-lg sm:text-xl font-medium tracking-tight text-foreground"
          >
            Corporate Agreements
          </h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/[0.07] font-mono text-[0.68rem] font-medium text-foreground">
            {filteredDocs.length}
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'Awaiting Review', label: 'Awaiting Review' },
            { id: 'Approved', label: 'Approved' },
            { id: 'Draft', label: 'Drafts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? 'bg-foreground text-background shadow-2xs'
                  : 'text-foreground-soft hover:text-foreground bg-surface/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <div className="divide-y divide-border/60 rounded-2xl border border-border/70 bg-surface/50 overflow-hidden shadow-xs">
        {filteredDocs.length === 0 ? (
          <div className="p-8 text-center text-xs text-foreground-faint">
            No agreements match the selected criteria.
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isSelected = selectedDocumentId === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-foreground/[0.04] border-l-2 border-l-[var(--color-legal)]'
                    : 'hover:bg-surface'
                }`}
              >
                {/* Left Document Details */}
                <div className="min-w-0 flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full shrink-0 bg-[var(--color-legal)]" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground-faint">
                        {doc.type}
                      </span>
                      <span className="text-foreground-faint/40">·</span>
                      <span className="text-xs text-foreground-soft font-medium">
                        {doc.counterparty}
                      </span>
                    </div>

                    <h3 className="mt-1 text-[0.92rem] font-medium text-foreground group-hover:text-foreground">
                      {doc.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-faint">
                      <span>Owner: {doc.owner}</span>
                      <span className="text-foreground-faint/40">·</span>
                      <span>Updated {doc.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                {/* Right Status Badge & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 self-end sm:self-center">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[0.68rem] font-mono font-medium ${getStatusBadge(
                      doc.status
                    )}`}
                  >
                    {doc.status}
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 text-foreground-faint transition-transform ${
                      isSelected ? 'rotate-90 text-foreground' : 'group-hover:translate-x-0.5'
                    }`}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
