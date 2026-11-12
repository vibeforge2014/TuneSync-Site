"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import { ArrowUpRight } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import AppStoreBadge from "../site/AppStoreBadge";
import Reveal from "./Reveal";

const SOURCES = ["WEBDAV", "PLEX", "NAVIDROME", "JELLYFIN", "EMBY", "LOCAL FILES"];

export default function Hero() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <Reveal variant="fade">
            <p className="hero-badge">{t("badge")}</p>
          </Reveal>
          <h1 className="hero-title">
            {t.rich("headline", {
              lead: (chunks) => <span className="hero-title-line hero-title-lead">{chunks}</span>,
              accent: (chunks) => (
                <span className="display-accent">
                  <span className="hero-title-line hero-title-accent">{chunks}</span>
                </span>
              ),
            })}
          </h1>
          <Reveal variant="fade" delay={300}>
            <p className="hero-subhead">{t("subhead")}</p>
          </Reveal>
          <Reveal variant="lift" delay={390} className="hero-actions">
            <AppStoreBadge />
            <Link href="/features" className="btn-ghost">
              {t("ctaSecondary")}
              <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
          <Reveal variant="fade" delay={500} className="hero-micro">
            <span>LOCAL FIRST</span>
            <span>LOSSLESS AUDIO</span>
            <span>SING + RECORD</span>
          </Reveal>
        </div>

        <Reveal variant="scale" delay={100} kinetic="hero" className="hero-art">
          <p className="hero-art-label">TUNESYNC®<br />SIDE A / 2026</p>
          <div className="hero-disc" aria-hidden />
          <div className="hero-phone-back" aria-hidden>
            <PhoneMockup screenshot={`${locale}/player.png`} alt="" />
          </div>
          <div className="hero-phone">
            <PhoneMockup screenshot={`${locale}/home.png`} alt={t("phoneLabel")} />
          </div>
          <div className="hero-sticker" aria-hidden>YOUR MUSIC<br />YOUR WAY<br />↗</div>
        </Reveal>
      </div>

      <div className="source-rail" aria-label="Supported music sources">
        <div className="source-rail-inner">
          {SOURCES.map((source, index) => (
            <span key={source} style={{ ["--i" as string]: index }}>{source}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
