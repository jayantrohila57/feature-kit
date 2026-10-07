import { TableLoadingExample } from "@/components/examples/table/table-loading-example"
import { ExampleShell } from "@/components/examples/example-shell"
import { tableExamples } from "@/lib/examples-catalog"

const meta = tableExamples.find((e) => e.slug === "loading")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<TableLoadingExample />
		</ExampleShell>
	)
}
