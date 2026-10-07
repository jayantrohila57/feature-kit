"use client"

import type { ColumnDef } from "data-table"

import { BulkActionBar, BulkClearSelectionAction, DataTable, DataTableColumnHeader, commonColumns } from "data-table"
import { useMemo } from "react"
import { toast } from "sonner"

import { Button } from "@/packages/ui/components/button"

import { type DemoPerson, demoPeople } from "./demo-rows"

export function TableBulkActionsExample() {
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
		],
		[],
	)

	return (
		<DataTable
			tableId="example-bulk"
			columns={columns}
			data={demoPeople}
			displayKey="name"
			selectionKey={(row) => row.id}
			syncUrl={false}
			bulkActions={
				<BulkActionBar>
					<Button
						size="sm"
						variant="secondary"
						type="button"
						onClick={() => toast.message("Export started", { description: "Selected rows only." })}>
						Export
					</Button>
					<BulkClearSelectionAction />
				</BulkActionBar>
			}
		/>
	)
}
