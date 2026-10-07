import { TableBulkActionsExample } from "@/components/examples/table/table-bulk-actions-example"
import { ExampleShell } from "@/components/examples/example-shell"
import { tableExamples } from "@/lib/examples-catalog"

const meta = tableExamples.find((e) => e.slug === "bulk-actions")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<TableBulkActionsExample />
		</ExampleShell>
	)
}
