"use client"

import { ContentPageHeader, DashboardShell } from "layout"
import Link from "next/link"

import { BlockPageRoot } from "@/components/blocks/block-page-root"
import { LayoutShellHeaderActions } from "@/components/blocks/block-shell-slots"
import { Card, CardContent, CardHeader, CardTitle } from "@/packages/ui/components/card"

const topLinks = [
	{ href: "/docs/blocks", label: "Blocks" },
	{ href: "/docs", label: "Docs" },
	{ href: "/docs/examples", label: "Examples" },
]

export function TopNavAppBlock() {
	return (
		<BlockPageRoot>
			<DashboardShell
				headerActions={<LayoutShellHeaderActions />}
				showSidebar={false}
				topNavigation={
					<nav aria-label="Primary" className="flex flex-wrap gap-1">
						{topLinks.map((link) => (
							<Link
								key={link.href}
								className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								href={link.href}>
								{link.label}
							</Link>
						))}
					</nav>
				}>
				<ContentPageHeader
					description="Horizontal primary navigation without a sidebar rail."
					title="Projects"
				/>
				<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{["Design system", "Mobile app", "Marketing site"].map((name) => (
						<Card key={name} className="shadow-sm">
							<CardHeader>
								<CardTitle className="text-base">{name}</CardTitle>
							</CardHeader>
							<CardContent className="text-muted-foreground text-sm">
								Active · 4 collaborators · Updated 2d ago
							</CardContent>
						</Card>
					))}
				</div>
			</DashboardShell>
		</BlockPageRoot>
	)
}
