import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';
import FinanceOverview from './FinanceOverview';
import RunwayChart from './RunwayChart';
import FinancialInsight from './FinancialInsight';
import FinanceActivity from './FinanceActivity';
import AddSnapshotModal from './AddSnapshotModal';

import { useForge } from '../../../context/ForgeContext';
import { apiClient } from '../../../services/apiClient';

function AskFinanceBar({ updateFinanceSnapshot }: { updateFinanceSnapshot: any }) {
  const [query, setQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsAsking(true);
    setErrorMsg(null);
    setResponse(null);
    
    try {
      const result = await apiClient.queryFinance(query);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setResponse(result.finalResponse || 'The finance agent processed your request.');
      

      
      setQuery('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to query the finance agent.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mt-6">
      <form onSubmit={handleAsk} className="flex items-center gap-2 rounded-2xl border border-border/50 bg-surface/80 backdrop-blur-xl p-2 shadow-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask the finance agent a question (e.g., 'What is our Q3 burn rate?')"
          className="flex-1 bg-transparent px-3 text-sm text-foreground focus:outline-none placeholder:text-foreground-faint"
        />
        <button
          type="submit"
          disabled={isAsking || !query.trim()}
          className="inline-flex h-9 items-center justify-center rounded-xl bg-foreground px-4 text-xs font-medium text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors"
        >
          {isAsking ? 'Asking...' : 'Ask'}
        </button>
      </form>

      {errorMsg && (
        <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 backdrop-blur-md p-3 text-xs text-red-500 shadow-sm">
          {errorMsg}
        </div>
      )}

      {response && (
        <div className="mt-3 rounded-xl border border-[var(--color-finance)]/30 bg-surface/80 backdrop-blur-xl p-4 text-sm text-foreground leading-relaxed shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-finance)]" />
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
              Agent Response
            </span>
          </div>
          {response}
        </div>
      )}
    </div>
  );
}

export default function FinanceView() {
  const { finance, updateFinanceSnapshot } = useForge();
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-foreground-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-finance)]" />
            <span>01 · Operations</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
            Finance
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground-soft font-normal">
            A clear view of your company's financial health.
          </p>
        </div>

        {/* Contextual Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSnapshotModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all duration-150 shadow-2xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add financial snapshot</span>
          </button>
        </div>
      </div>

      <AskFinanceBar updateFinanceSnapshot={updateFinanceSnapshot} />

      {/* Financial Overview (4 Metrics) */}
      <FinanceOverview
        cash={cash}
        monthlyBurn={monthlyBurn}
        runway={runway}
        monthlyRevenue={monthlyRevenue}
      />

      {/* Runway Visualization Chart */}
      <RunwayChart />

      {/* Grid: Intelligent Insight & Activity + Editorial Illustration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Financial Insight & Illustration (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <FinancialInsight />

          {/* Editorial Illustration Card */}
          <div className="rounded-2xl border border-border/70 bg-surface/35 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 overflow-hidden">
            <div className="w-24 sm:w-28 shrink-0 flex items-center justify-center">
              <img
                src="/illustrations/finance-founder.png"
                alt="Editorial hand-drawn illustration of founder contemplating company financial horizon"
                className="w-full h-auto select-none opacity-90 transition-opacity hover:opacity-100"
                draggable={false}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-finance)]" />
                <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint">
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
        </div>

        {/* Right column: Recent Financial Activity (5 cols) */}
        <div className="lg:col-span-5">
          <FinanceActivity activities={activities} />
        </div>
      </div>

      {/* Add Financial Snapshot Modal */}
      <AddSnapshotModal
        isOpen={snapshotModalOpen}
        onClose={() => setSnapshotModalOpen(false)}
        onSubmit={handleAddSnapshot}
      />
    </div>
  );
}
