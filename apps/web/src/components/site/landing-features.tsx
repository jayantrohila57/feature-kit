import type { ReactNode } from "react"
import {
	FormInput,
	LayoutGrid,
	Link2,
	ShieldCheck,
	Table2,
	Upload,
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/packages/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/card"
import { cn } from "@/packages/ui/lib/utils"

function BentoCard({
	className,
	visual,
	visualClassName,
	children,
}: {
	className?: string
	visual?: ReactNode
	visualClassName?: string
	children: ReactNode
}) {
	return (
		<Card
			className={cn(
				"group/card relative gap-0 py-0 shadow-xs transition-colors hover:bg-muted/20",
				className,
			)}>
			{visual ? (
				<div
					className={cn(
						"pointer-events-none relative min-h-28 overflow-hidden border-b bg-muted/30 md:min-h-32",
						visualClassName,
					)}>
					{visual}
				</div>
			) : null}
			<div className="flex flex-col gap-(--card-spacing) py-(--card-spacing)">{children}</div>
		</Card>
	)
}

const FORM_FIELD_TYPES = ["string", "enum", "boolean"] as const

function FormPreviewVisual() {
	return (
		<div className="absolute inset-0">
			<div
				aria-hidden
				className="absolute inset-0 bg-[linear-gradient(to_right,--theme(--color-foreground/.04)_1px,transparent_1px),linear-gradient(to_bottom,--theme(--color-foreground/.04)_1px,transparent_1px)] bg-size-[1rem_1rem]"
			/>
			<div className="relative flex h-full flex-col gap-2 p-3 sm:gap-2.5 sm:p-4">
				<div className="flex flex-wrap items-center gap-1.5">
					<span className="text-[0.5rem] text-muted-foreground uppercase tracking-wide">Field kits</span>
					{FORM_FIELD_TYPES.map((type) => (
						<Badge key={type} variant="secondary" className="h-4 px-1.5 font-mono text-[0.5rem]">
							{type}
						</Badge>
					))}
				</div>

				<div className="flex min-h-0 flex-1 flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3">
					<div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-md border bg-card/95 ring-1 ring-foreground/5">
						<div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-2 py-1">
							<span className="font-mono text-[0.5rem] text-muted-foreground">user.schema.ts</span>
							<Badge variant="outline" className="h-4 px-1 text-[0.45rem]">
								Zod
							</Badge>
						</div>
						<pre className="overflow-hidden p-2 font-mono text-[0.48rem] leading-[1.45] text-foreground/85 sm:text-[0.5rem]">
							{`const userSchema = z.object({
  email: z.string().email(),
  role: z.enum(["Admin", "Editor"]),
  team: z.string().min(1),
  active: z.boolean(),
})`}
						</pre>
					</div>

					<div
						aria-hidden
						className="hidden shrink-0 flex-col items-center justify-center gap-0.5 sm:flex">
						<span className="font-mono text-[0.45rem] text-muted-foreground">→</span>
						<span className="text-[0.45rem] text-muted-foreground">FormKit</span>
					</div>

					<div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-md border bg-card shadow-sm ring-1 ring-foreground/5">
						<div className="flex items-center justify-between gap-2 border-b px-2.5 py-1.5">
							<span className="font-medium text-[0.6rem]">Create user</span>
							<span className="text-[0.45rem] text-muted-foreground">Draft</span>
						</div>
						<div className="flex flex-1 flex-col gap-2 p-2.5 sm:p-3">
							<div className="space-y-1">
								<label className="block text-[0.5rem] text-muted-foreground">Email</label>
								<div className="h-6 rounded-xs border bg-background px-2 font-mono text-[0.55rem] leading-6 text-foreground">
									jane@acme.io
								</div>
							</div>
							<div className="space-y-1">
								<label className="block text-[0.5rem] text-muted-foreground">Role</label>
								<div className="flex h-6 items-center justify-between rounded-xs border bg-background px-2 text-[0.55rem]">
									<span>Admin</span>
									<span className="text-muted-foreground">▾</span>
								</div>
							</div>
							<div className="space-y-1">
								<label className="block text-[0.5rem] text-muted-foreground">Team</label>
								<div className="h-6 rounded-xs border bg-background px-2 text-[0.55rem] leading-6 text-muted-foreground">
									Platform
								</div>
							</div>
							<div className="flex items-center justify-between gap-2 pt-0.5">
								<div className="flex items-center gap-1.5">
									<div className="relative h-3.5 w-6 rounded-full bg-primary/20">
										<div className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-primary" />
									</div>
									<span className="text-[0.5rem] text-muted-foreground">Active</span>
								</div>
								<div className="h-5 rounded-xs bg-primary px-2.5 text-[0.55rem] text-primary-foreground leading-5">
									Save
								</div>
							</div>
							<p className="text-[0.45rem] text-destructive">Role is required for SSO groups</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function TablePreviewVisual() {
	const rows = ["Name", "Role", "Status"]
	return (
		<div className="absolute inset-0 p-4">
			<div className="flex gap-2 pb-3">
				<div className="h-6 flex-1 rounded-xs border bg-background/80 px-2 text-[0.6rem] text-muted-foreground leading-6">
					Search…
				</div>
				<div className="h-6 rounded-xs border bg-background/80 px-2 text-[0.6rem] leading-6">Filter</div>
			</div>
			<div className="overflow-hidden rounded-md border bg-card/90 ring-1 ring-foreground/5">
				<div className="grid grid-cols-3 gap-px border-b bg-muted/50 px-2 py-1.5 font-medium text-[0.55rem] text-muted-foreground">
					{rows.map((h) => (
						<span key={h}>{h}</span>
					))}
				</div>
				{[
					["Jane Doe", "Admin", "Active"],
					["Alex Kim", "Editor", "Active"],
					["Sam Lee", "Viewer", "Invited"],
				].map((row) => (
					<div
						key={row[0]}
						className="grid grid-cols-3 gap-px border-b border-border/50 px-2 py-1.5 text-[0.55rem] last:border-0">
						{row.map((cell) => (
							<span key={cell} className="truncate text-foreground/90">
								{cell}
							</span>
						))}
					</div>
				))}
			</div>
		</div>
	)
}

function UrlSyncVisual() {
	return (
		<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
			<div className="w-full rounded-md border bg-background/90 px-2 py-1.5 font-mono text-[0.55rem] text-muted-foreground leading-snug ring-1 ring-foreground/5">
				/?<span className="text-foreground">q</span>=design&<span className="text-foreground">page</span>
				=2&<span className="text-foreground">sort</span>=name
			</div>
			<div className="flex gap-1">
				{["q", "page", "sort"].map((key) => (
					<span
						key={key}
						className="rounded-xs border bg-card px-1.5 py-0.5 font-mono text-[0.5rem] text-foreground/80">
						{key}
					</span>
				))}
			</div>
		</div>
	)
}

function ValidationVisual() {
	return (
		<div className="absolute inset-0 flex items-center justify-center p-4">
			<ul className="w-full max-w-[9rem] space-y-2">
				<li className="flex items-center gap-2 text-[0.6rem] text-foreground/90">
					<span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
						<ShieldCheck className="size-2.5" aria-hidden />
					</span>
					Email format
				</li>
				<li className="flex items-center gap-2 text-[0.6rem] text-destructive">
					<span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-destructive/15">
						!
					</span>
					Required role
				</li>
				<li className="flex items-center gap-2 text-[0.6rem] text-muted-foreground">
					<span className="size-4 shrink-0 rounded-full border border-dashed border-muted-foreground/40" />
					Async check
				</li>
			</ul>
		</div>
	)
}

function LayoutShellVisual() {
	return (
		<div className="absolute inset-0 flex p-3">
			<div className="flex w-full overflow-hidden rounded-md border bg-card ring-1 ring-foreground/5">
				<div className="w-8 shrink-0 border-r bg-muted/40 p-1.5">
					<div className="mb-2 h-1.5 w-full rounded-xs bg-foreground/15" />
					<div className="space-y-1">
						{[1, 2, 3].map((i) => (
							<div key={i} className="h-1 w-full rounded-xs bg-foreground/10" />
						))}
					</div>
				</div>
				<div className="min-w-0 flex-1 p-2">
					<div className="mb-2 flex gap-1 text-[0.5rem] text-muted-foreground">
						<span>Home</span>
						<span>/</span>
						<span className="text-foreground">Users</span>
					</div>
					<div className="h-12 rounded-xs border border-dashed border-muted-foreground/25 bg-muted/20" />
				</div>
			</div>
		</div>
	)
}

function ImportFlowVisual() {
	return (
		<div className="absolute inset-0 flex items-center justify-center p-4">
			<div className="flex w-full max-w-xs items-center gap-3">
				<div className="flex flex-1 flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/35 bg-background/80 px-3 py-4 text-center ring-1 ring-foreground/5">
					<Upload className="mb-1 size-4 text-muted-foreground" aria-hidden />
					<span className="text-[0.55rem] text-muted-foreground">Drop CSV</span>
				</div>
				<div className="flex flex-col gap-1 text-[0.55rem] text-muted-foreground">
					<span className="text-foreground">Map columns</span>
					<span>Validate rows</span>
					<span className="text-primary">Import 248</span>
				</div>
			</div>
		</div>
	)
}

function ChartBarsVisual() {
	const heights = [40, 65, 45, 80, 55, 70]
	return (
		<div className="absolute inset-0 flex items-end justify-center gap-1.5 px-6 pb-4 pt-8">
			{heights.map((h, i) => (
				<div
					key={i}
					className="w-3 rounded-t-xs bg-primary/25 transition-all duration-300 group-hover/card:bg-primary/40"
					style={{ height: `${h}%` }}
				/>
			))}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-muted/50 to-transparent"
			/>
		</div>
	)
}

export function LandingFeatures() {
	return (
		<section className="relative px-4 pt-10 pb-12 lg:px-6">
			<div className="w-full space-y-6">
				<div className="max-w-2xl space-y-2">
					<h2 className="font-medium text-2xl tracking-tight md:text-3xl">
						Everything you wire up in an admin app—already composed
					</h2>
					<p className="text-muted-foreground text-sm md:text-base">
						Pick a kit, share schemas across forms and tables, and ship consistent UX from your monorepo UI
						package.
					</p>
				</div>

				<div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[minmax(7.5rem,auto)]">
					<BentoCard
						className="flex flex-col sm:col-span-2 md:row-span-2"
						visual={<FormPreviewVisual />}
						visualClassName="min-h-44 flex-1 sm:min-h-48 md:min-h-52">
						<CardHeader className="px-(--card-spacing) pt-0">
							<div className="flex items-center gap-2">
								<FormInput className="size-3.5 text-muted-foreground" aria-hidden />
								<CardTitle>Schema-driven forms</CardTitle>
							</div>
							<CardDescription>
								Field kits, controlled inputs, and Zod-backed validation—reuse the same schema in API
								routes and UI.
							</CardDescription>
						</CardHeader>
						<CardContent className="px-(--card-spacing) pt-0">
							<Link
								className="text-primary text-xs underline-offset-4 hover:underline"
								href="/docs/form">
								Form kit docs
							</Link>
						</CardContent>
					</BentoCard>

					<BentoCard className="md:col-span-1" visual={<UrlSyncVisual />}>
						<CardHeader className="px-(--card-spacing) pt-0">
							<div className="flex items-center gap-2">
								<Link2 className="size-3.5 text-muted-foreground" aria-hidden />
								<CardTitle>URL-synced state</CardTitle>
							</div>
							<CardDescription>
								Filters, pagination, and search stay shareable via query params—built for nuqs patterns
								in tables.
							</CardDescription>
						</CardHeader>
					</BentoCard>

					<BentoCard className="md:col-span-1" visual={<ValidationVisual />}>
						<CardHeader className="px-(--card-spacing) pt-0">
							<div className="flex items-center gap-2">
								<ShieldCheck className="size-3.5 text-muted-foreground" aria-hidden />
								<CardTitle>Validation that matches</CardTitle>
							</div>
							<CardDescription>
								Inline errors, async rules, and server-action friendly messages—not a second validation
								language.
							</CardDescription>
						</CardHeader>
					</BentoCard>

					<BentoCard className="sm:col-span-2 md:col-span-2" visual={<TablePreviewVisual />}>
						<CardHeader className="px-(--card-spacing) pt-0">
							<div className="flex items-center gap-2">
								<Table2 className="size-3.5 text-muted-foreground" aria-hidden />
								<CardTitle>Data tables</CardTitle>
							</div>
							<CardDescription>
								TanStack Table with toolbars, column filters, bulk actions, and empty states tuned for
								internal tools.
							</CardDescription>
						</CardHeader>
						<CardContent className="px-(--card-spacing) pt-0">
							<Link
								className="text-primary text-xs underline-offset-4 hover:underline"
								href="/docs/data-table">
								Table kit docs
							</Link>
						</CardContent>
					</BentoCard>

					<BentoCard className="md:col-span-1" visual={<LayoutShellVisual />}>
						<CardHeader className="px-(--card-spacing) pt-0">
							<div className="flex items-center gap-2">
								<LayoutGrid className="size-3.5 text-muted-foreground" aria-hidden />
								<CardTitle>Layout shells</CardTitle>
							</div>
							<CardDescription>
								Sidebar, breadcrumbs, and page chrome so every kit feels like one product.
							</CardDescription>
						</CardHeader>
					</BentoCard>

					<BentoCard className="sm:col-span-2 md:col-span-2" visual={<ImportFlowVisual />}>
						<CardHeader className="px-(--card-spacing) pt-0">
							<div className="flex items-center gap-2">
								<Upload className="size-3.5 text-muted-foreground" aria-hidden />
								<CardTitle>Import flows</CardTitle>
							</div>
							<CardDescription>
								Upload UI with column mapping and row validation—drop into onboarding and back-office
								bulk updates.
							</CardDescription>
						</CardHeader>
						<CardContent className="px-(--card-spacing) pt-0">
							<Link
								className="text-primary text-xs underline-offset-4 hover:underline"
								href="/docs/uploader">
								Uploader kit docs
							</Link>
						</CardContent>
					</BentoCard>

					<BentoCard className="md:col-span-1" visual={<ChartBarsVisual />}>
						<CardHeader className="px-(--card-spacing) pt-0">
							<CardTitle>Monorepo-ready</CardTitle>
							<CardDescription>
								Workspace UI primitives, pnpm catalogs, and live examples—copy patterns, not
								placeholder SaaS fluff.
							</CardDescription>
						</CardHeader>
					</BentoCard>
				</div>
			</div>
		</section>
	)
}
