"use client"

import { ArrowRight, FormInput, LayoutGrid, Table2 } from "lucide-react"
import Link from "next/link"

import { GitHubIcon } from "@/components/site/github-icon"
import { githubUrl } from "@/lib/site-nav"
import { Button } from "@/packages/ui/components/button"
import { cn } from "@/packages/ui/lib/utils"

function HeroKitVisual() {
	const kits = [
		{ icon: FormInput, label: "FormKit", detail: "Zod → fields" },
		{ icon: Table2, label: "TableKit", detail: "Filters & URL sync" },
		{ icon: LayoutGrid, label: "LayoutKit", detail: "Shell & nav" },
	] as const

	return (
		<div
			aria-hidden
			className={cn(
				"relative hidden min-h-64 w-full overflow-hidden rounded-lg border bg-card/40 shadow-xs ring-1 ring-foreground/5 lg:block",
				"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-300 duration-500 ease-out",
			)}>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,--theme(--color-foreground/.04)_1px,transparent_1px),linear-gradient(to_bottom,--theme(--color-foreground/.04)_1px,transparent_1px)] bg-size-[1rem_1rem]" />
			<div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_20%,--theme(--color-primary/.12),transparent)]" />
			<div className="relative flex h-full flex-col justify-center gap-2.5 p-5">
				{kits.map((kit, i) => (
					<div
						key={kit.label}
						className="flex items-center gap-3 rounded-md border bg-card/95 px-3 py-2.5 shadow-sm ring-1 ring-foreground/5"
						style={{ marginInlineStart: `${i * 0.75}rem` }}>
						<div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted/50">
							<kit.icon className="size-3.5 text-muted-foreground" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="font-medium text-sm leading-none">{kit.label}</p>
							<p className="mt-1 truncate text-muted-foreground text-xs">{kit.detail}</p>
						</div>
						<span className="font-mono text-[0.65rem] text-primary/80">kit</span>
					</div>
				))}
			</div>
		</div>
	)
}

export function LandingHero() {
	return (
		<section className="relative w-full overflow-hidden px-4 pt-16 lg:px-6">
			<div aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-hidden">
				<div
					className={cn(
						"absolute inset-0 isolate -z-10",
						"bg-[radial-gradient(40%_70%_at_15%_0%,--theme(--color-foreground/.1),transparent)]",
						"lg:bg-[radial-gradient(50%_80%_at_30%_0%,--theme(--color-foreground/.1),transparent)]",
					)}
				/>
			</div>

			<div className="relative z-10 grid gap-8 pb-8 md:pb-9 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-center lg:gap-10">
				<div className="flex max-w-3xl flex-col gap-5 lg:max-w-none">
					<Link
						className={cn(
							"group flex w-fit items-center gap-3 rounded-sm border bg-card p-1 shadow-xs",
							"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out",
						)}
						href="/docs/getting-started">
						<div className="rounded-xs border bg-card px-1.5 py-0.5 shadow-sm">
							<p className="font-mono text-xs">OSS</p>
						</div>
						<span className="text-xs">Composable kits for Next.js monorepos</span>
						<span className="block h-5 border-l" />
						<ArrowRight
							className="size-3 -translate-x-0.5 pr-1 duration-150 ease-out group-hover:translate-x-0.5"
							aria-hidden
						/>
					</Link>

					<h1
						className={cn(
							"text-balance font-medium text-4xl text-foreground leading-tight md:text-5xl",
							"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-100 duration-500 ease-out",
						)}>
						Schema-driven forms, tables, layout, and import flows for React teams
					</h1>

					<p
						className={cn(
							"text-muted-foreground text-sm tracking-wide sm:text-lg md:text-xl",
							"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-200 duration-500 ease-out",
						)}>
						Production-ready UI kits for admin apps—validation, filters, URL sync, shells, and upload flows you
						can drop into your workspace.
					</p>

					<div
						className={cn(
							"fade-in slide-in-from-bottom-10 flex w-fit animate-in flex-wrap items-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out",
						)}>
						<Button asChild className="h-8" variant="outline">
							<a href={githubUrl} rel="noreferrer noopener" target="_blank">
								<GitHubIcon className="size-4" data-icon="inline-start" />
								GitHub
							</a>
						</Button>
						<Button asChild className="h-8">
							<Link href="/docs">
								Get started
								<ArrowRight className="size-4" data-icon="inline-end" />
							</Link>
						</Button>
					</div>
				</div>

				<HeroKitVisual />
			</div>

		</section>
	)
}
