import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";

export default function NotFound() {
  const t = useTranslations("common");
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-32 text-center">
      <p className="text-6xl font-bold tracking-tight">404</p>
      <p className="mt-4 text-lg text-[var(--fg-muted)]">{t("notFound")}</p>
      <Link href="/" className="btn-primary mt-8">
        {t("backHome")}
      </Link>
    </div>
  );
}
