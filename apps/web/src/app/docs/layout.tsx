import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { ReactNode } from "react"

import { DocsSiteFooter } from "@/components/docs/docs-site-footer"
import { DocsTocFooterSync } from "@/components/docs/docs-toc-footer-sync"
import { docsLayoutOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"

export default function Layout({ children }: { children: ReactNode }) {
	// Row 3 = article + TOC only; row 4 = site footer so the TOC scrolls away before the footer.
	const docsGridTemplate = `"header header header header header"
"sidebar sidebar toc-popover toc toc"
"sidebar sidebar main toc toc" auto
"sidebar sidebar site-footer site-footer site-footer" auto / minmax(0, 0fr) var(--fd-sidebar-col) minmax(0, 1fr) var(--fd-toc-width) minmax(0, 0fr)`

	return (
		<DocsLayout
			{...docsLayoutOptions()}
			containerProps={{ style: { gridTemplate: docsGridTemplate } }}
			tree={source.getPageTree()}>
			{children}
			<DocsSiteFooter />
			<DocsTocFooterSync />
		</DocsLayout>
	)
}
