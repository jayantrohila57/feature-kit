import type { ReactNode } from "react"

import { cn } from "@/packages/ui/lib/utils"

/** Consistent preview chrome height for layout shell demos. */
export function LayoutShellFrame({
	children,
	className,
	tall,
}: {
	children: ReactNode
	className?: string
	tall?: boolean
}) {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-lg border bg-background",
				tall ? "h-[min(720px,78vh)]" : "h-[min(560px,68vh)]",
				className,
			)}>
			{children}
		</div>
	)
}
