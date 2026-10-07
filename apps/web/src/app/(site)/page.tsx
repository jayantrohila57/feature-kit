import Link from "next/link"

import { kitLinks } from "@/lib/site-nav"

export default function HomePage() {
	return (
		<main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-6 py-16 min-h-[calc(100dvh-3.5rem+1px)]">
			<div className="flex flex-col gap-2">
				<h1 className="font-semibold text-3xl tracking-tight">Feature Kit</h1>
				<p className="text-muted-foreground text-sm leading-6">
					Open-source UI kits for forms, tables, layout, and import flows in React and Next.js.
				</p>
			</div>
			<Link
				className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-primary px-4 font-medium text-primary-foreground text-sm"
				href="/docs">
				Read the docs
			</Link>
			<p className="text-muted-foreground text-sm">
				Kits:{" "}
				{kitLinks.map((item, index) => (
					<span key={item.href}>
						{index > 0 ? " · " : null}
						<Link className="text-foreground underline underline-offset-4 hover:text-primary" href={item.href}>
							{item.title}
						</Link>
					</span>
				))}
			</p>
		</main>
	)
}
