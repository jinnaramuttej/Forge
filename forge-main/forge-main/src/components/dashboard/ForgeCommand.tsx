import React, { useState } from 'react';
import { Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';

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
    <div className="relative">
      {/* Liquid Glass Command Container */}
      <div className="glass relative rounded-2xl p-3 sm:p-4 shadow-sm transition-all duration-300 hover:shadow-md">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.05] text-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tell FORGE what you need..."
            className="flex-1 bg-transparent text-sm sm:text-base font-normal text-foreground placeholder:text-foreground-faint focus:outline-none"
          />

          <div className="flex items-center gap-2">
            <button
              type="submit"
              aria-label="Submit command"
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background hover:bg-foreground/90 transition-colors shadow-2xs cursor-pointer"
            >
              <span>Command</span>
              <CornerDownLeft className="h-3 w-3" />
            </button>
          </div>
        </form>

        {/* Subtle example & prompt suggestions beneath */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border/40 pt-2.5 text-xs text-foreground-faint">
          <span className="text-[0.72rem] tracking-wide uppercase font-medium text-foreground-faint/80">
            e.g.
          </span>
          <button
            type="button"
            onClick={() => handleSuggestionClick('Draft an NDA for our new designer')}
            className="hover:text-foreground transition-colors italic hover:underline cursor-pointer"
          >
            "Draft an NDA for our new designer"
          </button>
          <span className="text-foreground-faint/30 hidden sm:inline">·</span>
          <button
            type="button"
            onClick={() => handleSuggestionClick('Show me our current runway')}
            className="hover:text-foreground transition-colors italic hover:underline hidden sm:inline cursor-pointer"
          >
            "Show me our current runway"
          </button>
          <span className="text-foreground-faint/30 hidden md:inline">·</span>
          <button
            type="button"
            onClick={() => handleSuggestionClick('Find candidates for Senior Frontend Engineer')}
            className="hover:text-foreground transition-colors italic hover:underline hidden md:inline cursor-pointer"
          >
            "Find candidates for Senior Frontend Engineer"
          </button>
        </div>
      </div>
    </div>
  );
}
