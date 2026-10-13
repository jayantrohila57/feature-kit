"use client"

import { FormKit } from "form"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { resetPassword } from "../core/auth.client"
import { AuthSchema, type ResetPasswordInput } from "../schema/auth-schema"
import { AuthFooterNote } from "./auth-card-layout"

export function ResetPasswordForm({ token }: { token?: string }) {
	const router = useRouter()
	const [pending, startTransition] = useTransition()

	return (
		<div className="grid gap-6">
			<FormKit
				schema={AuthSchema.RESET_PASSWORD.INPUT}
				defaultValues={{ password: "", confirmPassword: "" }}
				isPending={pending}
				onSubmit={(data: ResetPasswordInput) => {
					startTransition(async () => {
						const toastId = toast.loading("Updating password…")
						const result = await resetPassword({
							newPassword: data.password,
							token: token ?? "demo-token",
						})
						if (result?.error) {
							toast.error(result.error.message ?? "Reset failed", { id: toastId })
							return
						}
						toast.success("Password updated", { id: toastId })
						router.push("/docs/examples/auth/sign-in")
					})
				}}>
				<FormKit.Field name="password" label="New password" type="text" inputType="password" required />
				<FormKit.Field
					name="confirmPassword"
					label="Confirm password"
					type="text"
					inputType="password"
					required
				/>
				<FormKit.Actions>
					<FormKit.Submit label="Reset password" pendingLabel="Saving…" />
				</FormKit.Actions>
			</FormKit>
			<AuthFooterNote action="Sign in" hint="Done?" href="/docs/examples/auth/sign-in" />
		</div>
	)
}
