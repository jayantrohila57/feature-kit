"use client"

import { useState } from "react"

import { cn } from "@/packages/ui/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/packages/ui/components/tabs"

type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

const MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"]

function installCommand(manager: PackageManager, packages: string[]): string {
	const list = packages.join(" ")
	switch (manager) {
		case "npm":
			return `npm install ${list}`
		case "pnpm":
			return `pnpm add ${list}`
		case "yarn":
			return `yarn add ${list}`
		case "bun":
			return `bun add ${list}`
	}
}

type DocsPackageInstallProps = {
	/** Workspace package names (e.g. `layout`, `ui`). */
	packages: string[]
	/** Shown when packages are copied from the monorepo instead of a registry. */
	workspaceNote?: string
	className?: string
}

export function DocsPackageInstall({ packages, workspaceNote, className }: DocsPackageInstallProps) {
	const [manager, setManager] = useState<PackageManager>("pnpm")

	return (
		<div className={cn("not-prose my-6 space-y-3", className)}>
			<Tabs onValueChange={(v) => setManager(v as PackageManager)} value={manager}>
				<TabsList variant="line" className="h-9 w-full justify-start rounded-none border-b bg-transparent p-0">
					{MANAGERS.map((m) => (
						<TabsTrigger
							key={m}
							className="rounded-none border-0 border-transparent bg-transparent px-3 shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
							value={m}>
							{m}
						</TabsTrigger>
					))}
				</TabsList>
				{MANAGERS.map((m) => (
					<TabsContent key={m} className="mt-3" value={m}>
						<pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 text-xs leading-relaxed">
							<code>{installCommand(m, packages)}</code>
						</pre>
					</TabsContent>
				))}
			</Tabs>
			{workspaceNote ? <p className="text-muted-foreground text-sm">{workspaceNote}</p> : null}
		</div>
	)
}
