"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { Button } from "@/packages/ui/components/button"
import type { ComponentProps } from "react"

import { signOut } from "../core/auth.client"

type SignOutIconButtonProps = Omit<ComponentProps<typeof Button>, "children"> & {
	redirectTo?: string
	label?: string
}

export function SignOutIconButton({
	redirectTo = "/docs/examples/auth/sign-in",
	label = "Sign out",
	...props
}: SignOutIconButtonProps) {
	const router = useRouter()
	const [pending, startTransition] = useTransition()

	return (
		<Button
			{...props}
			aria-label={label}
			disabled={pending || props.disabled}
			onClick={() => {
				startTransition(async () => {
					await signOut()
					router.push(redirectTo)
					router.refresh()
				})
			}}
			size={props.size ?? "icon"}
			type="button"
			variant={props.variant ?? "ghost"}>
			<LogOut className="size-4" />
		</Button>
	)
}
