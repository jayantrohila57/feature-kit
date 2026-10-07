"use client"

import { FieldKit } from "form"
import { useMemo, useState } from "react"

import { statusFilterOptions } from "@/components/examples/table/demo-rows"

import { z } from "zod"

const filterSchema = z.object({
	q: z.string(),
	status: z.array(z.string()),
})

type FilterValues = z.input<typeof filterSchema>

const defaultFilters: FilterValues = {
	q: "",
	status: [],
}

export function FieldKitFiltersExample() {
	const [filters, setFilters] = useState<FilterValues>(defaultFilters)

	const statusOptions = useMemo(() => statusFilterOptions, [])

	return (
		<div className="flex flex-col gap-4">
			<FieldKit schema={filterSchema} mode="controlled" values={filters} onValuesChange={setFilters}>
				<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
					<FieldKit.Field type="text" name="q" label="Search" placeholder="Name or email…" size="sm" />
					<FieldKit.Field
						type="multi-select"
						name="status"
						label="Status"
						options={statusOptions}
						showSelectedCount
						size="sm"
					/>
				</div>
			</FieldKit>
			<pre className="overflow-auto rounded-md border border-border bg-muted/40 p-4 text-xs">
				{JSON.stringify(filters, null, 2)}
			</pre>
		</div>
	)
}
