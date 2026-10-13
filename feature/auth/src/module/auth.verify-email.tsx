"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/packages/ui/components/button"

import { signIn } from "../core/auth.client"
import { AuthFooterNote } from "./auth-card-layout"

export function VerifyEmailPanel() {
	const searchParams = useSearchParams()
	const email = searchParams.get("email") ?? "demo@featurekit.dev"
	const router = useRouter()
	const [pending, startTransition] = useTransition()

	return (
		<div className="grid gap-4">
			<p className="text-muted-foreground text-sm">
				Demo mode skips email delivery. Click verify to continue as <strong>{email}</strong>.
			</p>
			<Button
				disabled={pending}
				onClick={() => {
					startTransition(async () => {
						const toastId = toast.loading("Verifying…")
						const result = await signIn.email({
							email,
							password: "DemoPass1",
						})
						if (result?.error) {
							toast.error(result.error.message ?? "Verification failed", { id: toastId })
							return
						}
						toast.success("Email verified", { id: toastId })
						router.push("/docs/examples/auth")
						router.refresh()
					})
				}}
				type="button">
				Mark email verified
			</Button>
			<AuthFooterNote action="Sign in" hint="Already verified?" href="/docs/examples/auth/sign-in" />
		</div>
	)
}
