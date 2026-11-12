import { getTranslations, setRequestLocale } from "next-intl/server";
import { Disc3, Server, Music4, ListMusic, Mic, AudioWaveform, PlayCircle } from "lucide-react";
import FeatureRow from "../../../components/marketing/FeatureRow";
import CTASection from "../../../components/marketing/CTASection";

export default async function FeaturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("features");

  return (
    <>
      <section className="page-hero">
        <div className="container-page page-hero-inner">
          <div>
            <span className="section-kicker">The complete player / 07 chapters</span>
            <h1 className="page-title">{t("pageTitle")}</h1>
            <p className="page-hero-index">IPHONE · IPAD · MAC / TUNESYNC 1.0.32</p>
          </div>
          <p className="page-lead">{t("subtitle")}</p>
        </div>
      </section>

      <FeatureRow index={1} eyebrow={t("library.title")} title={t("library.featureTitle")} description={t("library.featureDesc")}
        bullets={[t("library.featureB1"), t("library.featureB2"), t("library.featureB3"), t("library.featureB4")]}
        screenshot={`${locale}/library.png`} screenshotLabel={t("library.screenshot")} icon={Disc3} />
      <FeatureRow index={2} eyebrow={t("sources.title")} title={t("sources.featureTitle")} description={t("sources.featureDesc")}
        bullets={[t("sources.featureB1"), t("sources.featureB2"), t("sources.featureB3"), t("sources.featureB4")]}
        screenshot={`${locale}/sources.png`} screenshotLabel={t("sources.screenshot")} icon={Server} reverse />
      <FeatureRow index={3} eyebrow={t("player.title")} title={t("player.featureTitle")} description={t("player.featureDesc")}
        bullets={[t("player.featureB1"), t("player.featureB2"), t("player.featureB3"), t("player.featureB4")]}
        screenshot={`${locale}/player.png`} screenshotLabel={t("player.screenshot")} icon={Music4} />
      <FeatureRow index={4} eyebrow={t("lyrics.title")} title={t("lyrics.featureTitle")} description={t("lyrics.featureDesc")}
        bullets={[t("lyrics.featureB1"), t("lyrics.featureB2"), t("lyrics.featureB3"), t("lyrics.featureB4")]}
        screenshot={`${locale}/lyrics.png`} screenshotLabel={t("lyrics.screenshot")} icon={ListMusic} reverse />
      <FeatureRow index={5} eyebrow={t("karaoke.title")} title={t("karaoke.featureTitle")} description={t("karaoke.featureDesc")}
        bullets={[t("karaoke.featureB1"), t("karaoke.featureB2"), t("karaoke.featureB3"), t("karaoke.featureB4")]}
        screenshot={`${locale}/recording.png`} screenshotLabel={t("karaoke.screenshot")} icon={Mic} />
      <FeatureRow index={6} eyebrow={t("audioStudio.title")} title={t("audioStudio.featureTitle")} description={t("audioStudio.featureDesc")}
        bullets={[t("audioStudio.featureB1"), t("audioStudio.featureB2"), t("audioStudio.featureB3"), t("audioStudio.featureB4")]}
        screenshot={`${locale}/recording-studio.png`} screenshotLabel={t("audioStudio.screenshot")} icon={AudioWaveform} reverse />
      <FeatureRow index={7} eyebrow={t("takePlayback.title")} title={t("takePlayback.featureTitle")} description={t("takePlayback.featureDesc")}
        bullets={[t("takePlayback.featureB1"), t("takePlayback.featureB2"), t("takePlayback.featureB3"), t("takePlayback.featureB4")]}
        screenshot={`${locale}/take-playback.png`} screenshotLabel={t("takePlayback.screenshot")} icon={PlayCircle} />
      <CTASection />
    </>
  );
}
