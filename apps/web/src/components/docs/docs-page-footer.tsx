"use client"

import Link from "fumadocs-core/link"
import type { FooterProps } from "fumadocs-ui/layouts/docs/page"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/packages/ui/lib/utils"

export function DocsPageFooter({ items, className, ...props }: FooterProps) {
	const previous = items?.previous
	const next = items?.next

	if (!previous && !next) {
		return null
	}

	return (
		<div className={cn("@container grid grid-cols-1 gap-4 sm:grid-cols-2", className)} {...props}>
			{previous ? <FooterCard align="start" item={previous} /> : <div aria-hidden className="hidden sm:block" />}
			{next ? <FooterCard align="end" item={next} /> : <div aria-hidden className="hidden sm:block" />}
		</div>
	)
}

function FooterCard({
	item,
	align,
}: {
	item: NonNullable<FooterProps["items"]>["previous"]
	align: "start" | "end"
}) {
	if (!item) {
		return null
	}

	const Icon = align === "start" ? ChevronLeft : ChevronRight

	return (
		<Link
			className={cn(
				"flex flex-col gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground",
				align === "end" && "text-end",
			)}
			href={item.url}>
			<div
				className={cn(
					"inline-flex items-center gap-1.5 font-medium",
					align === "end" && "flex-row-reverse",
				)}>
				<Icon className="-mx-1 size-4 shrink-0 rtl:rotate-180" />
				<p>{item.name}</p>
			</div>
			{item.description ? <p className="text-fd-muted-foreground">{item.description}</p> : null}
		</Link>
	)
}
