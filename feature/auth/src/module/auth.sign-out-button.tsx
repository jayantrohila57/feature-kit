"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/packages/ui/components/button"
import type { ComponentProps } from "react"

import { signOut } from "../core/auth.client"

type SignOutButtonProps = ComponentProps<typeof Button> & {
	redirectTo?: string
}

export function SignOutButton({ redirectTo = "/docs/examples/auth/sign-in", children = "Sign out", ...props }: SignOutButtonProps) {
	const router = useRouter()
	const [pending, startTransition] = useTransition()

	return (
		<Button
			{...props}
			disabled={pending || props.disabled}
			onClick={() => {
				startTransition(async () => {
					const toastId = toast.loading("Signing out…")
					await signOut()
					toast.success("Signed out", { id: toastId })
					router.push(redirectTo)
					router.refresh()
				})
			}}
			type="button">
			{children}
		</Button>
	)
}
