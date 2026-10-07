"use client"

import type { ColumnDef } from "data-table"

import { DataTable, DataTableColumnHeader } from "data-table"
import { useMemo } from "react"

import { type DemoPerson, demoPeople } from "./demo-rows"

export function TableUrlSyncExample() {
	const columns = useMemo<ColumnDef<DemoPerson>[]>(
		() => [
			{
				id: "name",
				accessorKey: "name",
				meta: {
					labelKey: "Name",
					filter: { search: true, sort: true },
				},
				header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
			},
			{
				accessorKey: "department",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
			},
		],
		[],
	)

	return (
		<div className="flex flex-col gap-3">
			<p className="text-muted-foreground text-sm">
				Change search, sort, or page size — the query string on this route updates so the state is bookmarkable.
			</p>
			<DataTable
				tableId="example-url-sync"
				columns={columns}
				data={demoPeople}
				displayKey="name"
				selectionKey={(row) => row.id}
				syncUrl
				initialPageSize={5}
			/>
		</div>
	)
}
