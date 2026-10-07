import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { ReactNode } from "react"

import { DocsSidebarChrome } from "@/components/site/docs-sidebar-chrome"
import { docsLayoutOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsLayout {...docsLayoutOptions()} sidebar={{ footer: <DocsSidebarChrome /> }} tree={source.getPageTree()}>
			{children}
		</DocsLayout>
	)
}
