import { FormKitFieldTypesExample } from "@/components/examples/form/form-kit-field-types-example"
import { ExampleShell } from "@/components/examples/example-shell"
import { formExamples } from "@/lib/examples-catalog"

const meta = formExamples.find((e) => e.slug === "field-types")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<FormKitFieldTypesExample />
		</ExampleShell>
	)
}
