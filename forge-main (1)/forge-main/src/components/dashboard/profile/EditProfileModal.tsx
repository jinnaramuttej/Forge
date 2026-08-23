import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Building2, Check } from 'lucide-react';
import { FounderProfile, StartupInfo } from './types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  founder: FounderProfile;
  startup: StartupInfo;
  onSave: (founder: FounderProfile, startup: StartupInfo) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  founder,
  startup,
  onSave,
}: EditProfileModalProps) {
  const [founderState, setFounderState] = useState<FounderProfile>(founder);
  const [startupState, setStartupState] = useState<StartupInfo>(startup);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(founderState, startupState);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-foreground/20 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-foreground-soft" />
              <h3 className="font-display text-xl text-foreground font-medium">
                Edit Profile & Startup
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-foreground-faint hover:bg-foreground/[0.05] hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Founder Profile Section */}
            <div className="space-y-3">
              <div className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-foreground-faint">
                Founder Identity
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={founderState.name}
                    onChange={(e) =>
                      setFounderState({ ...founderState, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-border/80 bg-surface/70 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                  />
                </div>

                <div>
                  <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={founderState.role}
                    onChange={(e) =>
                      setFounderState({ ...founderState, role: e.target.value })
                    }
                    className="w-full rounded-lg border border-border/80 bg-surface/70 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={founderState.email}
                  onChange={(e) =>
                    setFounderState({ ...founderState, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-border/80 bg-surface/70 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/50" />

            {/* Startup Information Section */}
            <div className="space-y-3">
              <div className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-foreground-faint">
                Startup Information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                    Startup Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={startupState.name}
                    onChange={(e) =>
                      setStartupState({ ...startupState, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-border/80 bg-surface/70 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                  />
                </div>

                <div>
                  <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                    Stage
                  </label>
                  <input
                    type="text"
                    value={startupState.stage}
                    onChange={(e) =>
                      setStartupState({ ...startupState, stage: e.target.value })
                    }
                    className="w-full rounded-lg border border-border/80 bg-surface/70 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={startupState.industry}
                    onChange={(e) =>
                      setStartupState({ ...startupState, industry: e.target.value })
                    }
                    className="w-full rounded-lg border border-border/80 bg-surface/70 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                  />
                </div>

                <div>
                  <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={startupState.website}
                    onChange={(e) =>
                      setStartupState({ ...startupState, website: e.target.value })
                    }
                    className="w-full rounded-lg border border-border/80 bg-surface/70 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.72rem] font-medium text-foreground-soft mb-1">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  value={startupState.description}
                  onChange={(e) =>
                    setStartupState({ ...startupState, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-border/80 bg-surface/70 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/40"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-1.5 text-xs text-foreground-soft hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:bg-foreground/90 transition-colors shadow-xs"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
