import { TableEmptyExample } from "@/components/examples/table/table-empty-example"
import { ExampleShell } from "@/components/examples/example-shell"
import { tableExamples } from "@/lib/examples-catalog"

const meta = tableExamples.find((e) => e.slug === "empty")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<TableEmptyExample />
		</ExampleShell>
	)
}
