"use client"

import type { ComponentProps } from "react"

import { DocsSidebarVersionTrigger } from "@/components/site/docs-sidebar-version-ui"
import { Separator } from "@/packages/ui/components/separator"
import { cn } from "@/packages/ui/lib/utils"

/** Sidebar nav title slot — avoids Fumadocs home link wrapper on `nav.title`. */
export function DocsSidebarNavTitle({ className }: ComponentProps<"a">) {
	return (
		<div
			className={cn(
				className,
				"flex min-w-0 flex-1 items-center gap-2 me-0",
			)}>
			<DocsSidebarVersionTrigger
				className={cn(
					"min-w-0 flex-1 w-full justify-between !text-xs !font-medium",
				)}
			/>
			<Separator
				className="h-4 shrink-0 data-vertical:self-center"
				orientation="vertical"
			/>
		</div>
	)
}
