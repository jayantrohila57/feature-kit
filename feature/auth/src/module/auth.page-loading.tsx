import { Skeleton } from "@/packages/ui/components/skeleton"

export function AuthPageLoading() {
	return (
		<div className="grid w-full max-w-md gap-4">
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full rounded-md" />
		</div>
	)
}
