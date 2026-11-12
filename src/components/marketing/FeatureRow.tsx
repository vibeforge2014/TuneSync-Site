import type { LucideIcon } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import Reveal from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  screenshot: string;
  screenshotLabel?: string;
  icon: LucideIcon;
  reverse?: boolean;
  index?: number;
};

export default function FeatureRow({
  eyebrow,
  title,
  description,
  bullets,
  screenshot,
  screenshotLabel,
  icon: Icon,
  reverse = false,
  index = 1,
}: Props) {
  const number = String(index).padStart(2, "0");

  return (
    <section className={`feature-story tone-${index % 4} ${reverse ? "reverse" : ""}`}>
      <div className="container-page feature-story-grid">
        <div className="feature-copy">
          <Reveal variant="fade" className="feature-number">
            <span>{number} /</span>
            <span className="inline-flex items-center gap-2"><Icon className="size-3.5" />{eyebrow}</span>
          </Reveal>
          <Reveal variant="clip" delay={40}>
            <h2 className="feature-title">{title}</h2>
          </Reveal>
          <Reveal variant="fade" delay={140}>
            <p className="feature-description">{description}</p>
          </Reveal>
          <Reveal as="ul" variant="fade" delay={200} className="feature-bullets">
            {bullets.map((bullet, i) => (
              <li key={bullet} style={{ ["--i" as string]: i }}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <p className="m-0">{bullet}</p>
              </li>
            ))}
          </Reveal>
        </div>

        <Reveal variant="scale" delay={80} kinetic="stage" className="feature-stage">
          <span className="stage-ghost-number" aria-hidden>{number}</span>
          <span className="stage-caption">{screenshotLabel ?? eyebrow} / TuneSync</span>
          <div className="stage-phone">
            <PhoneMockup screenshot={screenshot} alt={screenshotLabel ?? title} />
          </div>
          <span className="stage-bars" aria-hidden><i /><i /><i /><i /><i /><i /></span>
        </Reveal>
      </div>
    </section>
  );
}
