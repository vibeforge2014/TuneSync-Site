/**
 * Central place for external links (download / store).
 *
 *   - iOS: App Store link
 *   - (Android / Windows: not yet available)
 */
export const DOWNLOAD_LINKS = {
	/** iOS App Store link. */
	ios: 'https://apps.apple.com/us/app/tunesync-nas%E6%97%A0%E6%8D%9F%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8/id6783845149',
	android: null,
	windows: null,
} as const

export type Platform = keyof typeof DOWNLOAD_LINKS

export function downloadUrl(platform: Platform): string | null {
	return DOWNLOAD_LINKS[platform]
}
