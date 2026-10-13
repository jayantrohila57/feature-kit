"use client"

import { DashboardShell, ContentPageHeader } from "layout"
import Link from "next/link"

import { LayoutShellFrame } from "./layout-shell-frame"
import { LayoutShellHeaderActions } from "./layout-shell-shared"

const topLinks = [
	{ href: "/docs", label: "Docs" },
	{ href: "/docs/examples", label: "Examples" },
	{ href: "/docs/layout", label: "Layout" },
]

export function LayoutShellTopNavExample() {
	return (
		<LayoutShellFrame>
			<DashboardShell
				headerActions={<LayoutShellHeaderActions />}
				showSidebar={false}
				topNavigation={
					<nav aria-label="Primary" className="flex flex-wrap gap-1">
						{topLinks.map((link) => (
							<Link
								key={link.href}
								className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								href={link.href}>
								{link.label}
							</Link>
						))}
					</nav>
				}>
				<ContentPageHeader
					description="`showSidebar={false}` renders `TopNavShell` with optional `topNavigation` under the header."
					title="Top navigation"
				/>
			</DashboardShell>
		</LayoutShellFrame>
	)
}
