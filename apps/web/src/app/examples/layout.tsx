import type { ReactNode } from "react"

import Link from "next/link"
import { Breadcrumbs, GoBackButton } from "layout"

import { ExamplesNavClient } from "@/components/examples/examples-nav-client"

export default function ExamplesLayout({ children }: { children: ReactNode }) {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row lg:gap-12">
			<aside className="lg:w-56 lg:shrink-0">
				<div className="mb-6 flex flex-col gap-2">
					<Link className="font-semibold text-sm tracking-tight" href="/">
						Feature Kit
					</Link>
					<Link className="text-muted-foreground text-xs hover:text-foreground" href="/docs">
						Documentation
					</Link>
				</div>
				<ExamplesNavClient />
			</aside>
			<div className="flex min-w-0 flex-1 flex-col gap-4">
				<div className="flex items-center gap-2">
					<GoBackButton fallbackHref="/examples" />
					<div className="min-w-0 flex-1">
						<Breadcrumbs />
					</div>
				</div>
				{children}
			</div>
		</div>
	)
}
