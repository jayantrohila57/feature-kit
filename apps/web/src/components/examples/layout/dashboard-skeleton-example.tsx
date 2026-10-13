"use client"

import { DashboardShell, DashboardSidebarBrand, DashboardSidebarNavSkeleton } from "layout"
import { LayoutGrid } from "lucide-react"
import { Skeleton } from "@/packages/ui/components/skeleton"

export function DashboardSkeletonExample() {
	return (
		<div className="h-[min(420px,55vh)] overflow-hidden rounded-lg border">
			<DashboardShell
				sidebarContent={<DashboardSidebarNavSkeleton groups={2} />}
				sidebarHeader={
					<DashboardSidebarBrand
						href="/docs"
						logo={
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
								<LayoutGrid className="size-4 text-muted-foreground" />
							</div>
						}
						subtitle="Loading…"
						title="Feature Kit"
					/>
				}>
				<div className="grid gap-4">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
			</DashboardShell>
		</div>
	)
}
