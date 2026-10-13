"use client"

import { Skeleton } from "@/packages/ui/components/skeleton"
import { Suspense } from "react"

import { GitHubSignInButton } from "./auth.github-sign-in"

export function AuthProviders() {
	return (
		<div className="flex w-full flex-col gap-4">
			<Suspense fallback={<Skeleton className="h-10 w-full rounded-md" />}>
				<GitHubSignInButton />
			</Suspense>
		</div>
	)
}
