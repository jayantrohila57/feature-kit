/**
 * When browser history cannot safely go back in-app, navigate to a fallback URL instead.
 */
export function shouldUseFallbackOnBack(input: {
	historyLength: number
	currentOrigin: string
	referrer: string
}): boolean {
	if (input.historyLength <= 1) return true
	if (!input.referrer) return true

	try {
		const referrer = new URL(input.referrer)
		return referrer.origin !== input.currentOrigin
	} catch {
		return true
	}
}

export const DEFAULT_BACK_FALLBACK_HREF = "/examples"
