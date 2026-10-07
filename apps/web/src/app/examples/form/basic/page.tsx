import { FormKitBasicExample } from "@/components/examples/form/form-kit-basic-example"
import { ExampleShell } from "@/components/examples/example-shell"
import { formExamples } from "@/lib/examples-catalog"

const meta = formExamples.find((e) => e.slug === "basic")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<FormKitBasicExample />
		</ExampleShell>
	)
}
