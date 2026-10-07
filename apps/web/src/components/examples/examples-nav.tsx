import Link from "next/link"

import { formExamples, layoutExamples, tableExamples, uploaderExamples } from "@/lib/examples-catalog"

type ExamplesNavProps = {
	activeHref?: string | undefined
}

function NavGroup({
	title,
	basePath,
	items,
	activeHref,
}: {
	title: string
	basePath: string
	items: { slug: string; title: string }[]
	activeHref?: string | undefined
}) {
	return (
		<div className="flex flex-col gap-2">
			<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">{title}</p>
			<ul className="flex flex-col gap-1">
				{items.map((item) => {
					const href = `${basePath}/${item.slug}`
					const active = activeHref === href
					return (
						<li key={item.slug}>
							<Link
								className={
									active
										? "block rounded-md bg-muted px-3 py-2 font-medium text-foreground text-sm"
										: "block rounded-md px-3 py-2 text-muted-foreground text-sm hover:bg-muted/60 hover:text-foreground"
								}
								href={href}>
								{item.title.replace(/^FormKit — |^FieldKit — |^DataTable — |^Layout — |^Uploader — /, "")}
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export function ExamplesNav({ activeHref }: ExamplesNavProps) {
	return (
		<nav className="flex flex-col gap-8">
			<NavGroup
				title="Form"
				basePath="/examples/form"
				items={formExamples}
				activeHref={activeHref}
			/>
			<NavGroup
				title="Table"
				basePath="/examples/table"
				items={tableExamples}
				activeHref={activeHref}
			/>
			<NavGroup
				title="Layout"
				basePath="/examples/layout"
				items={layoutExamples}
				activeHref={activeHref}
			/>
			<NavGroup
				title="Uploader"
				basePath="/examples/uploader"
				items={uploaderExamples}
				activeHref={activeHref}
			/>
		</nav>
	)
}
