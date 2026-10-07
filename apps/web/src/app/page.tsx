import Link from "next/link"

export default function HomePage() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-8 px-6 py-16">
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
		</main>
	)
}
