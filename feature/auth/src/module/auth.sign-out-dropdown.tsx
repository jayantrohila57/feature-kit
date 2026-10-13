"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { DropdownMenuItem } from "@/packages/ui/components/dropdown-menu"

import { signOut } from "../core/auth.client"

export function SignOutDropdownMenuItem({
	redirectTo = "/docs/examples/auth/sign-in",
	children = "Sign out",
}: {
	redirectTo?: string
	children?: ReactNode
}) {
	const router = useRouter()
	const [pending, startTransition] = useTransition()

	return (
		<DropdownMenuItem
			disabled={pending}
			onSelect={() => {
				startTransition(async () => {
					await signOut()
					router.push(redirectTo)
					router.refresh()
				})
			}}>
			{children}
		</DropdownMenuItem>
	)
}
