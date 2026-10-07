import { ExampleShell } from "@/components/examples/example-shell"
import { layoutExamples } from "@/lib/examples-catalog"

const meta = layoutExamples.find((e) => e.slug === "breadcrumbs")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<p className="max-w-2xl text-muted-foreground text-sm leading-6">
				Breadcrumbs are rendered above this page from the examples layout. Navigate deeper (for example{" "}
				<code className="rounded bg-muted px-1 py-0.5 text-xs">/examples/table/filters</code>) to see
				compression, intermediate links, and the copy-URL control.
			</p>
		</ExampleShell>
	)
}
