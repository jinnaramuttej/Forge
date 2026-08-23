import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Terminal, Heart } from 'lucide-react';

interface FooterProps {
  onEnterForge?: () => void;
}

export default function Footer({ onEnterForge }: FooterProps = {}) {
  return (
    <footer className="border-t border-border/80 bg-surface/40 px-6 py-14 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Col 1: Brand & Purpose (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <a
                href="#top"
                className="font-display text-2xl tracking-tight text-foreground font-semibold"
              >
                FORGE
              </a>
              <span className="rounded-full bg-foreground/[0.06] border border-border px-2 py-0.5 text-[0.65rem] font-mono font-medium text-foreground-soft">
                v1.0-GA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-foreground-soft leading-relaxed max-w-sm">
              The unified autonomous operating system for high-growth startup founders. Coordinating treasury runway, talent pipelines, and Delaware governance.
            </p>

            {/* Live System Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[0.72rem] text-foreground-soft shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Operating Systems Operational</span>
            </div>
          </div>

          {/* Col 2: Core Platform Navigation (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-foreground-faint block">
              Core Platform
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#suite" className="text-foreground-soft hover:text-foreground transition-colors">
                  Treasury & Runway Engine
                </a>
              </li>
              <li>
                <a href="#suite" className="text-foreground-soft hover:text-foreground transition-colors">
                  Talent Architecture & Loops
                </a>
              </li>
              <li>
                <a href="#suite" className="text-foreground-soft hover:text-foreground transition-colors">
                  Delaware Legal Shield
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-foreground-soft hover:text-foreground transition-colors">
                  Autonomous AI Pipeline
                </a>
              </li>
              <li>
                <a href="#preview" className="text-foreground-soft hover:text-foreground transition-colors">
                  Executive Workspace Preview
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Founder Access & Command Palette (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-foreground-faint block">
              Direct Portal Access
            </span>
            <div className="rounded-2xl border border-border bg-surface p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Founder Console</span>
                <kbd className="inline-flex items-center gap-0.5 rounded border border-border bg-foreground/[0.04] px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-faint">
                  ⌘K
                </kbd>
              </div>
              <p className="text-[0.72rem] text-foreground-soft leading-snug">
                Instant access to your company graph, active contracts, and runway models.
              </p>
              <a
                href="#enter"
                onClick={(e) => {
                  if (onEnterForge) {
                    e.preventDefault();
                    onEnterForge();
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-all shadow-xs cursor-pointer group"
              >
                <span>Enter FORGE Workspace</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-faint">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} FORGE Operating Technologies Inc.</span>
            <span>·</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Delaware C-Corp Standard</span>
            <span>·</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">SOC-2 & GDPR Certified</span>
          </div>

          <div className="flex items-center gap-2 text-[0.72rem]">
            <span>Crafted for founders with conviction</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
