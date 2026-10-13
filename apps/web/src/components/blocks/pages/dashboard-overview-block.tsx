"use client"

import type { ColumnDef } from "data-table"
import { DataTable, DataTableColumnHeader } from "data-table"
import { ContentPageHeader, DashboardShell } from "layout"
import { ArrowDownRight, ArrowUpRight, DollarSign, Users } from "lucide-react"
import { useMemo } from "react"

import { BlockPageRoot } from "@/components/blocks/block-page-root"
import { LayoutShellSidebarSlots } from "@/components/blocks/block-shell-slots"
import { demoPeople, type DemoPerson } from "@/components/examples/table/demo-rows"
import { Card, CardContent, CardHeader, CardTitle } from "@/packages/ui/components/card"
import { cn } from "@/packages/ui/lib/utils"

const slots = LayoutShellSidebarSlots()

const chartBars = [42, 58, 45, 72, 61, 78, 66, 84, 70, 88, 74, 92]

function StatCard({
	title,
	value,
	delta,
	trend,
	icon: Icon,
}: {
	title: string
	value: string
	delta: string
	trend: "up" | "down"
	icon: typeof Users
}) {
	return (
		<Card className="shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-sm">{title}</CardTitle>
				<Icon className="size-4 text-muted-foreground" aria-hidden />
			</CardHeader>
			<CardContent>
				<div className="font-semibold text-2xl tracking-tight">{value}</div>
				<p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
					{trend === "up" ? (
						<ArrowUpRight className="size-3 text-emerald-600" aria-hidden />
					) : (
						<ArrowDownRight className="size-3 text-rose-600" aria-hidden />
					)}
					<span className={cn(trend === "up" ? "text-emerald-600" : "text-rose-600")}>{delta}</span>
					<span>vs last month</span>
				</p>
			</CardContent>
		</Card>
	)
}

function OverviewChart() {
	const max = Math.max(...chartBars)
	return (
		<Card className="shadow-sm">
			<CardHeader>
				<CardTitle className="text-base">Revenue trend</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex h-40 items-end gap-1.5" role="img" aria-label="Bar chart of monthly revenue">
					{chartBars.map((value, index) => (
						<div
							key={index}
							className="flex-1 rounded-t-sm bg-primary/80 transition-colors hover:bg-primary"
							style={{ height: `${(value / max) * 100}%` }}
						/>
					))}
				</div>
				<div className="mt-2 flex justify-between text-muted-foreground text-xs">
					<span>Jan</span>
					<span>Jun</span>
					<span>Dec</span>
				</div>
			</CardContent>
		</Card>
	)
}

export function DashboardOverviewBlock() {
	const recent = demoPeople.slice(0, 5)
	const columns = useMemo<ColumnDef<DemoPerson>[]>(
		() => [
			{
				accessorKey: "name",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Account" />,
			},
			{
				accessorKey: "status",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
			},
			{
				accessorKey: "department",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
			},
		],
		[],
	)

	return (
		<BlockPageRoot>
			<DashboardShell {...slots}>
				<ContentPageHeader
					description="KPI cards, trend chart, and recent accounts in one screen."
					title="Overview"
				/>
				<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<StatCard delta="+12.4%" icon={Users} title="Active users" trend="up" value="2,847" />
					<StatCard delta="+4.1%" icon={DollarSign} title="MRR" trend="up" value="$48.2k" />
					<StatCard delta="-2.3%" icon={Users} title="Churn" trend="down" value="1.8%" />
					<StatCard delta="+8.0%" icon={DollarSign} title="Pipeline" trend="up" value="$126k" />
				</div>
				<div className="mt-4 grid gap-4 lg:grid-cols-5">
					<div className="lg:col-span-2">
						<OverviewChart />
					</div>
					<div className="min-h-0 lg:col-span-3">
						<Card className="flex h-full min-h-[280px] flex-col shadow-sm">
							<CardHeader className="pb-2">
								<CardTitle className="text-base">Recent accounts</CardTitle>
							</CardHeader>
							<CardContent className="min-h-0 flex-1 overflow-hidden p-0">
								<DataTable
									columns={columns}
									data={recent}
									displayKey="name"
									enableRowSelection={false}
									selectionKey={(row) => row.id}
									syncUrl={false}
									tableId="block-dashboard-recent"
								/>
							</CardContent>
						</Card>
					</div>
				</div>
			</DashboardShell>
		</BlockPageRoot>
	)
}
