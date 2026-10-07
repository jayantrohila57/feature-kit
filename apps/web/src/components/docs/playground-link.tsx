import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/packages/ui/lib/utils"

type PlaygroundLinkProps = {
	href: string
	children?: ReactNode
	className?: string
}

export function PlaygroundLink({ href, children, className }: PlaygroundLinkProps) {
	return (
		<div className={cn("not-prose my-6 text-muted-foreground text-sm", className)}>
			Live preview with sample data in the docs.{" "}
			<Link className="font-medium text-foreground underline-offset-4 hover:underline" href={href}>
				{children ?? "Open preview"}
			</Link>
		</div>
	)
}
