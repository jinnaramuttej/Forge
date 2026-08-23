import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Why FORGE', href: '#why-forge' },
];

interface NavbarProps {
  onEnterForge?: () => void;
}

export default function Navbar({ onEnterForge }: NavbarProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 left-1/2 z-50 w-[calc(100%-1.25rem)] max-w-3xl -translate-x-1/2 sm:top-6"
      >
        <div
          className={`glass-liquid flex items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-300 sm:px-6 sm:py-3`}
        >
          <a
            href="#top"
            className="font-display text-[1.15rem] tracking-tight text-foreground sm:text-xl"
          >
            FORGE
          </a>

          <nav className="hidden items-center gap-9 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[0.9rem] text-foreground-soft transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="#enter"
            onClick={(e) => {
              if (onEnterForge) {
                e.preventDefault();
                onEnterForge();
              }
            }}
            className="group hidden items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm text-background transition-colors duration-300 hover:bg-accent md:inline-flex"
          >
            Enter FORGE
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>

          <button
            className="p-1 text-foreground md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-2xl md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-display text-xl text-foreground">FORGE</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 text-foreground"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <motion.nav
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
              className="flex flex-col gap-1 px-6 pt-10"
            >
              {navLinks.map((l) => (
                <motion.a
                  key={l.label}
                  variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-foreground/10 py-4 font-display text-3xl text-foreground"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                href="#enter"
                onClick={(e) => {
                  setMenuOpen(false);
                  if (onEnterForge) {
                    e.preventDefault();
                    onEnterForge();
                  }
                }}
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-3 text-background"
              >
                Enter FORGE <ArrowRight className="h-4 w-4" />
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
