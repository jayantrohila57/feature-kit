"use client"

import { FormKit } from "form"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { signUp } from "../core/auth.client"
import { AuthSchema, type SignUpInput } from "../schema/auth-schema"
import { AuthFooterNote } from "./auth-card-layout"
import { AuthProviders } from "./auth.providers"

export function SignUpForm({ redirectTo = "/docs/examples/auth" }: { redirectTo?: string }) {
	const router = useRouter()
	const [pending, startTransition] = useTransition()

	return (
		<div className="grid gap-6">
			<AuthProviders />
			<FormKit
				schema={AuthSchema.SIGN_UP.INPUT}
				defaultValues={{ name: "", email: "", password: "" }}
				isPending={pending}
				onSubmit={(data: SignUpInput) => {
					startTransition(async () => {
						const toastId = toast.loading("Creating account…")
						const result = await signUp.email({
							email: data.email,
							password: data.password,
							name: data.name,
						})
						if (result?.error) {
							toast.error(result.error.message ?? "Sign up failed", { id: toastId })
							return
						}
						toast.success("Account created", { id: toastId })
						router.push(redirectTo)
						router.refresh()
					})
				}}>
				<FormKit.Field name="name" label="Name" type="text" required />
				<FormKit.Field name="email" label="Email" type="text" required />
				<FormKit.Field name="password" label="Password" type="text" inputType="password" required />
				<FormKit.Actions>
					<FormKit.Submit label="Sign up" pendingLabel="Creating…" />
				</FormKit.Actions>
			</FormKit>
			<AuthFooterNote action="Sign in" hint="Already have an account?" href="/docs/examples/auth/sign-in" />
		</div>
	)
}
