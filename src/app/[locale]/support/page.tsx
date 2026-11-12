import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "../../../../i18n/routing";
import { enableStaticLocale } from "../lib";
import { ArrowUpRight, Mail } from "lucide-react";
import FaqAccordion from "../../../components/site/FaqAccordion";

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  enableStaticLocale(locale);
  const t = await getTranslations("support");
  const faqs = [1, 2, 3, 4, 5].map((i) => ({ q: t(`faq.q${i}`), a: t(`faq.a${i}`) }));

  return (
    <div className="container-page">
      <section className="support-hero">
        <div>
          <span className="section-kicker">Help / FAQ / Contact</span>
          <h1 className="support-title">{t("title")}</h1>
        </div>
        <p className="support-subtitle">{t("subtitle")}</p>
      </section>

      <section className="support-contact">
        <div>
          <h2>{t("contact.title")}</h2>
          <p>{t("contact.responseTime")}</p>
        </div>
        <a href={`mailto:${t("contact.email")}`} className="support-email">
          <Mail className="size-4" />{t("contact.email")}<ArrowUpRight className="size-4" />
        </a>
      </section>

      <section className="faq-wrap">
        <div className="faq-head"><h2 className="faq-title">{t("faq.title")}</h2></div>
        <FaqAccordion items={faqs} />
      </section>

      <section className="support-resource">
        <div>
          <h2>{t("resources.title")}</h2>
          <p>{t("resources.body")}</p>
        </div>
        <Link href="/docs" className="btn-primary">{t("resources.button")}<ArrowUpRight className="size-4" /></Link>
      </section>
      <div className="h-20" />
    </div>
  );
}
