import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  ArrowRight,
  X,
  FileText,
  TrendingUp,
  Users,
  Megaphone,
  Scale,
  CheckCircle2,
  Calendar,
  Activity,
  User,
  Settings,
  CornerDownLeft,
  Command,
  Loader2,
  Check,
} from 'lucide-react';
import { DashboardNavId } from './types';
import { CommandProcessingStep, CommandResult, SearchResultItem, SearchResultGroup } from '../../services/types';
import { executeCommand, COMMAND_STEPS } from '../../services/commandService';
import { searchWorkspace, groupSearchResults, getQuickActions, getSuggestedCommands } from '../../services/searchService';
import { useForge } from '../../context/ForgeContext';

interface CommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onNavigate?: (navId: DashboardNavId) => void;
  onActionComplete?: (msg: string) => void;
}

const departmentBadges: Record<string, { text: string; bg: string; border: string }> = {
  legal: {
    text: 'text-[var(--color-legal)]',
    bg: 'bg-[var(--color-legal)]/10',
    border: 'border-[var(--color-legal)]/20',
  },
  hiring: {
    text: 'text-[var(--color-hiring)]',
    bg: 'bg-[var(--color-hiring)]/10',
    border: 'border-[var(--color-hiring)]/20',
  },
  marketing: {
    text: 'text-[var(--color-accent)]',
    bg: 'bg-[var(--color-accent)]/10',
    border: 'border-[var(--color-accent)]/20',
  },
  finance: {
    text: 'text-[var(--color-finance)]',
    bg: 'bg-[var(--color-finance)]/10',
    border: 'border-[var(--color-finance)]/20',
  },
  approvals: {
    text: 'text-amber-800',
    bg: 'bg-amber-950/10',
    border: 'border-amber-800/20',
  },
  system: {
    text: 'text-foreground',
    bg: 'bg-foreground/[0.06]',
    border: 'border-border/60',
  },
};

export default function CommandModal({
  isOpen,
  onClose,
  initialQuery = '',
  onNavigate,
  onActionComplete,
}: CommandModalProps) {
  const forgeState = useForge();
  const [query, setQuery] = useState(initialQuery);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState<CommandProcessingStep | null>(null);
  const [commandResult, setCommandResult] = useState<CommandResult | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const quickActions = getQuickActions();
  const suggestedCommands = getSuggestedCommands();

  // Reset or initialize query
  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setQuery(initialQuery);
        handleRunCommand(initialQuery);
      } else {
        setQuery('');
        setCommandResult(null);
        setCurrentStep(null);
        setSearchResults([]);
        setSelectedIndex(0);
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialQuery]);

  // Live search when query changes (if not in command execution mode)
  useEffect(() => {
    let active = true;
    if (query.trim() && !commandResult && !isExecuting) {
      searchWorkspace(query, forgeState).then((items) => {
        if (active) {
          setSearchResults(items);
          setSelectedIndex(0);
        }
      });
    } else if (!query.trim()) {
      setSearchResults([]);
      setSelectedIndex(0);
    }
    return () => {
      active = false;
    };
  }, [query, commandResult, isExecuting, forgeState]);

  // Handle Command Submission Flow
  const handleRunCommand = async (cmdText: string) => {
    const text = cmdText.trim();
    if (!text) return;

    setIsExecuting(true);
    setCommandResult(null);
    setSearchResults([]);

    try {
      const result = await executeCommand(text, (step) => {
        setCurrentStep(step);
      }, forgeState);
      setCommandResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecuting(false);
      setCurrentStep(null);
    }
  };

  const handleSelectNav = (targetNav: DashboardNavId, label?: string) => {
    if (onNavigate) {
      onNavigate(targetNav);
    }
    if (onActionComplete && label) {
      onActionComplete(`Opened ${label}`);
    }
    onClose();
  };

  const groupedResults = groupSearchResults(searchResults);

  // Flatten searchable list for keyboard navigation
  const flatItems: (
    | { type: 'search'; item: SearchResultItem }
    | { type: 'quick'; item: typeof quickActions[0] }
  )[] =
    query.trim() && !commandResult && !isExecuting
      ? searchResults.map((item) => ({ type: 'search', item }))
      : quickActions.map((item) => ({ type: 'quick', item }));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (flatItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatItems.length) % (flatItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // If we already have a command result, clicking Enter activates the primary action
      if (commandResult) {
        handleSelectNav(commandResult.targetNav, commandResult.title);
        return;
      }

      // If user typed a command phrase (starting with command verbs or not matching direct single page)
      const currentSelection = flatItems[selectedIndex];
      if (currentSelection) {
        if (currentSelection.type === 'search') {
          handleSelectNav(currentSelection.item.targetNav, currentSelection.item.title);
        } else {
          handleSelectNav(currentSelection.item.targetNav, currentSelection.item.label);
        }
      } else if (query.trim()) {
        handleRunCommand(query);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-10 sm:pt-20">
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
          initial={{ opacity: 0, scale: 0.97, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Top Search / Command Input Bar */}
          <div className="flex items-center gap-3 border-b border-border/70 px-4 sm:px-5 py-3.5 bg-background/60">
            <Sparkles className="h-4 w-4 text-[var(--color-accent)] shrink-0" strokeWidth={1.75} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (commandResult) setCommandResult(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Tell FORGE what you need, or search workspace..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-foreground-faint focus:outline-none"
            />

            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setCommandResult(null);
                  setSearchResults([]);
                  inputRef.current?.focus();
                }}
                className="text-foreground-faint hover:text-foreground p-1 rounded-md transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              onClick={() => handleRunCommand(query)}
              disabled={!query.trim() || isExecuting}
              className="inline-flex items-center gap-1 rounded-md bg-foreground px-2.5 py-1 font-mono text-[0.7rem] text-background hover:bg-foreground/90 transition-colors disabled:opacity-40"
            >
              <span>Command</span>
              <CornerDownLeft className="h-3 w-3" />
            </button>
          </div>

          {/* Modal Body: Scrollable results & state container */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* A. EXECUTING PROCESS (3-step flow: Understanding -> Preparing -> Ready) */}
            {isExecuting && (
              <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full border-2 border-foreground/10 border-t-foreground animate-spin" />
                  <Sparkles className="absolute h-4 w-4 text-[var(--color-accent)]" />
                </div>

                <div className="space-y-1">
                  <div className="font-display text-base text-foreground font-medium">
                    {currentStep?.label || 'Processing command...'}
                  </div>
                  <p className="text-xs text-foreground-soft max-w-sm">
                    {currentStep?.subtext || 'FORGE Operating Graph synchronizing parameters'}
                  </p>
                </div>

                {/* Minimal 3-step pulse indicators */}
                <div className="flex items-center gap-2 pt-2">
                  {COMMAND_STEPS.map((st, i) => {
                    const isPassed =
                      (currentStep?.phase === 'preparing' && i === 0) ||
                      (currentStep?.phase === 'ready' && i <= 1);
                    const isCurrent = currentStep?.phase === st.phase;

                    return (
                      <div
                        key={st.phase}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isCurrent
                            ? 'w-6 bg-foreground'
                            : isPassed
                            ? 'w-3 bg-foreground/60'
                            : 'w-2 bg-foreground/15'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* B. CONTEXTUAL RESULT CARD */}
            {!isExecuting && commandResult && (
              <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                {/* Result header */}
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${
                        departmentBadges[commandResult.department]?.bg || departmentBadges.system.bg
                      } ${
                        departmentBadges[commandResult.department]?.text || departmentBadges.system.text
                      } ${
                        departmentBadges[commandResult.department]?.border || departmentBadges.system.border
                      }`}
                    >
                      {commandResult.departmentLabel}
                    </span>
                    <span className="text-xs text-foreground-faint font-mono">
                      Action Staged
                    </span>
                  </div>

                  <span className="rounded-full bg-emerald-950/10 text-emerald-800 border border-emerald-800/20 px-2 py-0.5 text-[0.65rem] font-medium">
                    Ready for Review
                  </span>
                </div>

                {/* Result Title & Summary */}
                <div className="space-y-1.5">
                  <h3 className="font-display text-xl sm:text-2xl text-foreground font-medium leading-snug">
                    {commandResult.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground-soft leading-relaxed">
                    {commandResult.summary}
                  </p>
                </div>

                {/* Metadata key-values */}
                {commandResult.metadata && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-xl border border-border/70 bg-background/50 p-3.5">
                    {commandResult.metadata.map((meta, i) => (
                      <div key={i} className="space-y-0.5">
                        <span className="text-[0.65rem] uppercase tracking-wider text-foreground-faint block truncate">
                          {meta.label}
                        </span>
                        <span className="text-xs font-medium text-foreground block truncate">
                          {meta.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Primary Action Button linking to screen */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[0.7rem] text-foreground-faint">
                    Press <kbd className="font-mono bg-foreground/[0.06] border border-border px-1 py-0.5 rounded">Enter ↵</kbd> to open
                  </span>

                  <button
                    onClick={() =>
                      handleSelectNav(commandResult.targetNav, commandResult.title)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all shadow-xs"
                  >
                    <span>{commandResult.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* C. LIVE SEARCH RESULTS (Grouped by Pages, Documents, People, Campaigns, Activities) */}
            {!isExecuting && !commandResult && searchResults.length > 0 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {groupedResults.map(({ group, items }) => (
                  <div key={group} className="space-y-1.5">
                    <div className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint px-2">
                      {group}
                    </div>

                    <div className="rounded-xl border border-border/60 bg-surface/40 divide-y divide-border/40 overflow-hidden">
                      {items.map((item) => {
                        const globalItemIndex = flatItems.findIndex(
                          (fi) => fi.type === 'search' && fi.item.id === item.id
                        );
                        const isSelected = selectedIndex === globalItemIndex;

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectNav(item.targetNav, item.title)}
                            className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-foreground/[0.06] text-foreground'
                                : 'hover:bg-foreground/[0.02] text-foreground'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="rounded bg-foreground/[0.05] border border-border/50 px-1.5 py-0.2 text-[0.65rem] font-mono text-foreground-soft">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[0.72rem] text-foreground-soft truncate mt-0.5">
                                {item.subtitle}
                              </p>
                            </div>

                            <ArrowRight className="h-3.5 w-3.5 text-foreground-faint shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* D. EMPTY QUERY / EXPLORATION VIEW (Quick Actions & Suggested Commands) */}
            {!isExecuting && !commandResult && !query.trim() && (
              <div className="space-y-6">
                {/* 1. Quick Actions */}
                <div className="space-y-2">
                  <div className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint px-1">
                    Quick Navigation
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {quickActions.map((qa, idx) => {
                      const isSelected = selectedIndex === idx;

                      return (
                        <button
                          key={qa.id}
                          onClick={() => handleSelectNav(qa.targetNav, qa.label)}
                          className={`rounded-xl border p-2.5 text-left transition-all ${
                            isSelected
                              ? 'border-foreground/40 bg-surface shadow-xs ring-1 ring-foreground/15'
                              : 'border-border/70 bg-surface/50 hover:border-foreground/30 hover:bg-surface'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-foreground">
                              {qa.label}
                            </span>
                            {qa.shortcut && (
                              <kbd className="font-mono text-[0.62rem] text-foreground-faint">
                                {qa.shortcut}
                              </kbd>
                            )}
                          </div>
                          <span className="text-[0.68rem] text-foreground-faint block mt-0.5">
                            {qa.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Suggested Natural Language Commands */}
                <div className="space-y-2">
                  <div className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground-faint px-1">
                    Suggested OS Commands
                  </div>

                  <div className="space-y-1.5">
                    {suggestedCommands.map((cmd, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setQuery(cmd);
                          handleRunCommand(cmd);
                        }}
                        className="w-full text-left rounded-xl border border-border/70 bg-surface/50 p-2.5 hover:border-foreground/30 hover:bg-surface transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Sparkles className="h-3.5 w-3.5 text-foreground-faint group-hover:text-[var(--color-accent)] transition-colors shrink-0" />
                          <span className="text-xs text-foreground font-medium truncate">
                            "{cmd}"
                          </span>
                        </div>
                        <CornerDownLeft className="h-3.5 w-3.5 text-foreground-faint group-hover:text-foreground transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="border-t border-border/60 bg-background/50 px-4 sm:px-5 py-2.5 flex items-center justify-between text-[0.7rem] text-foreground-faint">
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">
                <kbd className="font-mono bg-foreground/[0.05] border border-border px-1 py-0.5 rounded">↑↓</kbd> to navigate
              </span>
              <span>
                <kbd className="font-mono bg-foreground/[0.05] border border-border px-1 py-0.5 rounded">↵</kbd> to select
              </span>
              <span>
                <kbd className="font-mono bg-foreground/[0.05] border border-border px-1 py-0.5 rounded">ESC</kbd> to close
              </span>
            </div>

            <span className="font-mono text-[0.65rem] text-foreground-faint">
              FORGE OS Command
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
