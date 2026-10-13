"use client"

import { FormKit } from "form"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { signIn } from "../core/auth.client"
import { AuthSchema, type SignInInput } from "../schema/auth-schema"
import { AuthFooterNote } from "./auth-card-layout"
import { AuthProviders } from "./auth.providers"

export function SignInForm({ redirectTo = "/docs/examples/auth" }: { redirectTo?: string }) {
	const router = useRouter()
	const [pending, startTransition] = useTransition()

	return (
		<div className="grid gap-6">
			<AuthProviders />
			<FormKit
				schema={AuthSchema.SIGN_IN.INPUT}
				defaultValues={{ email: "", password: "", rememberMe: true }}
				isPending={pending}
				onSubmit={(data: SignInInput) => {
					startTransition(async () => {
						const toastId = toast.loading("Signing in…")
						const result = await signIn.email({
							email: data.email,
							password: data.password,
							rememberMe: data.rememberMe ?? true,
						})
						if (result?.error) {
							toast.error(result.error.message ?? "Sign in failed", { id: toastId })
							return
						}
						toast.success("Signed in", { id: toastId })
						router.push(redirectTo)
						router.refresh()
					})
				}}>
				<FormKit.Field name="email" label="Email" type="text" placeholder="you@example.com" required />
				<FormKit.Field name="password" label="Password" type="text" inputType="password" required />
				<FormKit.Field name="rememberMe" label="Remember me" type="switch" />
				<FormKit.Actions>
					<FormKit.Submit label="Sign in" pendingLabel="Signing in…" />
				</FormKit.Actions>
			</FormKit>
			<AuthFooterNote
				action="Create an account"
				hint="New here?"
				href="/docs/examples/auth/sign-up"
			/>
			<AuthFooterNote
				action="Reset password"
				hint="Forgot your password?"
				href="/docs/examples/auth/forgot-password"
			/>
		</div>
	)
}
