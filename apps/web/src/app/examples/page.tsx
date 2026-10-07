import Link from "next/link"

import { formExamples, tableExamples, uploaderExamples } from "@/lib/examples-catalog"

function ExampleList({
	title,
	basePath,
	items,
}: {
	title: string
	basePath: string
	items: { slug: string; title: string; description: string }[]
}) {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="font-semibold text-lg">{title}</h2>
			<ul className="flex flex-col gap-3">
				{items.map((item) => (
					<li key={item.slug}>
						<Link
							className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
							href={`${basePath}/${item.slug}`}>
							<p className="font-medium text-sm">{item.title}</p>
							<p className="mt-1 text-muted-foreground text-sm leading-6">{item.description}</p>
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}

export default function ExamplesIndexPage() {
	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-2">
				<h1 className="font-semibold text-3xl tracking-tight">Examples</h1>
				<p className="max-w-2xl text-muted-foreground text-sm leading-6">
					Runnable samples for FormKit, FieldKit, DataTable, and Uploader. Use these as copy-paste starting points
					in your app.
				</p>
			</div>
			<ExampleList title="Form" basePath="/examples/form" items={formExamples} />
			<ExampleList title="Table" basePath="/examples/table" items={tableExamples} />
			<ExampleList title="Uploader" basePath="/examples/uploader" items={uploaderExamples} />
		</div>
	)
}
