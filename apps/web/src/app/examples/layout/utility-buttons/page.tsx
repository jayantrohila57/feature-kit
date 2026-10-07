import { ExampleShell } from "@/components/examples/example-shell"
import { UtilityButtonsDemo } from "@/components/examples/utility-buttons-demo"
import { layoutExamples } from "@/lib/examples-catalog"

const meta = layoutExamples.find((e) => e.slug === "utility-buttons")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<UtilityButtonsDemo />
		</ExampleShell>
	)
}
