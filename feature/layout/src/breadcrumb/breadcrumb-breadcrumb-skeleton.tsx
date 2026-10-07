import { Skeleton } from "@/packages/ui/components/skeleton"
import { cn } from "@/packages/ui/lib/utils"

type BreadcrumbsSkeletonProps = {
	className?: string
}

/** Single placeholder matching breadcrumb row height in the layout header. */
export function BreadcrumbsSkeleton({ className }: BreadcrumbsSkeletonProps = {}) {
	return (
		<Skeleton
			className={cn("hidden h-6 w-48 min-w-48 shrink-0 rounded-sm md:block", className)}
			aria-hidden="true"
		/>
	)
}
