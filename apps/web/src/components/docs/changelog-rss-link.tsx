import Link from "next/link"
import { Rss } from "lucide-react"

export function ChangelogRssLink() {
	return (
		<p className="not-prose mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
			<span>Latest updates and announcements.</span>
			<Link
				className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline"
				href="/docs/changelog/rss.xml">
				<Rss aria-hidden className="size-3.5" />
				RSS feed
			</Link>
		</p>
	)
}
