"use client"

import { Breadcrumbs } from "layout"

export function BreadcrumbsDemo() {
	return (
		<div className="flex w-full flex-col gap-3">
			<p className="text-muted-foreground text-sm leading-6">
				Breadcrumbs derive from the current path. Open another docs example to see compression, intermediate
				links, and copy-URL.
			</p>
			<div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
				<Breadcrumbs />
			</div>
		</div>
	)
}
