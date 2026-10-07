import { TableUrlSyncExample } from "@/components/examples/table/table-url-sync-example"
import { ExampleShell } from "@/components/examples/example-shell"
import { tableExamples } from "@/lib/examples-catalog"

const meta = tableExamples.find((e) => e.slug === "url-sync")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<TableUrlSyncExample />
		</ExampleShell>
	)
}
