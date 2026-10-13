"use client"

import { DashboardShell, ContentPageHeader } from "layout"

import { LayoutShellFrame } from "./layout-shell-frame"
import { LayoutShellSidebarSlots } from "./layout-shell-shared"

const slots = LayoutShellSidebarSlots()

export function LayoutShellMobileExample() {
	return (
		<LayoutShellFrame>
			<DashboardShell {...slots}>
				<ContentPageHeader
					description="Below `md`, the sidebar moves into a sheet. Use the header trigger to open navigation."
					title="Mobile sheet nav"
				/>
			</DashboardShell>
		</LayoutShellFrame>
	)
}
