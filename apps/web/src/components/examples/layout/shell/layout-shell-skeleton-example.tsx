"use client"

import { DashboardShell, DashboardSidebarNavSkeleton } from "layout"

import { Skeleton } from "@/packages/ui/components/skeleton"

import { LayoutShellFrame } from "./layout-shell-frame"
import { LayoutShellBrand, LayoutShellHeaderActions } from "./layout-shell-shared"

export function LayoutShellSkeletonExample() {
	return (
		<LayoutShellFrame>
			<DashboardShell
				headerActions={<LayoutShellHeaderActions />}
				sidebarContent={<DashboardSidebarNavSkeleton groups={2} />}
				sidebarHeader={<LayoutShellBrand />}>
				<Skeleton className="h-8 w-48" />
				<Skeleton className="mt-4 h-32 w-full" />
			</DashboardShell>
		</LayoutShellFrame>
	)
}
