"use client"

import { FullSearchTrigger } from "fumadocs-ui/layouts/shared/slots/search-trigger"
import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch"

export function DocsSidebarChrome() {
	return (
		<div className="flex flex-col gap-3 border-t p-4">
			<FullSearchTrigger className="w-full" hideIfDisabled />
			<div className="flex items-center justify-between gap-2">
				<span className="text-muted-foreground text-xs">Theme</span>
				<ThemeSwitch />
			</div>
		</div>
	)
}
