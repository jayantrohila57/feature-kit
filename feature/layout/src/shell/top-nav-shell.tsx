"use client"

import type { CSSProperties, ReactNode } from "react"

import Shell from "@/packages/ui/components/shell"
import { SHELL_HEADER_HEIGHT } from "./shell-constants"
import { DashboardHeader } from "./dashboard-header"

export type TopNavShellProps = {
	children: ReactNode
	headerActions?: ReactNode
	topNavigation?: ReactNode
	className?: string
	showBreadcrumbs?: boolean
}

/** Header + main content without a sidebar — use for marketing-style app shells or narrow tools. */
export function TopNavShell({
	children,
	headerActions,
	topNavigation,
	className,
	showBreadcrumbs = true,
}: TopNavShellProps) {
	return (
		<Shell.Frame
			{...(className ? { className } : {})}
			style={{ "--shell-header-height": SHELL_HEADER_HEIGHT } as CSSProperties}>
			<DashboardHeader
				actions={headerActions}
				showBreadcrumbs={showBreadcrumbs}
				showSidebarTrigger={false}
			/>
			{topNavigation ? (
				<div className="border-b bg-background px-4 py-2 md:px-6">{topNavigation}</div>
			) : null}
			<Shell.Main className="min-h-0 flex-1 overflow-hidden" variant="dashboard">
				<Shell.Section className="p-4 md:p-6" variant="dashboard">
					{children}
				</Shell.Section>
			</Shell.Main>
		</Shell.Frame>
	)
}
