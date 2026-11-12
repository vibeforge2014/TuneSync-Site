"use client";

import { useTranslations } from "next-intl";
import Reveal from "./Reveal";

const KEYS = ["quote1", "quote2", "quote3", "quote4", "quote5", "quote6"] as const;

export default function TestimonialsSection() {
  const t = useTranslations("home");
  return (
    <section className="container-page testimonials">
      <Reveal variant="fade" className="testimonials-head">
        <div>
          <span className="section-kicker">{t("testimonialsEyebrow")}</span>
          <h2 className="testimonials-title">{t("testimonialsTitle")}</h2>
        </div>
        <span className="testimonials-mark" aria-hidden>”</span>
      </Reveal>
      <div className="testimonial-grid">
        {KEYS.map((key, i) => (
          <Reveal key={key} variant="fade" delay={i * 55}>
            <figure className="testimonial">
              <span className="testimonial-index">NOTE / {String(i + 1).padStart(2, "0")}</span>
              <blockquote>“{t(`testimonials.${key}.text`)}”</blockquote>
              <figcaption>
                <p className="testimonial-author">{t(`testimonials.${key}.author`)}</p>
                <p className="testimonial-role">{t(`testimonials.${key}.role`)}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
