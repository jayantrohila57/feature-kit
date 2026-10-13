"use client"

import { ThemeSelector, ThemeToggle } from "theme"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/card"

export function ThemeKitExample() {
	return (
		<Card>
			<CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
				<div>
					<CardTitle>Theme controls</CardTitle>
					<CardDescription>
						`ThemeProvider` syncs with `preferences` via `applyThemePreference` on change.
					</CardDescription>
				</div>
				<div className="flex items-center gap-2">
					<ThemeToggle tooltip="Toggle light / dark" variant="secondary" />
					<ThemeSelector />
				</div>
			</CardHeader>
			<CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
				<div className="rounded-lg border bg-card p-3">Card surface</div>
				<div className="rounded-lg border bg-muted p-3">Muted surface</div>
				<div className="rounded-lg border bg-secondary p-3">Secondary surface</div>
			</CardContent>
		</Card>
	)
}
