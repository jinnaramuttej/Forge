import React, { useState } from 'react';
import { Sparkles, CornerDownLeft, Search } from 'lucide-react';

interface ForgeCommandProps {
  onTriggerCommand: (query?: string) => void;
}

export default function ForgeCommand({ onTriggerCommand }: ForgeCommandProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onTriggerCommand(inputValue.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onTriggerCommand(suggestion);
  };

  return (
    <div className="relative w-full">
      {/* Sleek Liquid Glass Command Surface */}
      <div className="relative rounded-2xl glass-liquid p-3 sm:p-3.5 shadow-sm transition-all duration-200 hover:border-foreground/20">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.05] text-foreground">
            <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tell FORGE what you need (e.g., 'Draft SAFE agreement', 'Check hiring burn', 'Review NDA')..."
            className="flex-1 bg-transparent text-xs sm:text-sm font-normal text-foreground placeholder:text-foreground-faint focus:outline-none"
          />

          <div className="flex items-center gap-2">
            <button
              type="submit"
              aria-label="Submit command"
              className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors shadow-2xs cursor-pointer"
            >
              <span>Command</span>
              <CornerDownLeft className="h-3 w-3" />
            </button>
          </div>
        </form>

        {/* Minimalist prompt chips */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-border/40 pt-2 text-xs">
          <span className="text-[0.68rem] tracking-wider uppercase font-semibold text-foreground-faint">
            Quick Actions:
          </span>
          {[
            'Draft mutual NDA for contractor',
            'Model runway with +2 engineers',
            'Stage Q4 product launch brief',
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSuggestionClick(prompt)}
              className="glass-pill rounded-lg px-2.5 py-1 text-[0.72rem] text-foreground-soft hover:text-foreground hover:bg-foreground/[0.06] transition-all cursor-pointer"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
