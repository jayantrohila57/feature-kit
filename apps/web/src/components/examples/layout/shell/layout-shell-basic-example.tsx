"use client"

import { DashboardShell, ContentPageHeader } from "layout"

import { Card, CardContent } from "@/packages/ui/components/card"

import { LayoutShellFrame } from "./layout-shell-frame"
import { LayoutShellSidebarSlots } from "./layout-shell-shared"

const slots = LayoutShellSidebarSlots()

export function LayoutShellBasicExample() {
	return (
		<LayoutShellFrame>
			<DashboardShell {...slots}>
				<ContentPageHeader
					description="Sidebar, in-flow header, and route-derived breadcrumbs."
					title="Overview"
				/>
				<Card className="mt-4 border shadow-sm">
					<CardContent className="p-4 text-muted-foreground text-sm">
						Replace this card with your feature screen. The shell owns chrome; your route owns data.
					</CardContent>
				</Card>
			</DashboardShell>
		</LayoutShellFrame>
	)
}
