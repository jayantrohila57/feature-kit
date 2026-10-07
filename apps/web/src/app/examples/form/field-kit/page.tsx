import { FieldKitFiltersExample } from "@/components/examples/form/field-kit-filters-example"
import { ExampleShell } from "@/components/examples/example-shell"
import { formExamples } from "@/lib/examples-catalog"

const meta = formExamples.find((e) => e.slug === "field-kit")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<FieldKitFiltersExample />
		</ExampleShell>
	)
}
