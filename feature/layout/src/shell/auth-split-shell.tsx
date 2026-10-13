"use client"

import type { CSSProperties, ReactNode } from "react"

import Shell from "@/packages/ui/components/shell"
import { cn } from "@/packages/ui/lib/utils"

import { SHELL_HEADER_HEIGHT } from "./shell-constants"

export type AuthSplitShellProps = {
	children: ReactNode
	aside?: ReactNode
	className?: string
}

/**
 * Split view for auth/marketing: form column + optional visual aside.
 * Pair with `AuthCardLayout` from `auth` in the main column.
 */
export function AuthSplitShell({ children, aside, className }: AuthSplitShellProps) {
	return (
		<Shell.Frame
			className={cn("min-h-[min(720px,75vh)]", className)}
			style={{ "--shell-header-height": SHELL_HEADER_HEIGHT } as CSSProperties}>
			<div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
				<Shell.Section className="flex items-center justify-center p-4 md:p-8" variant="center">
					<div className="w-full max-w-md">{children}</div>
				</Shell.Section>
				{aside ? (
					<div className="hidden border-l bg-muted/30 md:block">{aside}</div>
				) : (
					<div
						aria-hidden
						className="hidden border-l bg-[radial-gradient(ellipse_at_top,--theme(--color-primary/.12),transparent_55%)] md:block"
					/>
				)}
			</div>
		</Shell.Frame>
	)
}
