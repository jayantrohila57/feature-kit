"use client"

import type { ColumnDef } from "data-table"

import { DataTable, DataTableColumnHeader, commonColumns } from "data-table"
import { useMemo } from "react"

type Person = {
	id: string
	name: string
	email: string
	status: "active" | "invited"
}

const rows: Person[] = [
	{ id: "1", name: "Ada Lovelace", email: "ada@example.com", status: "active" },
	{ id: "2", name: "Grace Hopper", email: "grace@example.com", status: "active" },
	{ id: "3", name: "Katherine Johnson", email: "katherine@example.com", status: "invited" },
]

export function TableDemo() {
	const columns = useMemo<ColumnDef<Person>[]>(
		() => [
			...commonColumns.selectColumn<Person>(),
			{
				accessorKey: "name",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
				meta: { titleKey: "Name" },
			},
			{
				accessorKey: "email",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
				meta: { titleKey: "Email" },
			},
			{
				accessorKey: "status",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
				meta: { titleKey: "Status" },
			},
		],
		[],
	)

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="font-semibold text-2xl tracking-tight">DataTable</h1>
				<p className="mt-1 text-muted-foreground text-sm">Toolbar, sorting, and selection without app-specific data.</p>
			</div>
			<DataTable
				tableId="demo-people"
				columns={columns}
				data={rows}
				displayKey="name"
				selectionKey={(row) => row.id}
				syncUrl={false}
			/>
		</div>
	)
}
