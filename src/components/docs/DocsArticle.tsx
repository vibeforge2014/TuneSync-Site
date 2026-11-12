import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import { findDocMeta } from "./nav";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

export default function DocsArticle({ path, children }: { path: string; children: ReactNode }) {
  const t = useTranslations("docsNav");
  const { prev, next, current } = findDocMeta(path);
  const breadcrumb = current ? t(current.labelKey.replace("docsNav.", "")) : "";

  return (
    <article className="prose-doc">
      <nav className="doc-breadcrumb not-prose mb-10 flex items-center gap-1.5 text-[var(--fg-subtle)]">
        <Link href="/docs" className="hover:text-[var(--fg)]">{t("intro")}</Link>
        <ChevronRight className="size-3" />
        <span className="text-[var(--fg-muted)]">{breadcrumb}</span>
      </nav>

      {children}

      <nav className="not-prose mt-20 grid gap-3 border-t pt-6 sm:grid-cols-2" style={{ borderColor: "var(--border)" }}>
        {prev ? (
          <Link href={prev.href} className="doc-pager group flex items-center gap-3 border p-5 transition-colors hover:bg-[var(--lime)] hover:text-[#191916]" style={{ borderColor: "var(--border)" }}>
            <ArrowLeft className="size-4 text-[var(--fg-muted)] transition-transform group-hover:-translate-x-1" />
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[var(--fg-subtle)]">{t("previous")}</p>
              <p className="m-0 text-sm font-semibold">{t(prev.labelKey.replace("docsNav.", ""))}</p>
            </div>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={next.href} className="doc-pager group flex items-center justify-end gap-3 border p-5 text-right transition-colors hover:bg-[var(--lime)] hover:text-[#191916]" style={{ borderColor: "var(--border)" }}>
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[var(--fg-subtle)]">{t("next")}</p>
              <p className="m-0 text-sm font-semibold">{t(next.labelKey.replace("docsNav.", ""))}</p>
            </div>
            <ArrowRight className="size-4 text-[var(--fg-muted)] transition-transform group-hover:translate-x-1" />
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
