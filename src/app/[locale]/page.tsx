import { getTranslations, setRequestLocale } from "next-intl/server";
import { Server, Music4, ListMusic, Mic, AudioWaveform, PlayCircle } from "lucide-react";
import Hero from "../../components/marketing/Hero";
import IntroSection from "../../components/marketing/IntroSection";
import FeatureRow from "../../components/marketing/FeatureRow";
import FeatureGrid from "../../components/marketing/FeatureGrid";
import TestimonialsSection from "../../components/marketing/TestimonialsSection";
import CTASection from "../../components/marketing/CTASection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const f = await getTranslations("features");

  return (
    <>
      <Hero />
      <IntroSection />
      <FeatureRow
        index={1}
        eyebrow={f("sources.title")}
        title={f("sources.featureTitle")}
        description={f("sources.featureDesc")}
        bullets={[f("sources.featureB1"), f("sources.featureB2"), f("sources.featureB3"), f("sources.featureB4")]}
        screenshot={`${locale}/sources.png`}
        screenshotLabel={f("sources.screenshot")}
        icon={Server}
      />
      <FeatureRow
        index={2}
        eyebrow={f("player.title")}
        title={f("player.featureTitle")}
        description={f("player.featureDesc")}
        bullets={[f("player.featureB1"), f("player.featureB2"), f("player.featureB3"), f("player.featureB4")]}
        screenshot={`${locale}/player.png`}
        screenshotLabel={f("player.screenshot")}
        icon={Music4}
        reverse
      />
      <FeatureRow
        index={3}
        eyebrow={f("lyrics.title")}
        title={f("lyrics.featureTitle")}
        description={f("lyrics.featureDesc")}
        bullets={[f("lyrics.featureB1"), f("lyrics.featureB2"), f("lyrics.featureB3"), f("lyrics.featureB4")]}
        screenshot={`${locale}/lyrics.png`}
        screenshotLabel={f("lyrics.screenshot")}
        icon={ListMusic}
      />
      <FeatureRow
        index={4}
        eyebrow={f("karaoke.title")}
        title={f("karaoke.featureTitle")}
        description={f("karaoke.featureDesc")}
        bullets={[f("karaoke.featureB1"), f("karaoke.featureB2"), f("karaoke.featureB3"), f("karaoke.featureB4")]}
        screenshot={`${locale}/recording.png`}
        screenshotLabel={f("karaoke.screenshot")}
        icon={Mic}
        reverse
      />
      <FeatureRow
        index={5}
        eyebrow={f("audioStudio.title")}
        title={f("audioStudio.featureTitle")}
        description={f("audioStudio.featureDesc")}
        bullets={[f("audioStudio.featureB1"), f("audioStudio.featureB2"), f("audioStudio.featureB3"), f("audioStudio.featureB4")]}
        screenshot={`${locale}/recording-studio.png`}
        screenshotLabel={f("audioStudio.screenshot")}
        icon={AudioWaveform}
      />
      <FeatureRow
        index={6}
        eyebrow={f("takePlayback.title")}
        title={f("takePlayback.featureTitle")}
        description={f("takePlayback.featureDesc")}
        bullets={[f("takePlayback.featureB1"), f("takePlayback.featureB2"), f("takePlayback.featureB3"), f("takePlayback.featureB4")]}
        screenshot={`${locale}/take-playback.png`}
        screenshotLabel={f("takePlayback.screenshot")}
        icon={PlayCircle}
        reverse
      />
      <FeatureGrid />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
