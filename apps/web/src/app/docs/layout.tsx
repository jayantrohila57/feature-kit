import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { ReactNode } from "react"

import { DocsSidebarChrome } from "@/components/site/docs-sidebar-chrome"
import { docsLayoutOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"

export default function Layout({ children }: { children: ReactNode }) {
	const docsGridTemplate = `"sidebar sidebar header toc toc"
"sidebar sidebar toc-popover toc toc"
"sidebar sidebar main toc toc" 1fr / minmax(0, 0.5fr) var(--fd-sidebar-col) minmax(0, calc(var(--fd-layout-width, 64rem) - var(--fd-sidebar-width) - var(--fd-toc-width))) var(--fd-toc-width) minmax(0, 0.5fr)`

	return (
		<DocsLayout
			{...docsLayoutOptions()}
			containerProps={{ style: { gridTemplate: docsGridTemplate } }}
			sidebar={{ footer: <DocsSidebarChrome /> }}
			tree={source.getPageTree()}>
			{children}
		</DocsLayout>
	)
}
