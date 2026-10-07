"use client"

import { useSearchContext } from "fumadocs-ui/contexts/search"
import { Search } from "lucide-react"

import { cn } from "@/packages/ui/lib/utils"

const docsHeaderSearchClassName = cn(
	"inline-flex h-7 w-auto min-w-[10rem] shrink-0 items-center justify-between gap-1.5 rounded-md border border-border bg-secondary px-3 text-secondary-foreground shadow-xs",
	"text-xs/relaxed font-normal leading-none hover:bg-secondary/80 hover:text-secondary-foreground",
	"max-sm:px-2 max-sm:[&_kbd]:hidden",
)

export function DocsHeaderSearch() {
	const { enabled, hotKey, setOpenSearch } = useSearchContext()

	if (!enabled) {
		return null
	}

	return (
		<button
			type="button"
			aria-label="Open search"
			className={docsHeaderSearchClassName}
			data-search-full=""
			onClick={() => {
				setOpenSearch(true)
			}}>
			<span className="inline-flex items-center gap-1.5">
				<Search className="size-4 shrink-0" />
				Search
			</span>
			<div className="inline-flex flex-1 justify-end gap-0.5">
				{hotKey.map((key, index) => (
					<kbd
						className="rounded-sm border bg-background px-1 py-px text-[0.625rem] leading-none"
						key={index}>
						{key.display}
					</kbd>
				))}
			</div>
		</button>
	)
}
