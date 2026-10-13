/** Demo mode runs without GitHub or database env — memory adapter + fixed secret. */
export function isAuthDemoMode(): boolean {
	if (process.env["AUTH_DEMO_MODE"] === "false") {
		return false
	}
	const hasGithub =
		Boolean(process.env["GITHUB_CLIENT_ID"]?.trim()) && Boolean(process.env["GITHUB_CLIENT_SECRET"]?.trim())
	const hasDatabase = Boolean(process.env["DATABASE_URL"]?.trim())
	return !hasGithub || !hasDatabase
}

export function getAuthBaseUrl(): string {
	if (process.env["BETTER_AUTH_URL"]) {
		return process.env["BETTER_AUTH_URL"]
	}
	if (process.env["VERCEL_URL"]) {
		return `https://${process.env["VERCEL_URL"]}`
	}
	return process.env["NEXT_PUBLIC_SITE_URL"] ?? "http://localhost:3000"
}
