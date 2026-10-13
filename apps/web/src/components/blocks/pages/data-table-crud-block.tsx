"use client"

import type { ColumnDef } from "data-table"
import {
	DataTable,
	DataTableColumnHeader,
	RowActionDelete,
	RowActionEdit,
	type RowActionComponentProps,
	commonColumns,
} from "data-table"
import { FormKit } from "form"
import { ContentPageHeader, DashboardShell, FormSection } from "layout"
import { Plus } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { BlockPageRoot } from "@/components/blocks/block-page-root"
import { LayoutShellSidebarSlots } from "@/components/blocks/block-shell-slots"
import { demoPeople, statusFilterOptions, type DemoPerson } from "@/components/examples/table/demo-rows"
import { Button } from "@/packages/ui/components/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/packages/ui/components/sheet"

const slots = LayoutShellSidebarSlots()

const personSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Enter a valid email"),
	status: z.enum(["active", "invited", "disabled"]),
})

const roleOptions = statusFilterOptions.map((o) => ({ value: o.value, label: o.label }))

function CrudDeleteAction(props: RowActionComponentProps<DemoPerson>) {
	return (
		<RowActionDelete<DemoPerson>
			{...props}
			onDelete={async (person) => {
				await new Promise((r) => setTimeout(r, 250))
				toast.success("Removed", { description: person.name })
			}}
		/>
	)
}

export function DataTableCrudBlock() {
	const [sheetOpen, setSheetOpen] = useState(false)
	const [editing, setEditing] = useState<DemoPerson | null>(null)

	const openCreate = () => {
		setEditing(null)
		setSheetOpen(true)
	}

	const openEdit = useCallback((row: DemoPerson) => {
		setEditing(row)
		setSheetOpen(true)
	}, [])

	const columns = useMemo<ColumnDef<DemoPerson>[]>(
		() => {
			function CrudEditAction(props: RowActionComponentProps<DemoPerson>) {
				return <RowActionEdit<DemoPerson> {...props} label="Edit" onEdit={openEdit} />
			}

			return [
			...commonColumns.selectColumn<DemoPerson>(),
			{
				id: "name",
				accessorKey: "name",
				meta: { labelKey: "Name", filter: { search: true, sort: true } },
				header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
			},
			{
				id: "email",
				accessorKey: "email",
				meta: { labelKey: "Email", filter: { search: true } },
				header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
			},
			{
				id: "status",
				accessorKey: "status",
				meta: {
					labelKey: "Status",
					filter: { options: true, staticOptions: statusFilterOptions },
				},
				header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
			},
			...commonColumns.actionsColumn<DemoPerson>({
				actions: [CrudEditAction, CrudDeleteAction],
			}),
		]
		},
		[openEdit],
	)

	return (
		<BlockPageRoot>
			<DashboardShell {...slots}>
				<ContentPageHeader
					actions={
						<Button size="sm" onClick={openCreate}>
							<Plus className="size-4" aria-hidden />
							New account
						</Button>
					}
					description="Filters, row actions, and a sheet form for create/edit."
					title="Accounts"
				/>
				<div className="mt-4 min-h-0 flex-1 overflow-hidden rounded-lg border bg-card">
					<DataTable
						columns={columns}
						data={demoPeople}
						displayKey="name"
						pinnedFilterKeys={["status"]}
						selectionKey={(row) => row.id}
						syncUrl={false}
						tableId="block-crud-table"
					/>
				</div>
				<Sheet
					onOpenChange={(open) => {
						setSheetOpen(open)
						if (!open) setEditing(null)
					}}
					open={sheetOpen}>
					<SheetContent className="overflow-y-auto sm:max-w-md">
						<SheetHeader>
							<SheetTitle>{editing ? "Edit account" : "New account"}</SheetTitle>
							<SheetDescription>
								{editing ? "Update account fields and save." : "Add a row to the demo table (no API)."}
							</SheetDescription>
						</SheetHeader>
						<div className="mt-6">
							<FormKit
								defaultValues={
									editing
										? {
												name: editing.name,
												email: editing.email,
												status: editing.status,
											}
										: { name: "", email: "", status: "active" as const }
								}
								resetOnSuccess
								schema={personSchema}
								onSubmit={async (values) => {
									await new Promise((r) => setTimeout(r, 400))
									toast.success(editing ? "Account updated" : "Account created", {
										description: values.name,
									})
									setSheetOpen(false)
									setEditing(null)
								}}>
								<FormSection title="Account">
									<FormKit.Field label="Name" name="name" required type="text" />
									<FormKit.Field label="Email" name="email" required type="text" />
									<FormKit.Field label="Status" name="status" options={roleOptions} type="select" />
								</FormSection>
								<FormKit.Actions>
									<FormKit.Reset label="Reset" />
									<FormKit.Submit label="Save" pendingLabel="Saving…" />
								</FormKit.Actions>
							</FormKit>
						</div>
					</SheetContent>
				</Sheet>
			</DashboardShell>
		</BlockPageRoot>
	)
}
