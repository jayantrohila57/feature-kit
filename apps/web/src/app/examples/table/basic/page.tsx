import { TableBasicExample } from "@/components/examples/table/table-basic-example"
import { ExampleShell } from "@/components/examples/example-shell"
import { tableExamples } from "@/lib/examples-catalog"

const meta = tableExamples.find((e) => e.slug === "basic")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<TableBasicExample />
		</ExampleShell>
	)
}
