"use client"

import type { ColumnDef } from "data-table"

import { DataTable, DataTableColumnHeader } from "data-table"
import { Inbox } from "lucide-react"
import { useMemo } from "react"

import { type DemoPerson } from "./demo-rows"

export function TableEmptyExample() {
	const columns = useMemo<ColumnDef<DemoPerson>[]>(
		() => [
			{
				accessorKey: "name",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
			},
			{
				accessorKey: "email",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
			},
		],
		[],
	)

	return (
		<DataTable
			tableId="example-empty"
			columns={columns}
			data={[]}
			displayKey="name"
			selectionKey={(row) => row.id}
			syncUrl={false}
			emptyState={{
				title: "No people yet",
				description: "Add a person or adjust your filters to see rows here.",
				icons: [Inbox, Inbox, Inbox],
			}}
		/>
	)
}
