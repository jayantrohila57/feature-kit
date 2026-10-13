"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/packages/ui/lib/utils"

export type SettingsNavItem = {
	id: string
	title: string
	href: string
	icon?: LucideIcon
	description?: string
}

export type SettingsLayoutProps = {
	title: string
	description?: string
	navigation: SettingsNavItem[]
	activeId: string
	children: ReactNode
	className?: string
}

/** In-content secondary navigation for settings-style pages (profile, billing, security). */
export function SettingsLayout({
	title,
	description,
	navigation,
	activeId,
	children,
	className,
}: SettingsLayoutProps) {
	return (
		<div className={cn("flex min-h-0 flex-1 flex-col gap-6 lg:flex-row lg:gap-10", className)}>
			<aside className="w-full shrink-0 lg:w-56">
				<div className="mb-4 lg:mb-6">
					<h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
					{description ? <p className="mt-1 text-muted-foreground text-sm">{description}</p> : null}
				</div>
				<nav aria-label="Settings" className="flex flex-col gap-1">
					{navigation.map((item) => {
						const Icon = item.icon
						const active = item.id === activeId
						return (
							<Link
								key={item.id}
								className={cn(
									"flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
									active
										? "bg-muted font-medium text-foreground"
										: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
								)}
								href={item.href}>
								{Icon ? <Icon className="size-4 shrink-0" /> : null}
								<span>{item.title}</span>
							</Link>
						)
					})}
				</nav>
			</aside>
			<div className="min-w-0 flex-1">{children}</div>
		</div>
	)
}
