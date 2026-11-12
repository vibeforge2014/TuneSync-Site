import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../../i18n/routing";
import Header from "../../components/site/Header";
import Footer from "../../components/site/Footer";
import PageTransition from "../../components/site/PageTransition";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../i18n/messages/${locale}.json`))
    .default;
  const t = messages.meta;
  const site = messages.common.siteName;
  return {
    title: {
      default: t.title,
      template: `%s · ${site}`,
    },
    description: t.description,
    metadataBase: new URL("https://vibeforge2014.github.io"),
    openGraph: {
      title: t.title,
      description: t.description,
      siteName: site,
      type: "website",
      images: [
        {
          url: "/TuneSync-Site/og.png",
          width: 1200,
          height: 630,
          alt: `${site} — ${messages.common.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: ["/TuneSync-Site/og.png"],
    },
  };
}

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex min-h-dvh flex-col">
            <Header />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </div>
        </NextIntlClientProvider>
        <Script id="zensoft-site-analytics" src="https://zensoft.top/analytics.js" strategy="afterInteractive" data-product="tunesync" data-base-path={process.env.NEXT_PUBLIC_BASE_PATH ?? ""} referrerPolicy="no-referrer" />
      </body>
    </html>
  );
}
