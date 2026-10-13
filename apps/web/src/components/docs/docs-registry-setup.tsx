"use client"

import { getRegistryBaseUrl } from "@/lib/registry-url"

export function DocsRegistrySetup() {
	const base = getRegistryBaseUrl()

	return (
		<div className="not-prose my-6 space-y-4">
			<p className="text-muted-foreground text-sm">
				Add the <code className="text-foreground">@feature-kit</code> namespace once. The shadcn CLI resolves{" "}
				<code className="text-foreground">@feature-kit/&lt;kit&gt;</code> to{" "}
				<code className="text-foreground">{base}/&lt;kit&gt;.json</code>.
			</p>
			<pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 text-xs leading-relaxed">
				<code>{`{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@feature-kit": "${base}/{name}.json"
  }
}`}</code>
			</pre>
			<p className="text-muted-foreground text-sm">
				Catalog: <a className="text-foreground underline-offset-4 hover:underline" href={`${base}/registry.json`}>
					{base}/registry.json
				</a>
			</p>
		</div>
	)
}
