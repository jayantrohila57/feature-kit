/** Canonical site origin for metadata, feeds, and absolute URLs. */
export function getSiteOrigin(): string {
	const fromEnv = process.env["NEXT_PUBLIC_SITE_URL"] ?? process.env["VERCEL_URL"]
	if (fromEnv) {
		const withProtocol = fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`
		return withProtocol.replace(/\/$/, "")
	}
	return "http://localhost:3000"
}

export function getMetadataBase(): URL {
	return new URL(`${getSiteOrigin()}/`)
}
