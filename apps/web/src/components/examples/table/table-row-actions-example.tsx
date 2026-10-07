"use client"

import type { ColumnDef } from "data-table"

import {
	DataTable,
	DataTableColumnHeader,
	type RowActionComponentProps,
	RowActionDelete,
	RowActionView,
	commonColumns,
} from "data-table"
import { useMemo } from "react"
import { toast } from "sonner"

import { type DemoPerson, demoPeople } from "./demo-rows"

function DemoRowViewAction(props: RowActionComponentProps<DemoPerson>) {
	return (
		<RowActionView<DemoPerson>
			{...props}
			href={`/docs/examples/table/row-actions?highlight=${props.data.id}`}
			label="View"
		/>
	)
}

function DemoRowDeleteAction(props: RowActionComponentProps<DemoPerson>) {
	return (
		<RowActionDelete<DemoPerson>
			{...props}
			onDelete={async (person) => {
				await new Promise((resolve) => setTimeout(resolve, 300))
				toast.success("Removed", { description: person.name })
			}}
		/>
	)
}

export function TableRowActionsExample() {
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
			...commonColumns.actionsColumn<DemoPerson>({
				actions: [DemoRowViewAction, DemoRowDeleteAction],
			}),
		],
		[],
	)

	return (
		<DataTable
			tableId="example-row-actions"
			columns={columns}
			data={demoPeople}
			displayKey="name"
			selectionKey={(row) => row.id}
			syncUrl={false}
			enableRowSelection={false}
		/>
	)
}
