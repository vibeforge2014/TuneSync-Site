import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

export default function IntroSection() {
  const t = useTranslations("home");
  return (
    <section className="container-page intro-section">
      <div className="intro-grid">
        <Reveal variant="fade"><span className="section-kicker">The TuneSync idea</span></Reveal>
        <div>
          <Reveal variant="clip">
            <h2 className="intro-statement">{t("introTitle")}</h2>
          </Reveal>
          <Reveal variant="fade" delay={180} className="intro-detail">
            <p>{t("introBody")}</p>
            <Link href="/features" className="text-link">
              {t("ctaSecondary")}
              <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
