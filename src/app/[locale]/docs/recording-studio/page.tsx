import { getTranslations } from "next-intl/server";
import DocsArticle from "../../../../components/docs/DocsArticle";
import {
  Callout,
  ScreenshotPlaceholder,
  Steps,
  Step,
} from "../../../../components/docs/DocContent";
import { enableStaticLocale } from "../../lib";

export default async function RecordingStudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  enableStaticLocale(locale);
  const t = await getTranslations("docs.recordingStudio");

  return (
    <DocsArticle path="/docs/recording-studio">
      <h1>{t("title")}</h1>
      <p className="text-lg text-[var(--fg-muted)]">{t("lead")}</p>
      <ScreenshotPlaceholder
        label={t("screenshot")}
        screenshot={`${locale}/recording-studio.png`}
        tint="#f75e3c"
      />

      <h2>{t("open.title")}</h2>
      <p>{t("open.body")}</p>

      <h2>{t("workflow.title")}</h2>
      <Steps>
        <Step index={1} title={t("workflow.step1.title")}>
          <p>{t("workflow.step1.body")}</p>
        </Step>
        <Step index={2} title={t("workflow.step2.title")}>
          <p>{t("workflow.step2.body")}</p>
        </Step>
        <Step index={3} title={t("workflow.step3.title")}>
          <p>{t("workflow.step3.body")}</p>
        </Step>
        <Step index={4} title={t("workflow.step4.title")}>
          <p>{t("workflow.step4.body")}</p>
        </Step>
      </Steps>

      <h2>{t("controls.title")}</h2>
      <ul>
        <li>{t("controls.timeline")}</li>
        <li>{t("controls.preview")}</li>
        <li>{t("controls.history")}</li>
        <li>{t("controls.share")}</li>
      </ul>

      <Callout variant="success" title={t("nondestructive.title")}>
        <p>{t("nondestructive.body")}</p>
      </Callout>

      <Callout variant="info" title={t("format.title")}>
        <p>{t("format.body")}</p>
      </Callout>
    </DocsArticle>
  );
}
