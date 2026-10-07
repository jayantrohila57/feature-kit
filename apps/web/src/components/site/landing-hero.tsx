"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { FormKitBasicExample } from "@/components/examples/form/form-kit-basic-example"
import { GitHubIcon } from "@/components/site/github-icon"
import { githubUrl } from "@/lib/site-nav"
import { Button } from "@/packages/ui/components/button"
import { cn } from "@/packages/ui/lib/utils"

const trustedBy = ["Next.js", "React", "TanStack Table", "Zod", "Radix UI", "pnpm workspaces"]

export function LandingHero() {
	return (
		<section className="relative mx-auto w-full max-w-5xl overflow-hidden pt-16">
			<div aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-hidden">
				<div
					className={cn(
						"absolute inset-0 isolate -z-10",
						"bg-[radial-gradient(20%_80%_at_20%_0%,--theme(--color-foreground/.1),transparent)]",
					)}
				/>
			</div>

			<div className="relative z-10 flex max-w-2xl flex-col gap-5 px-4">
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

			<div className="relative">
				<div
					aria-hidden
					className={cn(
						"absolute -inset-x-20 inset-y-0 -translate-y-1/3 scale-120 rounded-full",
						"bg-[radial-gradient(ellipse_at_center,theme(--color-foreground/.1),transparent,transparent)]",
						"blur-[50px]",
					)}
				/>
				<div
					className={cn(
						"mask-b-from-60% relative mt-8 -mr-8 overflow-hidden px-2 sm:mt-12 sm:mr-0 md:mt-20",
						"fade-in slide-in-from-bottom-5 animate-in fill-mode-backwards delay-100 duration-1000 ease-out",
					)}>
					<div
						className={cn(
							"relative inset-shadow-2xs inset-shadow-foreground/10 mx-auto max-w-5xl overflow-hidden rounded-lg border bg-background p-2 shadow-xl ring-1 ring-card",
							"dark:inset-shadow-foreground/20 dark:inset-shadow-xs",
						)}>
						<div className="aspect-video overflow-hidden rounded-lg border bg-muted/20 p-4 md:p-6">
							<FormKitBasicExample />
						</div>
					</div>
				</div>
			</div>

			<section className="relative space-y-4 border-t px-4 pt-6 pb-10">
				<h2 className="text-center font-medium text-lg text-muted-foreground tracking-tight md:text-xl">
					Built with <span className="text-foreground">modern React tooling</span>
				</h2>
				<div className="relative z-10 mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
					{trustedBy.map((name) => (
						<span
							key={name}
							className="font-medium text-muted-foreground/80 text-sm tracking-tight grayscale">
							{name}
						</span>
					))}
				</div>
			</section>
		</section>
	)
}
