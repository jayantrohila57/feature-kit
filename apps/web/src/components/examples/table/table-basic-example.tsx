"use client"

import type { ColumnDef } from "data-table"

import { DataTable, DataTableColumnHeader, commonColumns } from "data-table"
import { useMemo } from "react"

import { type DemoPerson, demoPeople } from "./demo-rows"

export function TableBasicExample() {
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
		<DataTable
			tableId="example-basic"
			columns={columns}
			data={demoPeople}
			displayKey="name"
			selectionKey={(row) => row.id}
			syncUrl={false}
		/>
	)
}
