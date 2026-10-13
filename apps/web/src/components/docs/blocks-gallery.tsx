import { ArrowRight, LayoutTemplate } from "lucide-react"
import Link from "next/link"

import { BLOCKS } from "@/lib/blocks/catalog"
import { Badge } from "@/packages/ui/components/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/card"
import { cn } from "@/packages/ui/lib/utils"

function BlockCard({
	title,
	description,
	href,
	tags,
}: {
	title: string
	description: string
	href: string
	tags: string[]
}) {
	return (
		<Link
			href={href}
			className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
			<Card
				className={cn(
					"h-full gap-0 py-0 shadow-xs transition-colors",
					"hover:bg-muted/25 hover:ring-foreground/15",
				)}>
				<div className="flex h-28 items-center justify-center border-b bg-[radial-gradient(ellipse_at_top,--theme(--color-primary/.08),transparent_60%)]">
					<LayoutTemplate className="size-8 text-muted-foreground/70" aria-hidden />
				</div>
				<CardHeader className="gap-2 px-(--card-spacing) py-(--card-spacing)">
					<div className="flex items-start justify-between gap-2">
						<CardTitle className="text-sm">{title}</CardTitle>
						<Badge className="shrink-0 font-normal" variant="outline">Block</Badge>
					</div>
					<CardDescription className="line-clamp-2">{description}</CardDescription>
					<div className="flex flex-wrap gap-1">
						{tags.slice(0, 3).map((tag) => (
							<Badge key={tag} className="font-normal text-[10px]" variant="secondary">
								{tag}
							</Badge>
						))}
					</div>
					<span
						className="inline-flex items-center gap-1 text-primary text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
						View block
						<ArrowRight className="size-3" aria-hidden />
					</span>
				</CardHeader>
			</Card>
		</Link>
	)
}

export function BlocksGallery() {
	return (
		<div className="not-prose my-8">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{BLOCKS.map((block) => (
					<BlockCard
						key={block.slug}
						description={block.description}
						href={`/docs/blocks/${block.slug}`}
						tags={block.tags}
						title={block.title}
					/>
				))}
			</div>
		</div>
	)
}
