"use client"

import { FormKit } from "form"
import { useTransition } from "react"
import { toast } from "sonner"

import { forgetPassword } from "../core/auth.client"
import { AuthSchema, type ForgotPasswordInput } from "../schema/auth-schema"
import { AuthFooterNote } from "./auth-card-layout"

export function ForgotPasswordForm() {
	const [pending, startTransition] = useTransition()

	return (
		<div className="grid gap-6">
			<FormKit
				schema={AuthSchema.FORGOT_PASSWORD.INPUT}
				defaultValues={{ email: "" }}
				isPending={pending}
				onSubmit={(data: ForgotPasswordInput) => {
					startTransition(async () => {
						const toastId = toast.loading("Sending reset link…")
						const result = await forgetPassword({
							email: data.email,
							redirectTo: "/docs/examples/auth/reset-password",
						})
						if (result?.error) {
							toast.error(result.error.message ?? "Could not send reset email", { id: toastId })
							return
						}
						toast.success("Check your inbox (demo: link logged in network tab)", { id: toastId })
					})
				}}>
				<FormKit.Field name="email" label="Email" type="text" required />
				<FormKit.Actions>
					<FormKit.Submit label="Send reset link" pendingLabel="Sending…" />
				</FormKit.Actions>
			</FormKit>
			<AuthFooterNote action="Back to sign in" hint="Remembered your password?" href="/docs/examples/auth/sign-in" />
		</div>
	)
}
