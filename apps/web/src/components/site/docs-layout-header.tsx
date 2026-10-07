"use client"

import { FeatureKitHeader, HeaderCtas } from "@/components/site/feature-kit-header"
import { cn } from "@/packages/ui/lib/utils"
import { buttonVariants } from "fumadocs-ui/components/ui/button"
import { useDocsLayout } from "fumadocs-ui/layouts/docs"
import { SidebarIcon } from "lucide-react"

export function DocsLayoutHeader() {
	const { slots } = useDocsLayout()
	const searchTrigger = slots.searchTrigger === false ? null : slots.searchTrigger
	const SearchFull = searchTrigger?.full
	const SearchSm = searchTrigger?.sm
	const ThemeSwitchSlot = slots.themeSwitch
	const SidebarTrigger = slots.sidebar?.trigger

	return (
		<FeatureKitHeader
			actions={
				<>
					{SearchFull ? (
						<SearchFull hideIfDisabled className="hidden max-w-[200px] bg-muted/60 sm:inline-flex" />
					) : null}
					{SearchSm ? <SearchSm hideIfDisabled className="md:hidden" /> : null}
					{ThemeSwitchSlot ? <ThemeSwitchSlot /> : null}
					<HeaderCtas />
				</>
			}
			className={cn(
				"[grid-area:header] top-(--fd-docs-row-1) layout:[--fd-header-height:--spacing(14)]",
				"data-[transparent=false]:bg-fd-background/80 data-[transparent=false]:backdrop-blur-sm",
			)}
			leading={
				SidebarTrigger ? (
					<SidebarTrigger
						className={cn(
							buttonVariants({
								variant: "ghost",
								size: "icon-sm",
								className: "md:hidden",
							}),
						)}>
						<SidebarIcon />
					</SidebarTrigger>
				) : null
			}
		/>
	)
}
