"use client"

import { DashboardShell, FormSection, SettingsLayout } from "layout"
import { ThemeSelector } from "theme"

import { BlockPageRoot } from "@/components/blocks/block-page-root"
import { LayoutShellSidebarSlots } from "@/components/blocks/block-shell-slots"
import { settingsNav } from "@/components/examples/layout/shell/layout-demo-nav"
import { Input } from "@/packages/ui/components/input"
import { Label } from "@/packages/ui/components/label"
import { Switch } from "@/packages/ui/components/switch"
import { Textarea } from "@/packages/ui/components/textarea"

const slots = LayoutShellSidebarSlots()

export function SettingsAreaBlock() {
	return (
		<BlockPageRoot>
			<DashboardShell {...slots}>
				<SettingsLayout
					activeId="profile"
					description="Secondary navigation, profile fields, preferences, and theme."
					navigation={settingsNav}
					title="Settings">
					<div className="space-y-6">
						<div className="rounded-lg border bg-card p-4 shadow-sm">
							<FormSection description="Visible on the profile route." title="Profile">
								<div className="col-span-2 grid gap-2">
									<Label htmlFor="block-settings-name">Display name</Label>
									<Input id="block-settings-name" placeholder="Demo User" />
								</div>
								<div className="col-span-2 grid gap-2">
									<Label htmlFor="block-settings-email">Email</Label>
									<Input id="block-settings-email" placeholder="demo@featurekit.dev" type="email" />
								</div>
								<div className="col-span-2 grid gap-2">
									<Label htmlFor="block-settings-bio">Bio</Label>
									<Textarea id="block-settings-bio" placeholder="Short bio for your team directory." rows={3} />
								</div>
							</FormSection>
						</div>
						<div className="rounded-lg border bg-card p-4 shadow-sm">
							<FormSection description="Notification and product preferences." title="Preferences">
								<div className="col-span-2 flex items-center justify-between gap-4 rounded-md border px-3 py-2">
									<div>
										<p className="font-medium text-sm">Product updates</p>
										<p className="text-muted-foreground text-xs">Email when kits ship new examples.</p>
									</div>
									<Switch defaultChecked id="pref-updates" />
								</div>
								<div className="col-span-2 flex items-center justify-between gap-4 rounded-md border px-3 py-2">
									<div>
										<p className="font-medium text-sm">Weekly digest</p>
										<p className="text-muted-foreground text-xs">Usage summary every Monday.</p>
									</div>
									<Switch id="pref-digest" />
								</div>
							</FormSection>
						</div>
						<div className="rounded-lg border bg-card p-4 shadow-sm">
							<FormSection description="Uses the theme kit selector." title="Appearance">
								<div className="col-span-2 flex flex-wrap items-center justify-between gap-3">
									<div>
										<p className="font-medium text-sm">Theme</p>
										<p className="text-muted-foreground text-xs">System, light, or dark.</p>
									</div>
									<ThemeSelector label="Theme" />
								</div>
							</FormSection>
						</div>
					</div>
				</SettingsLayout>
			</DashboardShell>
		</BlockPageRoot>
	)
}
