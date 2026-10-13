"use client"

import {
	DashboardAccountMenu,
	DashboardShell,
	DashboardSidebarBrand,
	DashboardSidebarNav,
} from "layout"
import { BookOpen, LayoutGrid, Settings, Table2, Users } from "lucide-react"

import { SignOutDropdownMenuItem } from "auth"
import { ThemeSelector } from "theme"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/card"
import { SidebarMenuButton, SidebarTrigger } from "@/packages/ui/components/sidebar"

const navGroups = [
	{
		label: "Workspace",
		icon: LayoutGrid,
		defaultOpen: true,
		items: [
			{ title: "Overview", href: "/docs/examples/layout/dashboard", icon: LayoutGrid },
			{ title: "Accounts", href: "/docs/examples/layout/dashboard#accounts", icon: Users },
			{ title: "Reports", href: "/docs/examples/layout/dashboard#reports", icon: Table2 },
		],
	},
	{
		label: "Resources",
		icon: BookOpen,
		items: [
			{ title: "Documentation", href: "/docs", icon: BookOpen },
			{ title: "Settings", href: "/docs/examples/layout/dashboard#settings", icon: Settings },
		],
	},
]

export function DashboardShellExample() {
	return (
		<div className="h-[min(640px,70vh)] overflow-hidden rounded-lg border">
			<DashboardShell
				headerActions={<ThemeSelector label="Theme" />}
				sidebarContent={<DashboardSidebarNav groups={navGroups} />}
				sidebarFooter={
					<DashboardAccountMenu
						signOutItem={<SignOutDropdownMenuItem />}
						user={{
							name: "Demo User",
							email: "demo@featurekit.dev",
						}}
					/>
				}
				sidebarHeader={
					<>
						<DashboardSidebarBrand
							href="/docs"
							logo={
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
									<LayoutGrid className="size-4" />
								</div>
							}
							subtitle="Playground"
							title="Feature Kit"
						/>
						<SidebarMenuButton asChild className="hidden group-data-[collapsible=icon]:flex" size="sm">
							<SidebarTrigger />
						</SidebarMenuButton>
					</>
				}>
				<Card className="border-0 shadow-none">
					<CardHeader>
						<CardTitle>Dashboard content</CardTitle>
						<CardDescription>
							Collapsible sidebar, route breadcrumbs in the header, and mobile sheet navigation via the
							trigger.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 sm:grid-cols-2">
						<div className="rounded-lg border bg-muted/40 p-4 text-sm" id="accounts">
							<p className="font-medium">Accounts</p>
							<p className="text-muted-foreground">Placeholder panel for nested routes.</p>
						</div>
						<div className="rounded-lg border bg-muted/40 p-4 text-sm" id="reports">
							<p className="font-medium">Reports</p>
							<p className="text-muted-foreground">Swap this region for your feature screen.</p>
						</div>
					</CardContent>
				</Card>
			</DashboardShell>
		</div>
	)
}
