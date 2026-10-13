import type { ReactNode } from "react"

import { cn } from "@/packages/ui/lib/utils"

/** Full-viewport root for block iframe previews. */
export function BlockPageRoot({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div className={cn("flex h-dvh min-h-0 flex-col overflow-hidden bg-background text-foreground", className)}>
			{children}
		</div>
	)
}
