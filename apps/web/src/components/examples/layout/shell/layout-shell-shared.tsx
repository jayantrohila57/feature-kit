"use client"

import {
	DashboardAccountMenu,
	DashboardSidebarBrand,
	DashboardSidebarNav,
} from "layout"
import { LayoutGrid } from "lucide-react"
import type { ReactNode } from "react"

import { SignOutDropdownMenuItem } from "auth"
import { ThemeSelector } from "theme"

import { workspaceNavGroups } from "./layout-demo-nav"

export function LayoutShellBrand() {
	return (
		<DashboardSidebarBrand
			href="/docs"
			logo={
				<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
					<LayoutGrid className="size-4" />
				</div>
			}
			subtitle="Playground"
			title="Feature Kits"
		/>
	)
}

export function LayoutShellSidebarNav() {
	return <DashboardSidebarNav groups={workspaceNavGroups} />
}

export function LayoutShellAccountMenu({
	user = { name: "Demo User", email: "demo@featurekit.dev" },
}: {
	user?: { name: string; email: string; image?: string | null }
}) {
	return (
		<DashboardAccountMenu signOutItem={<SignOutDropdownMenuItem />} user={user} />
	)
}

export function LayoutShellHeaderActions() {
	return <ThemeSelector label="Theme" />
}

export function LayoutShellSidebarFooter({ user }: { user?: { name: string; email: string } }) {
	return <LayoutShellAccountMenu {...(user ? { user } : {})} />
}

export function LayoutShellSidebarSlots(): {
	sidebarHeader: ReactNode
	sidebarContent: ReactNode
	sidebarFooter: ReactNode
	headerActions: ReactNode
} {
	return {
		sidebarHeader: <LayoutShellBrand />,
		sidebarContent: <LayoutShellSidebarNav />,
		sidebarFooter: <LayoutShellSidebarFooter />,
		headerActions: <LayoutShellHeaderActions />,
	}
}
