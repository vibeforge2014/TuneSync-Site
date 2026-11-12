"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "../../../i18n/routing";
import { ArrowUpRight, Menu, X } from "lucide-react";
import LangSwitcher from "./LangSwitcher";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { downloadUrl } from "../../lib/links";

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const iosUrl = downloadUrl("ios");

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const desktop = window.matchMedia("(min-width: 768px)");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const links: { href: "/features" | "/docs"; label: string }[] = [
    { href: "/features", label: t("features") },
    { href: "/docs", label: t("docs") },
  ];

  function isActive(href: string) {
    return href === "/docs" ? pathname.startsWith("/docs") : pathname === href;
  }

  return (
    <>
    <header
      className="site-header sticky top-0 z-50 w-full backdrop-blur-xl"
      style={{ background: "var(--glass)" }}
      data-menu-open={open}
    >
      <div className="container-page flex items-center justify-between gap-4">
        <Link href="/" className="brand-link" onClick={() => setOpen(false)} aria-label="TuneSync home">
          <Logo size={29} />
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`site-nav-link ${isActive(link.href) ? "active" : ""}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LangSwitcher />
          </div>
          <ThemeToggle />
          {iosUrl && (
            <div className="hidden md:block">
              <a href={iosUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !min-h-0 !px-4 !py-2 !text-xs">
                {t("download")}<ArrowUpRight className="size-3.5" />
              </a>
            </div>
          )}
          <button
            type="button"
            className="icon-button relative inline-flex size-9 items-center justify-center rounded-full border text-[var(--fg)] md:hidden"
            style={{ borderColor: "var(--border)" }}
            aria-label={t("menu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <Menu className="glyph-swap size-4" data-hidden={open} aria-hidden />
            <X className="glyph-swap size-4" data-hidden={!open} aria-hidden />
          </button>
        </div>
      </div>

      {/* Kept mounted so the panel can ease open and closed. */}
      <div id="mobile-menu" className={`mobile-menu-shell ${open ? "is-open" : ""}`}>
        <div className="mobile-menu-clip">
          <nav className="mobile-menu" aria-label="Mobile navigation" inert={!open}>
            <p className="mobile-menu-label">{t("menu")}</p>
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{ ["--i" as string]: index }}
                className={`mobile-menu-link ${isActive(link.href) ? "active" : ""}`}
              >
                <span className="mobile-menu-index">0{index + 1}</span>
                <span className="mobile-menu-text">{link.label}</span>
                <ArrowUpRight className="size-4 text-[var(--fg-subtle)]" />
              </Link>
            ))}
            <div className="mobile-menu-foot">
              <LangSwitcher />
              {iosUrl && (
                <a href={iosUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="btn-primary !min-h-0 !px-4 !py-2 !text-xs">
                  {t("download")}
                </a>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
    {/* Sits outside the header: its backdrop-filter would trap a fixed child. */}
    <div className="mobile-menu-scrim" onClick={() => setOpen(false)} aria-hidden />
    </>
  );
}
