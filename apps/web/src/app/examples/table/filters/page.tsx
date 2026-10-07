import { TableFiltersExample } from "@/components/examples/table/table-filters-example"
import { ExampleShell } from "@/components/examples/example-shell"
import { tableExamples } from "@/lib/examples-catalog"

const meta = tableExamples.find((e) => e.slug === "filters")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<TableFiltersExample />
		</ExampleShell>
	)
}
