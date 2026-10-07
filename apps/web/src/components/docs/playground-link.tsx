import Link from "next/link"
import type { ReactNode } from "react"

type PlaygroundLinkProps = {
	href: string
	children?: ReactNode
}

export function PlaygroundLink({ href, children }: PlaygroundLinkProps) {
	return (
		<div className="not-prose my-6 flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
			<p className="text-muted-foreground text-sm">Live preview with sample data in the docs.</p>
			<Link
				className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-primary px-4 font-medium text-primary-foreground text-sm"
				href={href}>
				{children ?? "Open preview"}
			</Link>
		</div>
	)
}
