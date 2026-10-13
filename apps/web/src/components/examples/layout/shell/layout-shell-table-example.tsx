"use client"

import type { ColumnDef } from "data-table"
import { DataTable, DataTableColumnHeader, commonColumns } from "data-table"
import { ContentPageHeader, DashboardShell } from "layout"
import { useMemo } from "react"

import { demoPeople, type DemoPerson } from "@/components/examples/table/demo-rows"

import { LayoutShellFrame } from "./layout-shell-frame"
import { LayoutShellSidebarSlots } from "./layout-shell-shared"

const slots = LayoutShellSidebarSlots()

export function LayoutShellTableExample() {
	const columns = useMemo<ColumnDef<DemoPerson>[]>(
		() => [
			...commonColumns.selectColumn<DemoPerson>(),
			{
				accessorKey: "name",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
			},
			{
				accessorKey: "email",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
			},
			{
				accessorKey: "status",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
			},
		],
		[],
	)

	return (
		<LayoutShellFrame tall>
			<DashboardShell {...slots}>
				<ContentPageHeader
					description="Mount `DataTable` inside the shell body; keep queries in the host route."
					title="Accounts"
				/>
				<div className="mt-4 min-h-0 flex-1 overflow-hidden rounded-lg border bg-card">
					<DataTable
						columns={columns}
						data={demoPeople}
						displayKey="name"
						selectionKey={(row) => row.id}
						syncUrl={false}
						tableId="example-shell-table"
					/>
				</div>
			</DashboardShell>
		</LayoutShellFrame>
	)
}
