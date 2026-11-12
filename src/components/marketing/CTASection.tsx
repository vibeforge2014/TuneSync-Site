import { useTranslations } from "next-intl";
import AppStoreBadge from "../site/AppStoreBadge";
import Reveal from "./Reveal";

export default function CTASection() {
  const t = useTranslations("home");
  return (
    <section className="cta-section">
      <div className="cta-disc" aria-hidden />
      <div className="container-page cta-inner">
        <Reveal variant="fade">
          <span className="section-kicker !text-[#191916]">Ready when you are</span>
        </Reveal>
        <Reveal variant="clip" delay={60}>
          <h2 className="cta-title">{t("ctaTitle")}</h2>
        </Reveal>
        <Reveal variant="fade" delay={200} className="cta-bottom">
          <p className="cta-body">{t("ctaBody")}</p>
          <AppStoreBadge />
        </Reveal>
      </div>
    </section>
  );
}
