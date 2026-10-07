import { readFile } from "node:fs/promises"
import path from "node:path"

const CHANGELOG_PATH = path.join(process.cwd(), "content/docs/changelog.mdx")

export type ChangelogEntry = {
	title: string
	body: string
	/** Best-effort date for RSS from heading like "October 2026 — Title" */
	pubDate: Date
}

const MONTHS: Record<string, number> = {
	january: 0,
	february: 1,
	march: 2,
	april: 3,
	may: 4,
	june: 5,
	july: 6,
	august: 7,
	september: 8,
	october: 9,
	november: 10,
	december: 11,
}

function parseHeadingDate(title: string): Date {
	const match = /^([A-Za-z]+)\s+(\d{4})/.exec(title)
	const monthName = match?.[1]
	const yearText = match?.[2]
	if (!monthName || !yearText) {
		return new Date()
	}
	const month = MONTHS[monthName.toLowerCase()]
	const year = Number.parseInt(yearText, 10)
	if (month === undefined || Number.isNaN(year)) {
		return new Date()
	}
	return new Date(Date.UTC(year, month, 1, 12, 0, 0))
}

function stripFrontmatter(source: string): string {
	if (!source.startsWith("---")) {
		return source
	}
	const end = source.indexOf("---", 3)
	if (end === -1) {
		return source
	}
	return source.slice(end + 3).trimStart()
}

/** Skip intro, components, and maintainer sections when building the RSS feed. */
function isFeedSection(title: string): boolean {
	if (title.toLowerCase() === "for maintainers") {
		return false
	}
	return /^\w+\s+\d{4}/.test(title)
}

export async function loadChangelogEntries(): Promise<ChangelogEntry[]> {
	const raw = await readFile(CHANGELOG_PATH, "utf8")
	const body = stripFrontmatter(raw)
	const chunks = body.split(/\n(?=## )/)

	const entries: ChangelogEntry[] = []
	for (const chunk of chunks) {
		if (!chunk.startsWith("## ")) {
			continue
		}
		const newline = chunk.indexOf("\n")
		const titleLine = newline === -1 ? chunk : chunk.slice(0, newline)
		const title = titleLine.replace(/^##\s+/, "").trim()
		if (!isFeedSection(title)) {
			continue
		}
		const sectionBody = (newline === -1 ? "" : chunk.slice(newline + 1)).trim()
		entries.push({
			title,
			body: sectionBody,
			pubDate: parseHeadingDate(title),
		})
	}

	return entries
}

export function getSiteOrigin(request: Request): string {
	const fromEnv = process.env["NEXT_PUBLIC_SITE_URL"] ?? process.env["VERCEL_URL"]
	if (fromEnv) {
		const withProtocol = fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`
		return withProtocol.replace(/\/$/, "")
	}
	const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
	const proto = request.headers.get("x-forwarded-proto") ?? "http"
	if (host) {
		return `${proto}://${host}`.replace(/\/$/, "")
	}
	return "http://localhost:3000"
}

export function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;")
}

export function markdownToPlainText(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, "")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/^[-*]\s+/gm, "• ")
		.replace(/^#+\s+/gm, "")
		.trim()
}
