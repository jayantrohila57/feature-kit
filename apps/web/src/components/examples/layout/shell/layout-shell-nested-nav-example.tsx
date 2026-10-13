"use client"

import { DashboardShell, ContentPageHeader, DashboardSidebarNav } from "layout"
import { FolderTree, LayoutGrid, LineChart, Settings2 } from "lucide-react"

import { LayoutShellFrame } from "./layout-shell-frame"
import { LayoutShellBrand, LayoutShellHeaderActions, LayoutShellSidebarFooter } from "./layout-shell-shared"

const nestedGroups = [
	{
		label: "Product",
		icon: LayoutGrid,
		defaultOpen: true,
		items: [
			{ title: "Analytics", href: "/docs/examples/layout/shell-nested-nav", icon: LineChart },
			{ title: "Projects", href: "/docs/examples/layout/shell-nested-nav#projects", icon: FolderTree },
		],
	},
	{
		label: "Admin",
		icon: Settings2,
		items: [{ title: "Team", href: "/docs/examples/layout/shell-settings", icon: Settings2 }],
	},
]

export function LayoutShellNestedNavExample() {
	return (
		<LayoutShellFrame>
			<DashboardShell
				headerActions={<LayoutShellHeaderActions />}
				sidebarContent={<DashboardSidebarNav groups={nestedGroups} />}
				sidebarFooter={<LayoutShellSidebarFooter />}
				sidebarHeader={<LayoutShellBrand />}>
				<ContentPageHeader
					description="`DashboardSidebarNav` marks items active from the current pathname (including nested segments)."
					title="Nested navigation"
				/>
				<div className="mt-4 rounded-lg border bg-muted/30 p-4 text-sm" id="projects">
					Active route highlighting follows `usePathname()`.
				</div>
			</DashboardShell>
		</LayoutShellFrame>
	)
}
