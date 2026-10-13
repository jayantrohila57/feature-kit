"use client"

import { DashboardShell, ContentPageHeader } from "layout"

import { LayoutShellFrame } from "./layout-shell-frame"
import { LayoutShellSidebarSlots } from "./layout-shell-shared"

const slots = LayoutShellSidebarSlots()

export function LayoutShellIconSidebarExample() {
	return (
		<LayoutShellFrame>
			<DashboardShell {...slots} defaultSidebarOpen={false}>
				<ContentPageHeader
					description="Start collapsed (`defaultSidebarOpen={false}`) and expand with the trigger or ⌘/Ctrl+B."
					title="Icon rail"
				/>
			</DashboardShell>
		</LayoutShellFrame>
	)
}
