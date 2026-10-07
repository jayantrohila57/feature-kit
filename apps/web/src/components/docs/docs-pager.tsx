import Link from "next/link"

type DocsPagerProps = {
	previous?: { name: string; url: string } | null
	next?: { name: string; url: string } | null
}

export function DocsPager({ previous, next }: DocsPagerProps) {
	if (!previous && !next) return null

	return (
		<nav
			aria-label="Docs pages"
			className="not-prose mt-12 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:justify-between">
			{previous ? (
				<Link
					className="flex flex-col gap-0.5 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-muted/50 sm:max-w-[45%]"
					href={previous.url}>
					<span className="text-muted-foreground text-xs">Previous</span>
					<span className="font-medium">{previous.name}</span>
				</Link>
			) : (
				<span />
			)}
			{next ? (
				<Link
					className="flex flex-col gap-0.5 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-muted/50 sm:max-w-[45%] sm:text-end"
					href={next.url}>
					<span className="text-muted-foreground text-xs">Next</span>
					<span className="font-medium">{next.name}</span>
				</Link>
			) : null}
		</nav>
	)
}
