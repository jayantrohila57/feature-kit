"use client"

import type { ColumnDef } from "data-table"

import { DataTable, DataTableColumnHeader } from "data-table"
import { useMemo } from "react"

import { type DemoPerson, demoPeople } from "./demo-rows"

export function TableLoadingExample() {
	const columns = useMemo<ColumnDef<DemoPerson>[]>(
		() => [
			{
				accessorKey: "name",
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
		<DataTable
			tableId="example-loading"
			columns={columns}
			data={demoPeople}
			displayKey="name"
			selectionKey={(row) => row.id}
			syncUrl={false}
			isPending
		/>
	)
}
