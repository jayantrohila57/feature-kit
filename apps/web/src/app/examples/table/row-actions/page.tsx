import { TableRowActionsExample } from "@/components/examples/table/table-row-actions-example"
import { ExampleShell } from "@/components/examples/example-shell"
import { tableExamples } from "@/lib/examples-catalog"

const meta = tableExamples.find((e) => e.slug === "row-actions")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<TableRowActionsExample />
		</ExampleShell>
	)
}
