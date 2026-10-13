"use client"

import type { ReactNode } from "react"

import Shell from "@/packages/ui/components/shell"
import { Separator } from "@/packages/ui/components/separator"
import { SidebarTrigger } from "@/packages/ui/components/sidebar"
import { cn } from "@/packages/ui/lib/utils"

import { Breadcrumbs } from "../breadcrumb"
import { SHELL_HEADER_HEIGHT_CLASS } from "./shell-constants"

export function DashboardHeader({
	actions,
	className,
	showBreadcrumbs = true,
}: {
	actions?: ReactNode
	className?: string
	showBreadcrumbs?: boolean
}) {
	return (
		<Shell.Header className={cn(SHELL_HEADER_HEIGHT_CLASS, "flex items-center gap-2 px-4", className)} variant="app">
			<SidebarTrigger className="-ms-1" />
			<Separator className="mr-2 h-4" orientation="vertical" />
			{showBreadcrumbs ? <Breadcrumbs className="min-w-0 flex-1" /> : <div className="flex-1" />}
			{actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
		</Shell.Header>
	)
}
