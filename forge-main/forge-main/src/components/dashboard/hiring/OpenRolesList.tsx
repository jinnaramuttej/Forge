import React from 'react';
import { ArrowRight, Users, ChevronRight } from 'lucide-react';
import { Role } from './types';

interface OpenRolesListProps {
  roles: Role[];
  selectedRoleId: string | null;
  onSelectRole: (roleId: string | null) => void;
}

export default function OpenRolesList({
  roles,
  selectedRoleId,
  onSelectRole,
}: OpenRolesListProps) {
  return (
    <section aria-labelledby="open-roles-heading" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2
            id="open-roles-heading"
            className="font-display text-lg sm:text-xl font-medium tracking-tight text-foreground"
          >
            Open Roles
          </h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/[0.07] font-mono text-[0.68rem] font-medium text-foreground">
            {roles.length}
          </span>
        </div>

        {selectedRoleId && (
          <button
            onClick={() => onSelectRole(null)}
            className="text-xs text-foreground-soft hover:text-foreground transition-colors"
          >
            Show all candidates
          </button>
        )}
      </div>

      {/* Roles List */}
      <div className="divide-y divide-border/60 rounded-2xl border border-border/70 bg-surface/50 overflow-hidden shadow-xs">
        {roles.map((role) => {
          const isSelected = selectedRoleId === role.id;
          return (
            <div
              key={role.id}
              onClick={() => onSelectRole(isSelected ? null : role.id)}
              className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'bg-foreground/[0.04] border-l-2 border-l-[var(--color-hiring)]'
                  : 'hover:bg-surface'
              }`}
            >
              {/* Left info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-[0.92rem] font-medium text-foreground group-hover:text-foreground">
                    {role.title}
                  </h3>
                  <span className="rounded-full bg-foreground/[0.05] px-2 py-0.5 text-[0.65rem] font-mono text-foreground-soft">
                    {role.status}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-soft">
                  <span>{role.candidatesCount} candidates in pipeline</span>
                  <span className="text-foreground-faint/40">·</span>
                  <span className="text-foreground-faint">{role.currentStage}</span>
                  <span className="text-foreground-faint/40 hidden sm:inline">·</span>
                  <span className="text-foreground-faint hidden sm:inline">{role.lastActivity}</span>
                </div>
              </div>

              {/* Right indicator */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className="text-[0.72rem] text-foreground-faint group-hover:text-foreground-soft transition-colors">
                  {isSelected ? 'Viewing' : 'Filter'}
                </span>
                <ChevronRight
                  className={`h-4 w-4 text-foreground-faint transition-transform ${
                    isSelected ? 'rotate-90 text-foreground' : 'group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
