import { LandingFooter } from "@/components/site/landing-footer"
import { cn } from "@/packages/ui/lib/utils"

/**
 * Site footer at the end of docs article content. Breaks out of the article max-width
 * to the main column edges; scrolls with the page so the TOC can clear it.
 */
export function DocsSiteFooter({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"not-prose -mx-4 mt-20 md:-mx-6 xl:-mx-8",
				className,
			)}>
			<LandingFooter />
		</div>
	)
}
