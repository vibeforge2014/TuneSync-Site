import { getTranslations } from "next-intl/server";
import DocsArticle from "../../../../components/docs/DocsArticle";
import { Callout, KeyValueTable } from "../../../../components/docs/DocContent";
import { enableStaticLocale } from "../../lib";

export default async function TechnicalSpecPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  enableStaticLocale(locale);
  const t = await getTranslations("docs.technical");

  return (
    <DocsArticle path="/docs/technical-spec">
      <h1>{t("title")}</h1>
      <p className="text-lg text-[var(--fg-muted)]">{t("lead")}</p>

      <Callout variant="info" title={t("current.title")}>
        <p>{t("current.body")}</p>
      </Callout>

      <h2>{t("platform.title")}</h2>
      <KeyValueTable
        rows={[
          { k: t("platform.app.k"), v: t("platform.app.v") },
          { k: t("platform.os.k"), v: t("platform.os.v") },
          { k: t("platform.stack.k"), v: t("platform.stack.v") },
          { k: t("platform.persistence.k"), v: t("platform.persistence.v") },
          { k: t("platform.extensions.k"), v: t("platform.extensions.v") },
        ]}
      />

      <h2>{t("architecture.title")}</h2>
      <p>{t("architecture.body")}</p>
      <ul>
        <li>{t("architecture.ui")}</li>
        <li>{t("architecture.sources")}</li>
        <li>{t("architecture.tasks")}</li>
        <li>{t("architecture.playback")}</li>
      </ul>

      <h2>{t("sourceMatrix.title")}</h2>
      <KeyValueTable
        rows={[
          { k: t("sourceMatrix.files.k"), v: t("sourceMatrix.files.v") },
          { k: t("sourceMatrix.servers.k"), v: t("sourceMatrix.servers.v") },
          { k: t("sourceMatrix.selection.k"), v: t("sourceMatrix.selection.v") },
          { k: t("sourceMatrix.delivery.k"), v: t("sourceMatrix.delivery.v") },
        ]}
      />

      <h2>{t("metadata.title")}</h2>
      <p>{t("metadata.body")}</p>
      <ul>
        <li>{t("metadata.core")}</li>
        <li>{t("metadata.enrichment")}</li>
        <li>{t("metadata.budget")}</li>
        <li>{t("metadata.provenance")}</li>
      </ul>

      <h2>{t("security.title")}</h2>
      <ul>
        <li>{t("security.credentials")}</li>
        <li>{t("security.transport")}</li>
        <li>{t("security.diagnostics")}</li>
        <li>{t("security.ai")}</li>
      </ul>

      <h2>{t("audio.title")}</h2>
      <p>{t("audio.body")}</p>
      <ul>
        <li>{t("audio.formats")}</li>
        <li>{t("audio.separation")}</li>
        <li>{t("audio.recording")}</li>
      </ul>

      <h2>{t("system.title")}</h2>
      <p>{t("system.body")}</p>

      <Callout variant="warning" title={t("limits.title")}>
        <p>{t("limits.body")}</p>
      </Callout>
    </DocsArticle>
  );
}
