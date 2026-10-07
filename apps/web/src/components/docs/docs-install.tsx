type DocsInstallProps = {
	packages: string[]
	importExample: string
	note?: string
}

export function DocsInstall({ packages, importExample, note }: DocsInstallProps) {
	const dependencyLines = packages.map((pkg) => `    "${pkg}": "workspace:*"`).join("\n")

	return (
		<div className="not-prose my-6 space-y-4">
			<div>
				<p className="mb-2 font-medium text-sm">Dependencies</p>
				<pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 text-xs leading-relaxed">
					<code>{`// apps/your-app/package.json\n"dependencies": {\n${dependencyLines}\n}`}</code>
				</pre>
			</div>
			<div>
				<p className="mb-2 font-medium text-sm">Transpile (Next.js)</p>
				<pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 text-xs leading-relaxed">
					<code>{`// next.config.ts\ntranspilePackages: [${packages.map((p) => `"${p}"`).join(", ")}]`}</code>
				</pre>
			</div>
			<div>
				<p className="mb-2 font-medium text-sm">Import</p>
				<pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 text-xs leading-relaxed">
					<code>{importExample}</code>
				</pre>
			</div>
			{note ? <p className="text-muted-foreground text-sm">{note}</p> : null}
		</div>
	)
}
