"use client"

import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react"
import Link from "next/link"

import { FormKitBasicExample } from "@/components/examples/form/form-kit-basic-example"
import { GitHubIcon } from "@/components/site/github-icon"
import { githubUrl } from "@/lib/site-nav"
import { Button } from "@/packages/ui/components/button"
import { cn } from "@/packages/ui/lib/utils"

const trustedBy = ["Next.js", "React", "TanStack Table", "Zod", "Radix UI", "pnpm workspaces"]

export function LandingHero() {
	return (
		<section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 md:pt-14">
			<div className="flex max-w-3xl flex-col items-start gap-6 text-left">
				<div
					className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm shadow-sm">
					<span className="rounded-full bg-muted px-2 py-0.5 font-medium text-[10px] uppercase tracking-wide">
						Open source
					</span>
					<span className="text-muted-foreground">Composable kits for Next.js apps</span>
					<ArrowRight className="size-3.5 text-muted-foreground" />
				</div>

				<div className="space-y-4">
					<h1 className="font-semibold text-4xl tracking-tight md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
						Schema-driven forms, tables, layout, and import flows for React teams
					</h1>
					<p className="max-w-2xl text-base text-muted-foreground leading-7 md:text-lg">
						Feature Kit bundles production-ready UI kits for admin apps—validation, filters, URL sync, shells,
						and upload flows—built to drop into your monorepo.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<Button asChild className="h-11 rounded-full px-6" size="lg">
						<Link href="/docs">
							Read the docs
							<ArrowRight className="size-4" />
						</Link>
					</Button>
					<Button asChild className="h-11 rounded-full px-6" size="lg" variant="outline">
						<a href={githubUrl} rel="noreferrer noopener" target="_blank">
							<GitHubIcon className="size-4" />
							GitHub
							<ArrowUpRight className="size-4" />
						</a>
					</Button>
				</div>
			</div>

			<div className="mt-10 md:mt-14">
				<PlaygroundPreviewFrame />
			</div>

			<div className="mt-12 flex flex-col items-center gap-6 text-center md:mt-16">
				<p className="text-muted-foreground text-sm">
					Built with <span className="font-medium text-foreground">modern React tooling</span>
				</p>
				<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
					{trustedBy.map((name) => (
						<span
							key={name}
							className="font-medium text-muted-foreground/80 text-sm tracking-tight grayscale">
							{name}
						</span>
					))}
				</div>
			</div>
		</section>
	)
}

function PlaygroundPreviewFrame() {
	return (
		<div className="overflow-hidden rounded-2xl border bg-card shadow-lg shadow-black/5 ring-1 ring-border/60">
			<div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
				<div className="flex gap-1.5">
					<span className="size-2.5 rounded-full bg-red-400/80" />
					<span className="size-2.5 rounded-full bg-amber-400/80" />
					<span className="size-2.5 rounded-full bg-emerald-400/80" />
				</div>
				<div className="mx-auto flex max-w-md flex-1 items-center justify-center gap-2 rounded-md border bg-background/80 px-3 py-1 text-muted-foreground text-xs">
					<BookOpen className="size-3.5 shrink-0" />
					<span className="truncate">feature-kit/docs/examples/form/basic</span>
				</div>
				<Link
					className="text-primary text-xs underline-offset-4 hover:underline"
					href="/docs/examples/form/basic">
					Open
				</Link>
			</div>
			<div className="grid gap-0 bg-linear-to-b from-muted/20 to-background lg:grid-cols-[220px_1fr]">
				<div className="hidden border-r bg-muted/30 p-4 lg:block">
					<p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">Docs</p>
					<ul className="space-y-2 text-muted-foreground text-sm">
						<li className="font-medium text-foreground">Form example</li>
						<li>Data table</li>
						<li>Layout</li>
						<li>Uploader</li>
					</ul>
				</div>
				<div className={cn("min-h-[280px] p-4 md:p-6 lg:min-h-[360px]")}>
					<FormKitBasicExample />
				</div>
			</div>
		</div>
	)
}
