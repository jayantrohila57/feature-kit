import { LandingFooter } from "@/components/site/landing-footer"
import { cn } from "@/packages/ui/lib/utils"

/** Full-width docs site footer (grid row below article + TOC). */
export function DocsSiteFooter({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"not-prose w-full bg-background [grid-area:site-footer]",
				className,
			)}
			data-docs-site-footer="">
			<LandingFooter />
		</div>
	)
}
