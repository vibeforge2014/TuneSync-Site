"use client";

import { useTranslations } from "next-intl";
import { Server, Music4, ListMusic, AudioWaveform, Wand2, Search, Monitor, Sparkles, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

const ITEMS: { key: string; icon: LucideIcon }[] = [
  { key: "library", icon: Server },
  { key: "player", icon: Music4 },
  { key: "lyrics", icon: ListMusic },
  { key: "audioStudio", icon: AudioWaveform },
  { key: "metadata", icon: Wand2 },
  { key: "recognition", icon: Search },
  { key: "devices", icon: Monitor },
  { key: "plus", icon: Sparkles },
];

export default function FeatureGrid() {
  const t = useTranslations("features");
  return (
    <section className="capability-section">
      <div className="container-page">
        <div className="capability-head">
          <Reveal variant="fade">
            <span className="section-kicker">The full tracklist</span>
            <h2 className="capability-title">{t("title")}</h2>
          </Reveal>
          <Reveal variant="fade" delay={140}><p className="capability-subtitle">{t("subtitle")}</p></Reveal>
        </div>
        <div className="capability-grid">
          {ITEMS.map(({ key, icon: Icon }, i) => (
            <Reveal key={key} variant="scale" delay={i * 45}>
              <article className={`capability-card ${key === "plus" ? "is-plus" : ""}`}>
                <div className="capability-card-top">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <Icon className="size-5" strokeWidth={1.5} />
                </div>
                <h3>{t(`${key}.title`)}</h3>
                <p>{t(`${key}.desc`)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
