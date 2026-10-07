import type { ReactNode } from "react"

import { cn } from "@/packages/ui/lib/utils"

export type PropDoc = {
	name: string
	type: string
	default?: string
	description: ReactNode
}

type PropsTableProps = {
	title?: string
	props: PropDoc[]
	className?: string
}

export function PropsTable({ title = "Props", props, className }: PropsTableProps) {
	return (
		<div className={cn("not-prose my-6 overflow-hidden rounded-lg border", className)}>
			<div className="border-b bg-muted/40 px-4 py-2 font-medium text-sm">{title}</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b text-left text-muted-foreground">
							<th className="px-4 py-2 font-medium">Prop</th>
							<th className="px-4 py-2 font-medium">Type</th>
							<th className="hidden px-4 py-2 font-medium sm:table-cell">Default</th>
							<th className="px-4 py-2 font-medium">Description</th>
						</tr>
					</thead>
					<tbody>
						{props.map((row) => (
							<tr key={row.name} className="border-b last:border-0 align-top">
								<td className="px-4 py-2 font-mono text-xs">{row.name}</td>
								<td className="px-4 py-2 font-mono text-muted-foreground text-xs">{row.type}</td>
								<td className="hidden px-4 py-2 font-mono text-muted-foreground text-xs sm:table-cell">
									{row.default ?? "—"}
								</td>
								<td className="px-4 py-2 text-muted-foreground">{row.description}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
