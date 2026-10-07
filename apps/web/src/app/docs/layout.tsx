import type { ReactNode } from "react"

import { DocsHeader } from "@/components/docs/docs-header"
import { DocsNav } from "@/components/docs/docs-nav"

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<DocsHeader />
			<div className="border-b bg-background">
				<DocsNav />
			</div>
			<div className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-8">{children}</div>
		</div>
	)
}
