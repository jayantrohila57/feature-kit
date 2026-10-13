"use client"

import { ContentPageHeader, DashboardShell, FormSection } from "layout"

import { LayoutShellFrame } from "./layout-shell-frame"
import { LayoutShellSidebarSlots } from "./layout-shell-shared"

const slots = LayoutShellSidebarSlots()

export function LayoutShellContentExample() {
	return (
		<LayoutShellFrame tall>
			<DashboardShell {...slots}>
				<ContentPageHeader title="Content layouts" />
				<div className="mt-6 space-y-8">
					<section className="space-y-3">
						<h3 className="font-medium text-sm">Grid</h3>
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{[1, 2, 3].map((n) => (
								<div key={n} className="rounded-lg border bg-muted/40 p-4 text-sm">Tile {n}</div>
							))}
						</div>
					</section>
					<section className="space-y-3">
						<h3 className="font-medium text-sm">Flex row</h3>
						<div className="flex flex-col gap-3 sm:flex-row">
							<div className="flex-1 rounded-lg border p-4 text-sm">Primary</div>
							<div className="w-full rounded-lg border p-4 text-sm sm:w-48">Aside</div>
						</div>
					</section>
					<section className="rounded-lg border bg-card">
						<FormSection description="Use `FormSection` for settings-style field groups." title="Form section">
							<div className="col-span-2 h-10 rounded-md border bg-background" />
						</FormSection>
					</section>
				</div>
			</DashboardShell>
		</LayoutShellFrame>
	)
}
