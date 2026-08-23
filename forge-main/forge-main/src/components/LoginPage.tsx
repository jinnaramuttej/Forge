import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Lock, Mail, Sparkles } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

interface LoginPageProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export default function LoginPage({ onBack, onSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('founder@acme.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatusMessage('Please enter your work email.');
      return;
    }
    setStatusMessage(null);
    setLoading(true);

    // Simulate authenticating and entering FORGE product
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 1200);
    }, 900);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setStatusMessage('Demo environment: password reset link sent to ' + (email || 'your email') + '.');
  };

  const handleRequestAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    setStatusMessage('Demo access is enabled for all founders. You can log in directly.');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: easeOut }}
      className="min-h-screen w-full bg-background text-foreground flex flex-col lg:flex-row overflow-hidden"
    >
      {/* LEFT: Visual Composition (50–55% desktop width) */}
      <div className="relative w-full lg:w-[54%] bg-background-alt flex flex-col justify-between p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-border overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="bg-fine-grid pointer-events-none absolute inset-0 opacity-60"
          style={{
            maskImage: 'radial-gradient(ellipse 70% 65% at 50% 45%, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 45%, black 20%, transparent 80%)',
          }}
        />

        {/* Top header on visual pane */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-foreground-soft transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to overview
          </button>
          <span className="text-xs tracking-[0.2em] text-foreground-faint uppercase font-medium">
            Access Portal
          </span>
        </div>

        {/* Center illustration & paper-cut composition */}
        <div className="relative z-10 my-8 lg:my-0 flex items-center justify-center">
          <div className="relative w-full max-w-[420px] sm:max-w-[480px]">
            {/* Paper-cut layered backdrop sheets */}
            <motion.div
              initial={{ opacity: 0, rotate: -4, scale: 0.95 }}
              animate={{ opacity: 1, rotate: -3.5, scale: 1 }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
              className="absolute inset-0 h-[88%] w-[90%] m-auto rounded-[3px] border border-border bg-[#F0EBE0]/80 shadow-[0_12px_32px_rgba(22,19,15,0.04)]"
            />
            <motion.div
              initial={{ opacity: 0, rotate: 3, scale: 0.96 }}
              animate={{ opacity: 1, rotate: 2.2, scale: 1 }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.18 }}
              className="absolute inset-0 h-[84%] w-[88%] m-auto rounded-[3px] border border-border bg-surface/90 shadow-[0_16px_40px_rgba(22,19,15,0.06)]"
            />

            {/* Hand-drawn character illustration */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: easeOut, delay: 0.25 }}
              className="relative z-[4] p-4 flex flex-col items-center"
            >
              <img
                src="/illustrations/hero-founder.png"
                alt="FORGE Founder in serene workspace"
                className="w-[85%] max-w-[340px] select-none"
                draggable={false}
              />

              {/* Floating editorial tags */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.72rem] text-foreground-soft">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-finance)]" />
                  Finance
                </span>
                <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.72rem] text-foreground-soft">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-hiring)]" />
                  Hiring
                </span>
                <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.72rem] text-foreground-soft">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-legal)]" />
                  Legal
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom brand note */}
        <div className="relative z-10 border-t border-foreground/10 pt-5 flex items-center justify-between text-xs text-foreground-faint">
          <span>FORGE Operating System</span>
          <span className="italic">Build the company. Not the chaos.</span>
        </div>
      </div>

      {/* RIGHT: Authentication Area (46% desktop width) */}
      <div className="relative w-full lg:w-[46%] bg-background flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        {/* Top Wordmark */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="font-display text-2xl tracking-tight text-foreground text-left"
          >
            FORGE
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 px-2.5 py-1 text-[0.7rem] text-foreground-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Live Demo
          </span>
        </div>

        {/* Center Login Form */}
        <div className="my-auto py-10 max-w-md w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.15 }}
          >
            <h1 className="font-display text-[2.2rem] sm:text-[2.6rem] leading-[1.08] tracking-[-0.01em] text-foreground">
              Welcome to FORGE.
            </h1>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-foreground-soft">
              Your workspace for building what comes next.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 rounded-xl border border-emerald-600/20 bg-emerald-500/[0.06] p-6 text-center"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-display text-lg text-foreground">Access Granted</h3>
                <p className="mt-1 text-xs text-foreground-soft">
                  Preparing your workspace environment...
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: easeOut, delay: 0.25 }}
                className="mt-8 flex flex-col gap-5"
              >
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium uppercase tracking-[0.14em] text-foreground-soft mb-2"
                  >
                    Work email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="founder@company.com"
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-[0.92rem] text-foreground placeholder:text-foreground-faint focus:border-foreground focus:outline-none transition-colors duration-200 shadow-sm"
                    />
                    <Mail className="absolute right-3.5 top-3.5 h-4 w-4 text-foreground-faint pointer-events-none" />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium uppercase tracking-[0.14em] text-foreground-soft"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-foreground-soft hover:text-foreground transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-[0.92rem] text-foreground placeholder:text-foreground-faint focus:border-foreground focus:outline-none transition-colors duration-200 shadow-sm"
                    />
                    <Lock className="absolute right-3.5 top-3.5 h-4 w-4 text-foreground-faint pointer-events-none" />
                  </div>
                </div>

                {/* Status / feedback notice */}
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-border bg-surface/80 p-3 text-xs text-foreground-soft"
                  >
                    {statusMessage}
                  </motion.div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-[0.95rem] font-medium text-background transition-all duration-300 hover:bg-accent disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Enter FORGE
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Request access prompt */}
                <div className="mt-3 text-center border-t border-foreground/10 pt-5">
                  <span className="text-xs text-foreground-soft">
                    Don't have access yet?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={handleRequestAccess}
                    className="text-xs font-medium text-foreground hover:text-accent transition-colors underline underline-offset-4"
                  >
                    Request access →
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="border-t border-foreground/10 pt-5 flex items-center justify-between text-[0.72rem] text-foreground-faint">
          <span>Protected by FORGE Workspace Auth</span>
          <span>v1.0 · Demo</span>
        </div>
      </div>
    </motion.div>
  );
}
