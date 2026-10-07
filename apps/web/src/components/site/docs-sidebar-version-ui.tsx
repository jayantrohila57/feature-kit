import { ChevronDown, Tag } from "lucide-react"
import type { ComponentProps, ElementType } from "react"

import { siteVersion } from "@/lib/site-version"
import { cn } from "@/packages/ui/lib/utils"

const versionTriggerClassName =
	"inline-flex h-7 min-w-0 items-center gap-1.5 rounded-md border border-border bg-secondary/80 px-2 text-xs font-medium text-muted-foreground shadow-xs tabular-nums transition-colors hover:bg-secondary focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-70 [&_svg:not([class*='size-'])]:size-3.5"

type DocsSidebarVersionTriggerProps<T extends ElementType = "button"> = {
	as?: T
} & ComponentProps<T>

export function DocsSidebarVersionTrigger<T extends ElementType = "button">({
	as,
	className,
	...props
}: DocsSidebarVersionTriggerProps<T>) {
	const Component = (as ?? "button") as ElementType
	const isButton = Component === "button"

	return (
		<Component
			{...(isButton ? { type: "button" as const, disabled: true } : {})}
			aria-haspopup="listbox"
			aria-label={`Documentation version ${siteVersion}`}
			className={cn(versionTriggerClassName, className)}
			{...props}>
			<Tag aria-hidden className="size-3 shrink-0 opacity-80" />
			<span className="truncate">v{siteVersion}</span>
			<ChevronDown aria-hidden className="ms-0.5 size-3 shrink-0 opacity-60" />
		</Component>
	)
}
