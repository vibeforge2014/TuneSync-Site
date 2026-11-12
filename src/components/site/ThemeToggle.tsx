"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";

type ThemeDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

export default function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const next = !dark;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const applyTheme = () => {
      flushSync(() => setDark(next));
      root.classList.toggle("dark", next);
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {
        /* Storage can be unavailable in private browsing. */
      }
    };

    const startViewTransition = (document as ThemeDocument).startViewTransition;
    if (startViewTransition && !reduced) {
      const rect = event.currentTarget.getBoundingClientRect();
      root.style.setProperty("--theme-x", `${rect.left + rect.width / 2}px`);
      root.style.setProperty("--theme-y", `${rect.top + rect.height / 2}px`);
      const transition = startViewTransition.call(document, applyTheme);
      void transition.finished.finally(() => {
        root.style.removeProperty("--theme-x");
        root.style.removeProperty("--theme-y");
      });
      return;
    }

    // Fallback for browsers without View Transitions and for reduced motion.
    applyTheme();
    if (reduced) return;
    root.classList.add("theme-anim");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => root.classList.remove("theme-anim"), 360);
  }

  if (!mounted) {
    return (
      <span
        className={`inline-flex size-9 items-center justify-center rounded-full ${className ?? ""}`}
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={`icon-button relative inline-flex size-9 items-center justify-center rounded-full border text-[var(--fg)] transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${className ?? ""}`}
      style={{ borderColor: "var(--border)" }}
    >
      <Moon className="glyph-swap size-4" data-hidden={dark} aria-hidden />
      <Sun className="glyph-swap size-4" data-hidden={!dark} aria-hidden />
    </button>
  );
}
