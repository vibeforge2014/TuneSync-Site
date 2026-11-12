import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import Logo from "./Logo";

export default function Footer() {
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container-page">
        <div className="footer-top">
          <div>
            <Logo size={32} />
            <p className="footer-tagline">{tCommon("tagline")}</p>
          </div>
          <div>
            <p className="footer-label">{tNav("product")}</p>
            <div className="footer-links">
              <Link href="/features">{tNav("features")}</Link>
              <Link href="/docs/getting-started">{tNav("gettingStarted")}</Link>
            </div>
          </div>
          <div>
            <p className="footer-label">{tNav("resources")}</p>
            <div className="footer-links">
              <Link href="/docs">{tNav("docs")}</Link>
              <Link href="/support">{tNav("support")}</Link>
              <Link href="/privacy">{tNav("privacy")}</Link>
            </div>
          </div>
        </div>
        <p className="footer-wordmark" aria-hidden>TuneSync<span className="text-[var(--brand)]">.</span></p>
        <div className="footer-bottom">
          <p>© {year} TUNESYNC / {tCommon("rights")}</p>
          <p>{tCommon("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
