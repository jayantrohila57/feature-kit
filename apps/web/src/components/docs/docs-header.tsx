"use client"

import Link from "next/link"

import { FullSearchTrigger, SearchTrigger } from "fumadocs-ui/layouts/shared/slots/search-trigger"
import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch"

const githubUrl = "https://github.com/jayantrohila57/feature-kit"

export function DocsHeader() {
	return (
		<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
			<div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-6">
				<Link className="font-semibold text-sm tracking-tight" href="/">
					Feature Kit
				</Link>
				<nav aria-label="Site" className="hidden items-center gap-4 sm:flex">
					<Link className="text-muted-foreground text-sm hover:text-foreground" href="/">
						Home
					</Link>
					<Link className="text-muted-foreground text-sm hover:text-foreground" href="/docs">
						Docs
					</Link>
				</nav>
				<div className="ms-auto flex items-center gap-1.5">
					<FullSearchTrigger hideIfDisabled className="hidden max-w-[220px] bg-muted/60 sm:inline-flex" />
					<SearchTrigger hideIfDisabled className="sm:hidden" />
					<ThemeSwitch />
					<a
						className="hidden rounded-md px-2 py-1.5 text-muted-foreground text-sm hover:bg-muted hover:text-foreground sm:inline-flex"
						href={githubUrl}
						rel="noreferrer noopener"
						target="_blank">
						GitHub
					</a>
				</div>
			</div>
		</header>
	)
}
