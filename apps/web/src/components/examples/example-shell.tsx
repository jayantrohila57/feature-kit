import type { ReactNode } from "react"

import Link from "next/link"

type ExampleShellProps = {
	title: string
	description: string
	children: ReactNode
}

export function ExampleShell({ title, description, children }: ExampleShellProps) {
	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<Link
					className="text-muted-foreground text-sm hover:text-foreground"
					href="/examples">
					← All examples
				</Link>
				<h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
				<p className="max-w-2xl text-muted-foreground text-sm leading-6">{description}</p>
			</div>
			{children}
		</div>
	)
}
