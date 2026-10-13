"use client"

import { DashboardShell, ContentPageHeader } from "layout"
import Link from "next/link"

import { useSession } from "auth"

import { LayoutShellFrame } from "./layout-shell-frame"
import {
	LayoutShellBrand,
	LayoutShellHeaderActions,
	LayoutShellSidebarFooter,
	LayoutShellSidebarNav,
} from "./layout-shell-shared"

export function LayoutShellAccountExample() {
	const { data: session } = useSession()
	const user = session?.user
	const displayUser = {
		name: user?.name ?? "Guest",
		email: user?.email ?? "Sign in to attach a session",
		image: user?.image,
	}

	return (
		<LayoutShellFrame>
			<DashboardShell
				headerActions={<LayoutShellHeaderActions />}
				sidebarContent={<LayoutShellSidebarNav />}
				sidebarFooter={<LayoutShellSidebarFooter user={displayUser} />}
				sidebarHeader={<LayoutShellBrand />}>
				<ContentPageHeader
					description="Footer account menu reads the better-auth session when signed in."
					title="Account menu"
				/>
				<p className="mt-4 text-muted-foreground text-sm">
					Try{" "}
					<Link className="text-primary underline" href="/docs/examples/auth/sign-in">
						sign in
					</Link>{" "}
					then reload this preview.
				</p>
			</DashboardShell>
		</LayoutShellFrame>
	)
}
