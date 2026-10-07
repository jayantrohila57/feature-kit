import Link from "next/link"

export default function HomePage() {
	return (
		<main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
			<div className="flex flex-col gap-2">
				<h1 className="font-semibold text-3xl tracking-tight">Feature Kit</h1>
				<p className="text-muted-foreground text-sm leading-6">
					Schema-driven forms and data tables built on shadcn Field primitives, React Hook Form, Zod, and TanStack
					Table.
				</p>
			</div>
			<div className="flex flex-wrap gap-3">
				<Link
					className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-primary px-4 font-medium text-primary-foreground text-sm"
					href="/examples">
					Browse examples
				</Link>
				<Link
					className="inline-flex h-10 w-fit items-center justify-center rounded-md border border-border bg-background px-4 font-medium text-sm"
					href="/docs">
					Read docs
				</Link>
			</div>
		</main>
	)
}
