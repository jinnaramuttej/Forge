import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, TrendingUp, Sparkles, Activity, FileSpreadsheet, ShieldAlert, FileText } from 'lucide-react';
import FinanceOverview from './FinanceOverview';
import RunwayChart from './RunwayChart';
import FinancialInsight from './FinancialInsight';
import FinanceActivity from './FinanceActivity';
import AddSnapshotModal from './AddSnapshotModal';

import { useForge } from '../../../context/ForgeContext';

import InvestorMemoModal from '../InvestorMemoModal';

export default function FinanceView() {
  const { finance, updateFinanceSnapshot } = useForge();
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [investorMemoOpen, setInvestorMemoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'runway' | 'ledger' | 'insights'>('runway');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cash = finance.cash;
  const monthlyBurn = finance.monthlyBurn;
  const runway = finance.runway;
  const monthlyRevenue = finance.monthlyRevenue;

  const [activities] = useState([
    {
      id: '1',
      title: 'Financial snapshot updated',
      description: 'Silicon Valley Bank cash balances & Stripe customer receipts auto-reconciled.',
      timestamp: 'Today, 10:42 AM',
    },
    {
      id: '2',
      title: 'Monthly burn adjusted',
      description: 'AWS compute reservations applied, lowering infrastructure overhead.',
      timestamp: 'Oct 21',
      amount: '-$1.4K/mo',
      isPositive: true,
    },
    {
      id: '3',
      title: 'Revenue recorded',
      description: 'Enterprise annual contract prepayment deposited into operating account.',
      timestamp: 'Oct 18',
      amount: '+$24.0K',
      isPositive: true,
    },
    {
      id: '4',
      title: 'Expense added',
      description: 'Q4 Delaware corporate legal counsel retainer invoice approved.',
      timestamp: 'Oct 14',
      amount: '-$3.5K',
      isPositive: false,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddSnapshot = (data: {
    cash: string;
    monthlyBurn: string;
    monthlyRevenue: string;
    notes: string;
  }) => {
    const rawCash = parseFloat(data.cash.replace(/,/g, '')) || 284500;
    const rawBurn = parseFloat(data.monthlyBurn.replace(/,/g, '')) || 19200;
    const rawRev = parseFloat(data.monthlyRevenue.replace(/,/g, '')) || 42800;

    const formattedCash = `$${(rawCash / 1000).toFixed(1)}K`;
    const formattedBurn = `$${(rawBurn / 1000).toFixed(1)}K`;
    const formattedRev = `$${(rawRev / 1000).toFixed(1)}K`;

    const rawRunway = rawBurn > 0 ? (rawCash / rawBurn).toFixed(1) : '24.0';
    const formattedRunway = `${rawRunway} months`;

    updateFinanceSnapshot({
      cash: formattedCash,
      monthlyBurn: formattedBurn,
      monthlyRevenue: formattedRev,
      runway: formattedRunway,
      netBurn: `${formattedBurn} / mo`,
      runwayMonths: parseFloat(rawRunway),
    });

    showToast('Financial snapshot saved and runway updated.');
  };

  return (
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-7">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-4 sm:right-8 z-50 flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 shadow-2xl text-xs font-medium text-foreground ring-1 ring-foreground/10"
          >
            <CheckCircle2 className="h-4 w-4 text-[var(--color-finance)]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-finance)]" />
            <span>01 · Operations</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Finance & Treasury
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            Real-time runway modeling, bank reconciliation, and cash forecast.
          </p>
        </div>

        {/* Contextual Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setInvestorMemoOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-foreground hover:text-background transition-all shadow-xs cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 text-foreground-soft" />
            <span>Export Memo</span>
          </button>

          <button
            onClick={() => setSnapshotModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-all duration-150 shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Update Snapshot</span>
          </button>
        </div>
      </div>

      {/* Financial Overview (Clean Borderless Metrics Ribbon) */}
      <FinanceOverview
        cash={cash}
        monthlyBurn={monthlyBurn}
        runway={runway}
        monthlyRevenue={monthlyRevenue}
      />

      {/* Segmented Sub-Navigation Bar (Eliminates Box Clutter) */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'runway', label: 'Runway & Forecast', icon: TrendingUp },
            { id: 'ledger', label: 'Cash Ledger & Activity', icon: Activity },
            { id: 'insights', label: 'Treasury Guardian', icon: Sparkles },
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
          Last Synced: Today 10:42 AM
        </span>
      </div>

      {/* Tabbed Views */}
      {activeTab === 'runway' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <RunwayChart />
        </motion.div>
      )}

      {activeTab === 'ledger' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <FinanceActivity activities={activities} />
        </motion.div>
      )}

      {activeTab === 'insights' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <FinancialInsight />

          <div className="rounded-2xl border border-border/70 bg-surface/35 p-6 flex flex-col sm:flex-row items-center gap-5 overflow-hidden">
            <div className="w-24 sm:w-28 shrink-0 flex items-center justify-center">
              <img
                src="/illustrations/finance-founder.png"
                alt="Founder contemplating financial horizon"
                className="w-full h-auto select-none opacity-90"
                draggable={false}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-finance)]" />
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-foreground-faint">
                  Financial Clarity
                </span>
              </div>
              <h4 className="mt-1 font-display text-base font-medium text-foreground">
                Runway before accounting noise
              </h4>
              <p className="mt-1 text-xs text-foreground-soft leading-relaxed">
                FORGE keeps cash timing, burn momentum, and payroll headroom transparent so you can make decisions without parsing spreadsheets.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Financial Snapshot Modal */}
      <AddSnapshotModal
        isOpen={snapshotModalOpen}
        onClose={() => setSnapshotModalOpen(false)}
        onSubmit={handleAddSnapshot}
      />

      {/* Investor Memo Generator Modal */}
      <InvestorMemoModal
        isOpen={investorMemoOpen}
        onClose={() => setInvestorMemoOpen(false)}
      />
    </div>
  );
}
