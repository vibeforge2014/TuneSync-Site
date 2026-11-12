import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "../../../../i18n/routing";
import DocsArticle from "../../../components/docs/DocsArticle";
import { Rocket, Server, Music4, Mic, Sparkles, Wand2, TrendingUp, FileMusic, Settings, ArrowUpRight } from "lucide-react";

const CARDS = [
  { href: "/docs/getting-started", icon: Rocket, key: "gettingStarted" },
  { href: "/docs/library", icon: Server, key: "library" },
  { href: "/docs/player", icon: Music4, key: "player" },
  { href: "/docs/lyrics", icon: FileMusic, key: "lyrics" },
  { href: "/docs/karaoke", icon: Mic, key: "karaoke" },
  { href: "/docs/ai", icon: Sparkles, key: "ai" },
  { href: "/docs/metadata", icon: Wand2, key: "metadata" },
  { href: "/docs/discovery", icon: TrendingUp, key: "discovery" },
  { href: "/docs/settings", icon: Settings, key: "settings" },
] as const;

export default async function DocsHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("docs");
  const tc = await getTranslations("docsNav");

  return (
    <DocsArticle path="/docs">
      <span className="section-kicker not-prose">Field notes / User manual</span>
      <h1 className="!mt-6">{t("intro.title")}</h1>
      <p className="text-lg text-[var(--fg-muted)]">{t("intro.lead")}</p>
      <p>{t("intro.body")}</p>

      <div className="not-prose my-10 grid border-l border-t sm:grid-cols-2" style={{ borderColor: "var(--border)" }}>
        {CARDS.map(({ href, icon: Icon, key }, i) => (
          <Link key={href} href={href} className="group grid grid-cols-[2rem_1fr_auto] items-center gap-3 border-b border-r p-5 transition-colors hover:bg-[var(--lime)] hover:text-[#191916]" style={{ borderColor: "var(--border)" }}>
            <span className="font-mono text-[10px] text-[var(--brand)]">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex items-center gap-2 text-sm font-semibold"><Icon className="size-4" strokeWidth={1.6} />{tc(key)}</span>
            <ArrowUpRight className="size-4 text-[var(--fg-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        ))}
      </div>
    </DocsArticle>
  );
}
