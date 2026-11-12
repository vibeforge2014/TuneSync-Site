import type { ReactNode } from "react";
import { Info, Lightbulb, TriangleAlert, CheckCircle2 } from "lucide-react";
import { asset } from "../../lib/assets";

type CalloutVariant = "info" | "tip" | "warning" | "success";

const CALLOUT_ICONS: Record<CalloutVariant, typeof Info> = {
  info: Info,
  tip: Lightbulb,
  warning: TriangleAlert,
  success: CheckCircle2,
};

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}) {
  const Icon = CALLOUT_ICONS[variant];
  return (
    <aside className="doc-callout" data-variant={variant}>
      <span className="doc-callout-icon">
        <Icon className="size-4" />
      </span>
      <div className="doc-callout-body">
        {title && <p className="doc-callout-title">{title}</p>}
        <div className="text-[var(--fg-muted)] [&>p]:my-0">{children}</div>
      </div>
    </aside>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="doc-steps">{children}</ol>;
}

export function Step({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="doc-step">
      <span className="doc-step-index">{String(index).padStart(2, "0")}</span>
      <div className="flex-1 pb-1">
        <p className="font-semibold">{title}</p>
        <div className="mt-1 text-sm text-[var(--fg-muted)] [&>p]:my-1 [&>ul]:my-2 [&_li]:my-0.5">
          {children}
        </div>
      </div>
    </li>
  );
}

export function ScreenshotPlaceholder({
  label,
  hint,
  screenshot,
}: {
  label: string;
  hint?: string;
  screenshot?: string;
  tint?: string;
}) {
  if (screenshot) {
    return (
      <figure className="doc-shot">
        <div className="doc-shot-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(`/screenshots/${screenshot}`)}
            alt={label}
            className="doc-shot-img"
          />
        </div>
        <figcaption className="doc-shot-caption">{label}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="doc-shot">
      <div className="doc-shot-empty">
        <svg
          viewBox="0 0 24 24"
          className="size-5 text-[var(--fg-subtle)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <p className="doc-shot-empty-label">{label}</p>
        {hint && <p className="text-xs text-[var(--fg-subtle)]">{hint}</p>}
      </div>
    </figure>
  );
}

export function KeyValueTable({
  rows,
}: {
  rows: { k: string; v: string }[];
}) {
  return (
    <div className="doc-kv">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.k}
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
            >
              <td className="doc-kv-key">{r.k}</td>
              <td className="px-4 py-3 align-top text-[var(--fg-muted)]">{r.v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
