"use client"

import type { ColumnDef } from "data-table"
import { DataTable, DataTableColumnHeader } from "data-table"
import { ContentPageHeader, DashboardShell } from "layout"
import { AlertCircle, Inbox, RefreshCw } from "lucide-react"
import { useMemo, useState } from "react"

import { BlockPageRoot } from "@/components/blocks/block-page-root"
import { LayoutShellSidebarSlots } from "@/components/blocks/block-shell-slots"
import { type DemoPerson, demoPeople } from "@/components/examples/table/demo-rows"
import { Alert, AlertDescription, AlertTitle } from "@/packages/ui/components/alert"
import { Button } from "@/packages/ui/components/button"
import { cn } from "@/packages/ui/lib/utils"

const slots = LayoutShellSidebarSlots()

type StateVariant = "empty" | "loading" | "error"

const variants: { id: StateVariant; label: string }[] = [
	{ id: "empty", label: "Empty" },
	{ id: "loading", label: "Loading" },
	{ id: "error", label: "Error" },
]

export function AppStatesBlock() {
	const [variant, setVariant] = useState<StateVariant>("empty")

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
		<BlockPageRoot>
			<DashboardShell {...slots}>
				<ContentPageHeader
					description="Switch between empty, loading, and error presentations."
					title="Projects"
				/>
				<div className="mb-4 flex flex-wrap gap-2">
					{variants.map((item) => (
						<Button
							key={item.id}
							className={cn("h-8", variant === item.id && "bg-background shadow-sm")}
							size="sm"
							type="button"
							variant={variant === item.id ? "secondary" : "outline"}
							onClick={() => setVariant(item.id)}>
							{item.label}
						</Button>
					))}
				</div>
				{variant === "error" ? (
					<Alert variant="destructive">
						<AlertCircle className="size-4" aria-hidden />
						<AlertTitle>Could not load projects</AlertTitle>
						<AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<span>The request timed out. Check your connection and try again.</span>
							<Button size="sm" type="button" variant="outline">
								<RefreshCw className="size-4" aria-hidden />
								Retry
							</Button>
						</AlertDescription>
					</Alert>
				) : null}
				<div className="mt-4 min-h-[320px] overflow-hidden rounded-lg border bg-card">
					<DataTable
						columns={columns}
						data={variant === "empty" ? [] : demoPeople}
						displayKey="name"
						emptyState={{
							title: "No projects yet",
							description: "Create a project or import data to see rows here.",
							icons: [Inbox, Inbox, Inbox],
						}}
						isPending={variant === "loading"}
						selectionKey={(row) => row.id}
						syncUrl={false}
						tableId="block-states-table"
					/>
				</div>
			</DashboardShell>
		</BlockPageRoot>
	)
}
