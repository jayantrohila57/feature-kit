import {
	escapeXml,
	getSiteOrigin,
	loadChangelogEntries,
	markdownToPlainText,
} from "@/lib/changelog-feed"

export async function GET(request: Request) {
	const origin = getSiteOrigin(request)
	const channelLink = `${origin}/docs/changelog`
	const entries = await loadChangelogEntries()

	const items = entries
		.map((entry) => {
			const guid = `${channelLink}#${entry.title.replace(/\s+/g, "-").toLowerCase()}`
			const description = escapeXml(markdownToPlainText(entry.body))
			const pubDate = entry.pubDate.toUTCString()
			return `<item>
  <title>${escapeXml(entry.title)}</title>
  <link>${escapeXml(channelLink)}</link>
  <guid isPermaLink="false">${escapeXml(guid)}</guid>
  <pubDate>${pubDate}</pubDate>
  <description>${description}</description>
</item>`
		})
		.join("\n")

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feature Kit Changelog</title>
    <link>${escapeXml(channelLink)}</link>
    <description>Latest updates and announcements for Feature Kit docs and packages.</description>
    <language>en</language>
    ${items}
  </channel>
</rss>`

	return new Response(xml, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	})
}
