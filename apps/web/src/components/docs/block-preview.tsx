"use client"

import { Check, Copy, ExternalLink, Monitor, Smartphone, Tablet } from "lucide-react"
import Link from "next/link"
import { useCallback, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { BLOCK_BY_SLUG, getBlockPreviewPath, type BlockSlug } from "@/lib/blocks/catalog"
import { Button } from "@/packages/ui/components/button"
import { cn } from "@/packages/ui/lib/utils"

type ViewportId = "mobile" | "tablet" | "desktop"

const VIEWPORTS: { id: ViewportId; label: string; width: number; icon: typeof Monitor }[] = [
	{ id: "mobile", label: "Mobile", width: 375, icon: Smartphone },
	{ id: "tablet", label: "Tablet", width: 768, icon: Tablet },
	{ id: "desktop", label: "Desktop", width: 1280, icon: Monitor },
]

type BlockPreviewProps = {
	slug: BlockSlug
	className?: string
}

export function BlockPreview({ slug, className }: BlockPreviewProps) {
	const block = BLOCK_BY_SLUG[slug]
	const [viewport, setViewport] = useState<ViewportId>("desktop")
	const [tab, setTab] = useState<"preview" | "code">("preview")
	const [copied, setCopied] = useState(false)
	const copyTimeout = useRef<number | null>(null)

	const previewSrc = getBlockPreviewPath(slug)
	const width = VIEWPORTS.find((v) => v.id === viewport)?.width ?? 1280

	const onCopyCode = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(block.code)
			if (copyTimeout.current) window.clearTimeout(copyTimeout.current)
			setCopied(true)
			copyTimeout.current = window.setTimeout(() => setCopied(false), 2000)
		} catch {
			toast.error("Copy failed")
		}
	}, [block.code])

	const toolbar = useMemo(
		() => (
			<div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/20 px-3 py-2">
				<div className="flex items-center gap-1">
					{VIEWPORTS.map((item) => {
						const Icon = item.icon
						return (
							<Button
								key={item.id}
								aria-pressed={viewport === item.id}
								className={cn("h-8 gap-1.5", viewport === item.id && "bg-background shadow-sm")}
								size="sm"
								type="button"
								variant={viewport === item.id ? "secondary" : "ghost"}
								onClick={() => setViewport(item.id)}>
								<Icon className="size-3.5" aria-hidden />
								<span className="hidden sm:inline">{item.label}</span>
								<span className="text-muted-foreground text-xs tabular-nums">{item.width}px</span>
							</Button>
						)
					})}
				</div>
				<div className="flex items-center gap-1">
					<Button className="h-8" size="sm" type="button" variant="ghost" onClick={onCopyCode}>
						{copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
						<span className="text-xs">{copied ? "Copied" : "Copy code"}</span>
					</Button>
					<Button asChild className="h-8" size="sm" variant="ghost">
						<Link href={previewSrc} rel="noopener noreferrer" target="_blank">
							<ExternalLink className="size-3.5" aria-hidden />
							<span className="text-xs">Full screen</span>
						</Link>
					</Button>
				</div>
			</div>
		),
		[copied, onCopyCode, previewSrc, viewport],
	)

	return (
		<div className={cn("not-prose my-6 overflow-hidden rounded-xl border bg-card", className)}>
			<div className="flex border-b">
				<button
					type="button"
					className={cn(
						"px-4 py-2 text-sm transition-colors",
						tab === "preview"
							? "border-b-2 border-primary font-medium text-foreground"
							: "text-muted-foreground hover:text-foreground",
					)}
					onClick={() => setTab("preview")}>
					Preview
				</button>
				<button
					type="button"
					className={cn(
						"px-4 py-2 text-sm transition-colors",
						tab === "code"
							? "border-b-2 border-primary font-medium text-foreground"
							: "text-muted-foreground hover:text-foreground",
					)}
					onClick={() => setTab("code")}>
					Code
				</button>
			</div>
			{tab === "preview" ? (
				<>
					{toolbar}
					<div className="flex justify-center overflow-x-auto bg-muted/30 p-4">
						<div
							className="h-[min(720px,75vh)] overflow-hidden rounded-lg border bg-background shadow-sm transition-[width] duration-200"
							style={{ width: Math.min(width, 1280) }}>
							<iframe
								className="size-full border-0"
								src={previewSrc}
								title={`${block.title} preview`}
							/>
						</div>
					</div>
				</>
			) : (
				<pre className="max-h-[28rem] overflow-x-auto overflow-y-auto p-4 text-xs leading-relaxed whitespace-pre-wrap break-words">
					<code className="whitespace-pre-wrap break-words">{block.code}</code>
				</pre>
			)}
		</div>
	)
}
