import Link from "next/link"
import type { ReactNode } from "react"

type PlaygroundLinkProps = {
	href: string
	children?: ReactNode
}

export function PlaygroundLink({ href, children }: PlaygroundLinkProps) {
	return (
		<p className="not-prose my-6 text-muted-foreground text-sm">
			Live preview with sample data in the docs.{" "}
			<Link className="font-medium text-foreground underline-offset-4 hover:underline" href={href}>
				{children ?? "Open preview"}
			</Link>
		</p>
	)
}
