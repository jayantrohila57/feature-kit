"use client"

import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useCallback, useState } from "react"

import { githubUrl } from "@/lib/site-nav"
import { Button } from "@/packages/ui/components/button"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/packages/ui/components/collapsible"
import { cn } from "@/packages/ui/lib/utils"

type FaqItem = {
	id: string
	question: string
	answer: ReactNode
}

type FaqCategory = {
	id: string
	label: string
	items: FaqItem[]
}

const FAQ_CATEGORIES: FaqCategory[] = [
	{
		id: "getting-started",
		label: "Getting started",
		items: [
			{
				id: "prerequisites",
				question: "What do I need installed?",
				answer: (
					<>
						Feature Kit expects <strong className="font-medium">Node.js 24+</strong> and{" "}
						<strong className="font-medium">pnpm 9+</strong>. The repo is a pnpm workspace—use{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">pnpm install</code>{" "}
						at the root so every <code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">feature/*</code>{" "}
						and <code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">packages/*</code>{" "}
						package links correctly.
					</>
				),
			},
			{
				id: "run-playground",
				question: "How do I run the docs site locally?",
				answer: (
					<>
						Clone the repository, run{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">pnpm install</code>, then{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">pnpm dev</code>. The landing
						page is at{" "}
						<Link className="text-primary underline-offset-4 hover:underline" href="/">
							localhost:3000
						</Link>
						; kit documentation with live previews lives under{" "}
						<Link className="text-primary underline-offset-4 hover:underline" href="/docs">
							/docs
						</Link>
						.
					</>
				),
			},
			{
				id: "production-build",
				question: "How is the web app built for production?",
				answer: (
					<>
						Run{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">pnpm build</code> from the
						monorepo root. Deployments treat{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">apps/web</code> as the Next.js
						app root (for example on Vercel). Kits stay workspace packages—they are not published as a single npm
						“product bundle.”
					</>
				),
			},
			{
				id: "docs-map",
				question: "Where should I start reading?",
				answer: (
					<>
						Follow the{" "}
						<Link className="text-primary underline-offset-4 hover:underline" href="/docs/getting-started">
							Getting started
						</Link>{" "}
						guide, then the kit pages (Form, Data table, Layout, Uploader, UI). Each page uses the same recipe:
						when to use → install → preview + code → recipes → props → gotchas → examples.
					</>
				),
			},
		],
	},
	{
		id: "kits-architecture",
		label: "Kits & architecture",
		items: [
			{
				id: "monorepo-layout",
				question: "How is the repository organized?",
				answer: (
					<>
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">apps/web</code> is the Next.js
						docs and examples app. Kits live under{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">feature/*</code> (form,
						data-table, layout, uploader, and others). Shared shadcn-style primitives are in{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">packages/ui</code>, with helpers
						in <code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">packages/format</code> and{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">packages/config</code>.
					</>
				),
			},
			{
				id: "zod-schemas",
				question: "Why is Zod central to the kits?",
				answer: (
					<>
						Form and table flows are schema-driven: define validation once with Zod, then reuse the same shape in
						UI fields, server actions, and API routes. That keeps admin screens aligned with backend contracts
						instead of maintaining parallel validation rules.
					</>
				),
			},
			{
				id: "wire-kit",
				question: "How do I import a kit into my Next.js app?",
				answer: (
					<>
						Add the workspace package to your app dependencies, import from the kit name (for example{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">form</code>,{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">data-table</code>), and list
						every kit you import in{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">transpilePackages</code> in{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">next.config.ts</code>. The{" "}
						<Link className="text-primary underline-offset-4 hover:underline" href="/docs/getting-started">
							getting started
						</Link>{" "}
						page shows a full import example.
					</>
				),
			},
			{
				id: "extra-packages",
				question: "What besides the main kits is in the workspace?",
				answer: (
					<>
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">export</code> handles CSV/XLSX
						downloads for tables and uploader templates;{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">format</code> covers masks and
						locale-aware formatting;{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">preferences</code> stores
						theme and locale cookies for host apps. Check each package&apos;s{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">exports</code> field and{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">feature/*/src</code> for the
						public API.
					</>
				),
			},
		],
	},
	{
		id: "customization",
		label: "Customization",
		items: [
			{
				id: "required-providers",
				question: "Which providers do examples assume?",
				answer: (
					<>
						Most previews match{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">apps/web/src/app/providers.tsx</code>
						: <strong className="font-medium">NextIntlClientProvider</strong> for table copy and confirms,{" "}
						<strong className="font-medium">ThemeProvider</strong> for light/dark,{" "}
						<strong className="font-medium">ConfirmationDialogProvider</strong> from layout,{" "}
						<strong className="font-medium">DataTableNuqsAdapter</strong> for URL-synced listings, and{" "}
						<strong className="font-medium">TooltipProvider</strong> from the UI package.
					</>
				),
			},
			{
				id: "copy-into-workspace",
				question: "Can I copy kits into my own monorepo?",
				answer: (
					<>
						Yes—Feature Kit is meant as copy-friendly source, not a opaque SDK. Copy the kit folders you need from{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">feature/*</code>, wire workspace
						aliases like this repo, and adjust imports. Use{" "}
						<Link className="text-primary underline-offset-4 hover:underline" href="/docs/examples">
							Examples
						</Link>{" "}
						as isolated starting points per scenario.
					</>
				),
			},
			{
				id: "ui-primitives",
				question: "How do I style components consistently?",
				answer: (
					<>
						Kits compose primitives from{" "}
						<Link className="text-primary underline-offset-4 hover:underline" href="/docs/ui">
							packages/ui
						</Link>
						—the same shadcn-style building blocks the docs site uses. Theme tokens and Tailwind setup live with the
						UI package so forms, tables, and layout shells feel like one product.
					</>
				),
			},
			{
				id: "url-sync",
				question: "How does table state sync to the URL?",
				answer: (
					<>
						The data-table kit includes a nuqs adapter so filters, pagination, and search serialize to query params—
						shareable listings without custom router glue. Wrap your app (or table routes) with{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">DataTableNuqsAdapter</code> as
						shown in getting started.
					</>
				),
			},
		],
	},
	{
		id: "contributing-support",
		label: "Contributing & support",
		items: [
			{
				id: "open-source",
				question: "Is Feature Kit open source?",
				answer: (
					<>
						Yes. Source and releases are on{" "}
						<a
							className="text-primary underline-offset-4 hover:underline"
							href={githubUrl}
							rel="noopener noreferrer"
							target="_blank">
							GitHub
						</a>
						. You can inspect every kit implementation, fork for internal tools, or contribute fixes and docs
						improvements back upstream.
					</>
				),
			},
			{
				id: "report-issues",
				question: "Where do I report bugs or ask questions?",
				answer: (
					<>
						Use{" "}
						<a
							className="text-primary underline-offset-4 hover:underline"
							href={`${githubUrl}/issues`}
							rel="noopener noreferrer"
							target="_blank">
							GitHub Issues
						</a>{" "}
						for bugs and feature requests. Include your Next.js version, which kits you imported, and whether
						providers from the playground are wired—the docs examples assume that stack.
					</>
				),
			},
			{
				id: "examples-gallery",
				question: "Where are copy-paste examples?",
				answer: (
					<>
						The{" "}
						<Link className="text-primary underline-offset-4 hover:underline" href="/docs/examples">
							Examples
						</Link>{" "}
						section lists live previews for forms, tables, layout, and uploader flows—each mapped to a concrete file
						you can lift into your app and adapt.
					</>
				),
			},
			{
				id: "contribute-docs",
				question: "How can I contribute documentation or kits?",
				answer: (
					<>
						Docs live as MDX under{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">apps/web/content/docs</code> with
						embedded previews. Pull requests that add recipes, fix gotchas, or extend{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">feature/*</code> follow the
						same monorepo checks as the rest of the project—run{" "}
						<code className="rounded-xs bg-muted px-1 py-0.5 font-mono text-[0.85em]">pnpm build</code> before
						opening a PR.
					</>
				),
			},
		],
	},
]

function FaqAccordionItem({
	item,
	open,
	onOpenChange,
}: {
	item: FaqItem
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	return (
		<Collapsible open={open} onOpenChange={onOpenChange} className="border-b border-border/80 last:border-b-0">
			<CollapsibleTrigger className="group flex w-full items-start justify-between gap-4 py-4 text-left text-sm font-medium transition-colors hover:text-foreground/90 md:text-base">
				<span>{item.question}</span>
				<ChevronDown
					aria-hidden
					className={cn(
						"mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200",
						open && "rotate-180",
					)}
				/>
			</CollapsibleTrigger>
			<CollapsibleContent className="overflow-hidden text-muted-foreground text-sm leading-relaxed data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 md:text-[0.9375rem]">
				<div className="pb-4 pr-8">{item.answer}</div>
			</CollapsibleContent>
		</Collapsible>
	)
}

export function LandingFaq() {
	const [activeCategoryId, setActiveCategoryId] = useState(FAQ_CATEGORIES[0]?.id ?? "")
	const [openItemId, setOpenItemId] = useState<string | null>(
		FAQ_CATEGORIES[0]?.items[0]?.id ?? null,
	)

	const activeCategory =
		FAQ_CATEGORIES.find((category) => category.id === activeCategoryId) ?? FAQ_CATEGORIES[0]

	const selectCategory = useCallback((categoryId: string) => {
		setActiveCategoryId(categoryId)
		const first = FAQ_CATEGORIES.find((c) => c.id === categoryId)?.items[0]?.id ?? null
		setOpenItemId(first)
	}, [])

	if (!activeCategory) {
		return null
	}

	return (
		<section className="relative px-4 pt-10 pb-12 lg:px-6" aria-labelledby="landing-faq-heading">
			<div className="w-full space-y-8">
				<div className="max-w-2xl space-y-2">
					<h2 id="landing-faq-heading" className="font-medium text-2xl tracking-tight md:text-3xl">
						Questions about the monorepo and kits
					</h2>
					<p className="text-muted-foreground text-sm md:text-base">
						Quick answers on running the playground, wiring workspace packages, and copying patterns into your
						admin app.
					</p>
				</div>

				<div className="flex flex-col gap-8 md:flex-row md:gap-10 lg:gap-14">
					<nav
						className="flex shrink-0 flex-row flex-wrap gap-2 md:w-52 md:flex-col md:gap-1"
						aria-label="FAQ categories">
						{FAQ_CATEGORIES.map((category) => {
							const isActive = category.id === activeCategoryId
							return (
								<Button
									key={category.id}
									type="button"
									variant={isActive ? "secondary" : "ghost"}
									size="sm"
									className={cn(
										"h-auto justify-start px-3 py-2 text-left font-normal md:w-full",
										isActive && "font-medium",
									)}
									onClick={() => selectCategory(category.id)}
									aria-current={isActive ? "true" : undefined}>
									<span className="text-sm">{category.label}</span>
								</Button>
							)
						})}
					</nav>

					<div className="min-w-0 flex-1">
						<div className="rounded-lg border bg-card/40 px-4 shadow-xs ring-1 ring-foreground/5 md:px-5">
							{activeCategory.items.map((item) => (
								<FaqAccordionItem
									key={item.id}
									item={item}
									open={openItemId === item.id}
									onOpenChange={(next) => setOpenItemId(next ? item.id : null)}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export const landingFaqCategories = FAQ_CATEGORIES.map(({ id, label }) => ({ id, label }))
