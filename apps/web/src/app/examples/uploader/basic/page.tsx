import { UploaderBasicExample } from "@/components/examples/uploader/uploader-basic-example"
import { ExampleShell } from "@/components/examples/example-shell"
import { uploaderExamples } from "@/lib/examples-catalog"

const meta = uploaderExamples.find((e) => e.slug === "basic")!

export default function Page() {
	return (
		<ExampleShell title={meta.title} description={meta.description}>
			<UploaderBasicExample />
		</ExampleShell>
	)
}
