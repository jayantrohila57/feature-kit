const PRODUCTION_SITE_ORIGIN = "https://feature-kits.vercel.app"

function normalizeSiteOrigin(value: string): string {
	const withProtocol = value.startsWith("http") ? value : `https://${value}`
	return withProtocol.replace(/\/$/, "")
}

/** Canonical site origin for metadata, feeds, and absolute URLs. */
export function getSiteOrigin(): string {
	const fromPublic = process.env["NEXT_PUBLIC_SITE_URL"]
	if (fromPublic) {
		return normalizeSiteOrigin(fromPublic)
	}

	if (process.env["VERCEL_ENV"] === "production") {
		return PRODUCTION_SITE_ORIGIN
	}

	const vercelHost = process.env["VERCEL_URL"]
	if (vercelHost) {
		return normalizeSiteOrigin(vercelHost)
	}

	return "http://localhost:3000"
}

export function getMetadataBase(): URL {
	return new URL(`${getSiteOrigin()}/`)
}
