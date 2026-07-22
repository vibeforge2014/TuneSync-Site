import { getTranslations } from 'next-intl/server'
import DocsArticle from '../../../../components/docs/DocsArticle'
import { Callout } from '../../../../components/docs/DocContent'
import { enableStaticLocale } from '../../lib'

export default async function PlusPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params
	enableStaticLocale(locale)
	const t = await getTranslations('docs.plus')

	return (
		<DocsArticle path="/docs/plus">
			<h1>{t('title')}</h1>
			<p className="text-lg text-[var(--fg-muted)]">{t('lead')}</p>

			<h2>{t('overview.title')}</h2>
			<p>{t('overview.body')}</p>
			<ul>
				<li>{t('features.separation')}</li>
				<li>{t('features.lyrics')}</li>
				<li>{t('features.scraping')}</li>
				<li>{t('features.trends')}</li>
			</ul>

			<h2>{t('free.title')}</h2>
			<p>{t('free.body')}</p>

			<h2>{t('purchase.title')}</h2>
			<p>{t('purchase.body')}</p>

			<h2>{t('manage.title')}</h2>
			<p>{t('manage.body')}</p>

			<Callout variant="info" title={t('privacy.title')}>
				<p>{t('privacy.body')}</p>
			</Callout>
		</DocsArticle>
	)
}
