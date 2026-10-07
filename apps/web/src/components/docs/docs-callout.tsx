import type { ReactNode } from "react"

import { cn } from "@/packages/ui/lib/utils"

type DocsCalloutProps = {
	title?: string
	children: ReactNode
	variant?: "note" | "warning"
}

export function DocsCallout({ title, children, variant = "note" }: DocsCalloutProps) {
	return (
		<div
			className={cn(
				"not-prose my-6 rounded-lg border px-4 py-3 text-sm",
				variant === "warning" ? "border-amber-500/40 bg-amber-500/10" : "border-border bg-muted/30",
			)}>
			{title ? <p className="mb-1 font-medium">{title}</p> : null}
			<div className="text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:text-foreground">
				{children}
			</div>
		</div>
	)
}
