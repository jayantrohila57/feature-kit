import { cn } from "@/packages/ui/lib/utils"

export function BreadcrumbDocFrame({
	children,
	className,
	compact,
}: {
	children: React.ReactNode
	className?: string
	compact?: boolean
}) {
	return (
		<div
			className={cn(
				"rounded-lg border border-border bg-muted/20",
				compact ? "px-3 py-2" : "px-4 py-3",
				className,
			)}>
			{children}
		</div>
	)
}
