"use client"

import { useSearchContext } from "fumadocs-ui/contexts/search"

import { DocsHeaderSearch } from "@/components/site/docs-header-search"
import { GitHubNavLink } from "@/components/site/feature-kit-header"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { Separator } from "@/packages/ui/components/separator"

export function DocsHeaderActions() {
	const { enabled: searchEnabled } = useSearchContext()

	return (
		<div className="flex shrink-0 items-center gap-1.5">
			{searchEnabled ? (
				<>
					<DocsHeaderSearch />
					<Separator
						className="mx-0.5 h-4 shrink-0 data-vertical:self-center"
						orientation="vertical"
					/>
				</>
			) : null}
			<ThemeToggle className="shrink-0" size="icon" tooltip="Toggle theme" variant="secondary" />
			<Separator
				className="mx-0.5 h-4 shrink-0 data-vertical:self-center"
				orientation="vertical"
			/>
			<GitHubNavLink
				className="shrink-0"
				iconOnly
				size="icon"
				tooltip="GitHub repository"
				variant="secondary"
			/>
		</div>
	)
}
