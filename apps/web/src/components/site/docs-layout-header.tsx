"use client"

import { DocsHeaderActions } from "@/components/site/docs-header-actions"
import { FeatureKitHeader } from "@/components/site/feature-kit-header"
import { cn } from "@/packages/ui/lib/utils"
import { buttonVariants } from "fumadocs-ui/components/ui/button"
import { useDocsLayout } from "fumadocs-ui/layouts/docs"
import { SidebarIcon } from "lucide-react"

export function DocsLayoutHeader() {
	const { slots } = useDocsLayout()
	const SidebarTrigger = slots.sidebar?.trigger

	return (
		<FeatureKitHeader
			actions={<DocsHeaderActions />}
			className="[grid-area:header] top-(--fd-docs-row-1) layout:[--fd-header-height:--spacing(14)]"
			layout="docs"
			navMode="docs"
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
