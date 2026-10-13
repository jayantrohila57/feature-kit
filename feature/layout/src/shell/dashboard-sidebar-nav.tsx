"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { SidebarFlatNavGroup } from "@/packages/ui/components/sidebar-flat-nav-group"
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/packages/ui/components/sidebar"
import { cn } from "@/packages/ui/lib/utils"

export type DashboardNavItem = {
	title: string
	href: string
	icon?: LucideIcon
}

export type DashboardNavGroup = {
	label: string
	icon?: LucideIcon
	defaultOpen?: boolean
	items: DashboardNavItem[]
}

export type DashboardNavLink = DashboardNavItem

export function DashboardSidebarNav({
	groups,
	links,
	className,
}: {
	groups?: DashboardNavGroup[]
	links?: DashboardNavLink[]
	className?: string
}) {
	const pathname = usePathname()

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			{links?.length ? (
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{links.map((link) => {
								const Icon = link.icon
								const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
								return (
									<SidebarMenuItem key={link.href}>
										<SidebarMenuButton asChild isActive={active} tooltip={link.title}>
											<Link href={link.href}>
												{Icon ? <Icon /> : null}
												<span>{link.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			) : null}
			{groups?.map((group) => {
				const GroupIcon = group.icon
				return (
					<SidebarGroup key={group.label}>
						<SidebarGroupLabel className="sr-only">{group.label}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarFlatNavGroup
								{...(group.defaultOpen !== undefined ? { defaultOpen: group.defaultOpen } : {})}
								{...(GroupIcon ? { icon: <GroupIcon /> } : {})}
								label={group.label}>
								{group.items.map((item) => {
									const ItemIcon = item.icon
									const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
									return (
										<SidebarMenuSubItem key={item.href}>
											<SidebarMenuSubButton asChild isActive={active}>
												<Link href={item.href}>
													{ItemIcon ? <ItemIcon className="size-4" /> : null}
													<span>{item.title}</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									)
								})}
							</SidebarFlatNavGroup>
						</SidebarGroupContent>
					</SidebarGroup>
				)
			})}
		</div>
	)
}

export function DashboardSidebarBrand({
	title,
	subtitle,
	href,
	logo,
}: {
	title: string
	subtitle?: string
	href: string
	logo?: ReactNode
}) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton asChild className="group" size="lg">
					<Link href={href}>
						{logo}
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">{title}</span>
							{subtitle ? (
								<span className="truncate text-muted-foreground text-xs">{subtitle}</span>
							) : null}
						</div>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
