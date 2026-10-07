import Link from "next/link"
import type { ReactNode } from "react"

type PlaygroundLinkProps = {
	href: string
	children?: ReactNode
}

export function PlaygroundLink({ href, children }: PlaygroundLinkProps) {
	return (
		<div className="not-prose my-6 flex flex-col gap-2 rounded-xl border bg-fd-card p-4 sm:flex-row sm:items-center sm:justify-between">
			<p className="text-fd-muted-foreground text-sm">
				See this pattern running in the playground with sample data and full UI chrome.
			</p>
			<Link
				className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-fd-primary px-4 font-medium text-fd-primary-foreground text-sm"
				href={href}>
				{children ?? "Open example"}
			</Link>
		</div>
	)
}
