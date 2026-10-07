import { ArrowRight, FormInput, LayoutGrid, Table2, Upload } from "lucide-react"
import Link from "next/link"
import type { ComponentType } from "react"

import { ExamplesCardVisual } from "@/components/docs/examples-card-visual"
import {
	EXAMPLE_CATEGORIES,
	type ExampleItem,
	type ExampleKit,
} from "@/components/docs/examples-index-data"
import { Badge } from "@/packages/ui/components/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/card"
import { cn } from "@/packages/ui/lib/utils"

const KIT_META: Record<
	ExampleKit,
	{ label: string; icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }> }
> = {
	form: { label: "Form", icon: FormInput },
	table: { label: "Table", icon: Table2 },
	layout: { label: "Layout", icon: LayoutGrid },
	uploader: { label: "Uploader", icon: Upload },
}

function ExampleCard({ item }: { item: ExampleItem }) {
	const kit = KIT_META[item.kit]
	const KitIcon = kit.icon

	return (
		<Link
			href={item.href}
			className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
			<Card
				className={cn(
					"h-full gap-0 py-0 shadow-xs transition-colors",
					"hover:bg-muted/25 hover:ring-foreground/15",
				)}>
				<ExamplesCardVisual visual={item.visual} />
				<CardHeader className="gap-2 px-(--card-spacing) py-(--card-spacing)">
					<div className="flex items-start justify-between gap-2">
						<div className="flex min-w-0 items-center gap-2">
							<KitIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
							<CardTitle className="truncate text-sm">{item.title}</CardTitle>
						</div>
						<Badge variant="outline" className="shrink-0 font-normal">
							{kit.label}
						</Badge>
					</div>
					<CardDescription className="line-clamp-2">{item.description}</CardDescription>
					<span
						className="inline-flex items-center gap-1 text-primary text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
						Open preview
						<ArrowRight className="size-3" aria-hidden />
					</span>
				</CardHeader>
			</Card>
		</Link>
	)
}

export function ExamplesGrid() {
	return (
		<div className="not-prose my-8 space-y-10">
			{EXAMPLE_CATEGORIES.map((category) => (
				<section key={category.id} className="space-y-4">
					<div className="flex flex-wrap items-baseline justify-between gap-2">
						<h2 className="font-medium text-lg tracking-tight text-foreground">{category.title}</h2>
						<Link
							className="text-muted-foreground text-xs underline-offset-4 hover:text-foreground hover:underline"
							href={category.docsHref}>
							Kit docs
						</Link>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{category.items.map((item) => (
							<ExampleCard key={item.href} item={item} />
						))}
					</div>
				</section>
			))}
		</div>
	)
}
