import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { ReactNode } from "react"

import { docsLayoutOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"

export default function Layout({ children }: { children: ReactNode }) {
	const docsGridTemplate = `"header header header header header"
"sidebar sidebar toc-popover toc toc"
"sidebar sidebar main toc toc" 1fr / minmax(0, 0fr) var(--fd-sidebar-col) minmax(0, 1fr) var(--fd-toc-width) minmax(0, 0fr)`

	return (
		<DocsLayout
			{...docsLayoutOptions()}
			containerProps={{ style: { gridTemplate: docsGridTemplate } }}
			tree={source.getPageTree()}>
			{children}
		</DocsLayout>
	)
}
