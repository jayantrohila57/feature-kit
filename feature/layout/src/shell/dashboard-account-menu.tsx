"use client"

import { ChevronsUpDown } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/packages/ui/components/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/packages/ui/components/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/packages/ui/components/sidebar"

export type DashboardAccountUser = {
	name: string
	email: string
	image?: string | null
}

export function DashboardAccountMenu({
	user,
	menuItems,
	signOutItem,
}: {
	user: DashboardAccountUser
	menuItems?: ReactNode
	signOutItem?: ReactNode
}) {
	const initials = user.name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase()

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							size="lg">
							<Avatar className="size-8 rounded-lg">
								<AvatarImage alt={user.name} src={user.image ?? undefined} />
								<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="truncate text-xs">{user.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="min-w-56 rounded-lg"
						side="bottom"
						sideOffset={4}>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="size-8 rounded-lg">
									<AvatarImage alt={user.name} src={user.image ?? undefined} />
									<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						{menuItems ? (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>{menuItems}</DropdownMenuGroup>
							</>
						) : null}
						{signOutItem ? (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>{signOutItem}</DropdownMenuGroup>
							</>
						) : null}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

export function DashboardAccountMenuItem({
	children,
	...props
}: ComponentProps<typeof DropdownMenuItem>) {
	return (
		<DropdownMenuItem className="cursor-pointer" {...props}>
			{children}
		</DropdownMenuItem>
	)
}
