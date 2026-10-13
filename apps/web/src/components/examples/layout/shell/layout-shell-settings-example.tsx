"use client"

import { DashboardShell, FormSection, SettingsLayout } from "layout"

import { Input } from "@/packages/ui/components/input"
import { Label } from "@/packages/ui/components/label"

import { settingsNav } from "./layout-demo-nav"
import { LayoutShellFrame } from "./layout-shell-frame"
import { LayoutShellSidebarSlots } from "./layout-shell-shared"

const slots = LayoutShellSidebarSlots()

export function LayoutShellSettingsExample() {
	return (
		<LayoutShellFrame tall>
			<DashboardShell {...slots}>
				<SettingsLayout
					activeId="profile"
					description="Secondary nav lives inside the main column."
					navigation={settingsNav}
					title="Settings">
					<div className="rounded-lg border bg-card p-4 shadow-sm">
						<FormSection description="Visible on profile." title="Profile">
							<div className="col-span-2 grid gap-2">
								<Label htmlFor="settings-name">Display name</Label>
								<Input id="settings-name" placeholder="Demo User" />
							</div>
						</FormSection>
					</div>
				</SettingsLayout>
			</DashboardShell>
		</LayoutShellFrame>
	)
}
