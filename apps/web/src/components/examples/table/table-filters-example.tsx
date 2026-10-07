"use client"

import type { ColumnDef } from "data-table"

import { DataTable, DataTableColumnHeader, commonColumns } from "data-table"
import { useMemo } from "react"

import { type DemoPerson, demoPeople, statusFilterOptions } from "./demo-rows"

export function TableFiltersExample() {
	const columns = useMemo<ColumnDef<DemoPerson>[]>(
		() => [
			...commonColumns.selectColumn<DemoPerson>(),
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
				id: "email",
				accessorKey: "email",
				meta: {
					labelKey: "Email",
					filter: { search: true },
				},
				header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
			},
			{
				id: "status",
				accessorKey: "status",
				meta: {
					labelKey: "Status",
					filter: { options: true, sort: true, staticOptions: statusFilterOptions },
				},
				header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
			},
			{
				id: "department",
				accessorKey: "department",
				meta: {
					labelKey: "Department",
					filter: { sort: true },
				},
				header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
			},
		],
		[],
	)

	return (
		<DataTable
			tableId="example-filters"
			columns={columns}
			data={demoPeople}
			displayKey="name"
			selectionKey={(row) => row.id}
			syncUrl={false}
			pinnedFilterKeys={["status"]}
		/>
	)
}
