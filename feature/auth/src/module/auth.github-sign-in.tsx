"use client"

import { GitHubIcon } from "./auth.github-icon"
import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/packages/ui/components/button"

import { signIn } from "../core/auth.client"

export function GitHubSignInButton() {
	const [pending, startTransition] = useTransition()

	return (
		<Button
			className="w-full"
			disabled={pending}
			onClick={() => {
				startTransition(async () => {
					const toastId = toast.loading("Connecting to GitHub…")
					const result = await signIn.social({
						provider: "github",
						callbackURL: window.location.pathname,
					})
					if (result?.error) {
						toast.error(result.error.message ?? "GitHub sign-in is unavailable in demo mode.", {
							id: toastId,
							description: "Use email and password, or configure GITHUB_CLIENT_ID in production.",
						})
						return
					}
					toast.success("Redirecting…", { id: toastId })
				})
			}}
			type="button"
			variant="outline">
			<GitHubIcon className="size-4" />
			Continue with GitHub
		</Button>
	)
}
