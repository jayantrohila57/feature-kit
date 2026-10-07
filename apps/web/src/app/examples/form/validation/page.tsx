import { FormKitValidationExample } from "@/components/examples/form/form-kit-validation-example"
import { ExampleShell } from "@/components/examples/example-shell"
import { formExamples } from "@/lib/examples-catalog"

const meta = formExamples.find((e) => e.slug === "validation")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<FormKitValidationExample />
		</ExampleShell>
	)
}
