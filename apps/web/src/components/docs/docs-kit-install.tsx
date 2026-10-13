"use client"

import { DocsInstall } from "@/components/docs/docs-install"
import { DocsPackageInstall } from "@/components/docs/docs-package-install"
import { usePackageManager } from "@/components/docs/package-manager-context"
import { getRegistryItemUrl } from "@/lib/registry-url"
import { cn } from "@/packages/ui/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/packages/ui/components/tabs"

const MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const

function shadcnCommand(manager: (typeof MANAGERS)[number], item: string) {
	const url = getRegistryItemUrl(item)
	switch (manager) {
		case "npm":
			return `npx shadcn@latest add ${url}`
		case "pnpm":
			return `pnpm dlx shadcn@latest add ${url}`
		case "yarn":
			return `yarn dlx shadcn@latest add ${url}`
		case "bun":
			return `bunx shadcn@latest add ${url}`
	}
}

type DocsKitInstallProps = {
	/** Registry item name (e.g. `form`, `data-table`). */
	registryItem: string
	/** npm packages added by the registry item (for manual workspace / deps reference). */
	packages: string[]
	importExample: string
	note?: string
	transpileNote?: string
	className?: string
}

export function DocsKitInstall({
	registryItem,
	packages,
	importExample,
	note,
	transpileNote,
	className,
}: DocsKitInstallProps) {
	const { manager, setManager } = usePackageManager()
	const namespaced = `@feature-kit/${registryItem}`

	return (
		<div className={cn("not-prose my-6 space-y-8", className)}>
			<div className="space-y-3">
				<h3 className="font-medium text-sm">Registry CLI</h3>
				<p className="text-muted-foreground text-sm">
					Requires a one-time{" "}
					<a className="text-foreground underline-offset-4 hover:underline" href="/docs/installation#registry">
						<code className="text-xs">components.json</code> registry entry
					</a>{" "}
					for <code className="text-xs">{namespaced}</code>.
				</p>
				<Tabs onValueChange={(v) => setManager(v as typeof manager)} value={manager}>
					<TabsList
						variant="line"
						className="h-9 w-full justify-start rounded-none border-b bg-transparent p-0">
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
						<TabsContent key={m} className="mt-3 space-y-2" value={m}>
							<pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 text-xs leading-relaxed">
								<code>{shadcnCommand(m, registryItem)}</code>
							</pre>
							<p className="text-muted-foreground text-xs">
								Namespaced: <code>npx shadcn@latest add {namespaced}</code>
							</p>
						</TabsContent>
					))}
				</Tabs>
			</div>

			<div className="space-y-3">
				<h3 className="font-medium text-sm">Manual installation</h3>
				<p className="text-muted-foreground text-sm">
					Monorepo consumers can depend on <code className="text-xs">workspace:*</code> packages instead of
					the registry CLI.
				</p>
				<DocsPackageInstall packages={packages} />
				<DocsInstall
					packages={packages}
					importExample={importExample}
					{...(note ? { note } : {})}
				/>
				{transpileNote ? <p className="text-muted-foreground text-sm">{transpileNote}</p> : null}
			</div>
		</div>
	)
}
