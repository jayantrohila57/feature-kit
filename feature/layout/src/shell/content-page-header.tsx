import type { ReactNode } from "react"

import { cn } from "@/packages/ui/lib/utils"

export type ContentPageHeaderProps = {
	title: string
	description?: string
	actions?: ReactNode
	className?: string
}

export function ContentPageHeader({ title, description, actions, className }: ContentPageHeaderProps) {
	return (
		<div className={cn("flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-start sm:justify-between", className)}>
			<div className="min-w-0 space-y-1">
				<h2 className="font-semibold text-xl tracking-tight">{title}</h2>
				{description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
			</div>
			{actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
		</div>
	)
}
