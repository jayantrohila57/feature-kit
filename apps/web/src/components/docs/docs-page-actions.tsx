"use client"

import Link from "fumadocs-core/link"
import { ArrowLeft, ArrowRight, Check, ChevronDown, Copy, Link2, TextIcon } from "lucide-react"
import { type ReactNode, useCallback, useRef, useState } from "react"
import { toast } from "sonner"

import type { DocsFooterItem } from "@/lib/docs-footer"
import { Button } from "@/packages/ui/components/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/packages/ui/components/dropdown-menu"
import { Separator } from "@/packages/ui/components/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/packages/ui/components/tooltip"
import { cn } from "@/packages/ui/lib/utils"

type DocsPageActionsProps = {
	markdownUrl: string
	pagePath: string
	previous?: DocsFooterItem
	next?: DocsFooterItem
	className?: string
}

const markdownCache = new Map<string, string>()

async function fetchMarkdown(markdownUrl: string): Promise<string> {
	const cached = markdownCache.get(markdownUrl)
	if (cached) {
		return cached
	}

	const response = await fetch(markdownUrl)
	if (!response.ok) {
		throw new Error(`Failed to fetch markdown (${response.status})`)
	}

	const content = await response.text()
	if (process.env.NODE_ENV === "production") {
		markdownCache.set(markdownUrl, content)
	}
	return content
}

function useCopyFeedback(onCopy: () => Promise<void> | void) {
	const [copied, setCopied] = useState(false)
	const timeoutRef = useRef<number | null>(null)

	const run = useCallback(async () => {
		try {
			await onCopy()
			if (timeoutRef.current) {
				window.clearTimeout(timeoutRef.current)
			}
			setCopied(true)
			timeoutRef.current = window.setTimeout(() => {
				setCopied(false)
			}, 1500)
		} catch {
			toast.error("Copy failed")
		}
	}, [onCopy])

	return { copied, run }
}

export function DocsPageActions({
	markdownUrl,
	pagePath,
	previous,
	next,
	className,
}: DocsPageActionsProps) {
	const copyMarkdown = useCallback(async () => {
		const content = await fetchMarkdown(markdownUrl)
		await navigator.clipboard.writeText(content)
		toast.success("Markdown copied")
	}, [markdownUrl])

	const copyLink = useCallback(async () => {
		const url =
			typeof window !== "undefined"
				? new URL(pagePath, window.location.origin).href
				: pagePath
		await navigator.clipboard.writeText(url)
		toast.success("Link copied")
	}, [pagePath])

	const { copied: markdownCopied, run: onCopyPage } = useCopyFeedback(copyMarkdown)
	const { copied: linkCopied, run: onCopyLinkMenu } = useCopyFeedback(copyLink)

	return (
		<div className={cn("flex shrink-0 items-center gap-1.5", className)}>
			<div className="inline-flex h-8 items-stretch overflow-hidden rounded-md border border-border">
				<Button
					className="h-8 gap-1.5 rounded-none border-0 px-2.5 shadow-none"
					disabled={markdownCopied}
					onClick={() => {
						void onCopyPage()
					}}
					size="lg"
					type="button"
					variant="secondary">
					{markdownCopied ? (
						<Check className="size-3.5 text-muted-foreground" />
					) : (
						<Copy className="size-3.5 text-muted-foreground" />
					)}
					<span className="text-xs">{markdownCopied ? "Copied" : "Copy Page"}</span>
				</Button>
				<Separator className="bg-border" orientation="vertical" />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							aria-label="More copy options"
							className="h-8 w-8 shrink-0 rounded-none border-0 px-0 shadow-none"
							size="icon-lg"
							type="button"
							variant="secondary">
							<ChevronDown className="size-3.5 text-muted-foreground" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="min-w-44">
						<DropdownMenuItem
							onSelect={() => {
								void onCopyLinkMenu()
							}}>
							{linkCopied ? <Check className="size-4" /> : <Link2 className="size-4" />}
							Copy link
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() => {
								void onCopyPage()
							}}>
							<Copy className="size-4" />
							Copy Markdown
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<a href={markdownUrl} rel="noreferrer" target="_blank">
								<TextIcon className="size-4" />
								View as Markdown
							</a>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<DocPagerButton
				ariaLabel={previous ? `Previous: ${previous.name}` : "No previous page"}
				disabled={!previous}
				{...(previous ? { href: previous.url } : {})}
			>
				<ArrowLeft className="size-4" />
			</DocPagerButton>
			<DocPagerButton
				ariaLabel={next ? `Next: ${next.name}` : "No next page"}
				disabled={!next}
				{...(next ? { href: next.url } : {})}
			>
				<ArrowRight className="size-4" />
			</DocPagerButton>
		</div>
	)
}

function DocPagerButton({
	ariaLabel,
	disabled,
	href,
	children,
}: {
	ariaLabel: string
	disabled?: boolean
	href?: string
	children: ReactNode
}) {
	const button = (
		<Button
			aria-label={ariaLabel}
			className="size-8 shrink-0"
			disabled={disabled}
			size="icon-lg"
			type="button"
			variant="secondary">
			{children}
		</Button>
	)

	if (disabled || !href) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>{button}</TooltipTrigger>
				<TooltipContent side="bottom">{ariaLabel}</TooltipContent>
			</Tooltip>
		)
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button asChild className="size-8 shrink-0" size="icon-lg" variant="secondary">
					<Link aria-label={ariaLabel} href={href}>
						{children}
					</Link>
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom">{ariaLabel}</TooltipContent>
		</Tooltip>
	)
}
