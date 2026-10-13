"use client"

import type { CSSProperties, ReactNode } from "react"

import Shell from "@/packages/ui/components/shell"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
} from "@/packages/ui/components/sidebar"
import { cn } from "@/packages/ui/lib/utils"

import { SHELL_HEADER_HEIGHT } from "./shell-constants"
import { DashboardHeader } from "./dashboard-header"
import { TopNavShell } from "./top-nav-shell"

export type DashboardShellProps = {
	sidebarHeader?: ReactNode
	sidebarContent?: ReactNode
	sidebarFooter?: ReactNode
	headerActions?: ReactNode
	children: ReactNode
	className?: string
	defaultSidebarOpen?: boolean
	showBreadcrumbs?: boolean
	/** When false, renders `TopNavShell` (header + main only). */
	showSidebar?: boolean
	sidebarCollapsible?: "offcanvas" | "icon" | "none"
	topNavigation?: ReactNode
}

export function DashboardShell({
	sidebarHeader,
	sidebarContent,
	sidebarFooter,
	headerActions,
	children,
	className,
	defaultSidebarOpen = true,
	showBreadcrumbs = true,
	showSidebar = true,
	sidebarCollapsible = "icon",
	topNavigation,
}: DashboardShellProps) {
	if (!showSidebar) {
		return (
			<TopNavShell
				{...(className ? { className } : {})}
				headerActions={headerActions}
				showBreadcrumbs={showBreadcrumbs}
				{...(topNavigation ? { topNavigation } : {})}>
				{children}
			</TopNavShell>
		)
	}

	return (
		<SidebarProvider defaultOpen={defaultSidebarOpen}>
			<Shell.Frame
				{...(className ? { className } : {})}
				style={{ "--shell-header-height": SHELL_HEADER_HEIGHT } as CSSProperties}>
				<DashboardHeader actions={headerActions} showBreadcrumbs={showBreadcrumbs} />
				<div className="flex min-h-0 flex-1 overflow-hidden">
					<Sidebar collapsible={sidebarCollapsible} variant="inset">
						{sidebarHeader ? <SidebarHeader>{sidebarHeader}</SidebarHeader> : null}
						<SidebarSeparator />
						<SidebarContent>{sidebarContent}</SidebarContent>
						{sidebarFooter ? (
							<>
								<SidebarSeparator />
								<SidebarFooter>{sidebarFooter}</SidebarFooter>
							</>
						) : null}
						<SidebarRail />
					</Sidebar>
					<SidebarInset>
						<Shell.Main className={cn("min-h-0 flex-1")} variant="dashboard">
							<Shell.Section className="p-4 md:p-6" variant="dashboard">
								{children}
							</Shell.Section>
						</Shell.Main>
					</SidebarInset>
				</div>
			</Shell.Frame>
		</SidebarProvider>
	)
}
