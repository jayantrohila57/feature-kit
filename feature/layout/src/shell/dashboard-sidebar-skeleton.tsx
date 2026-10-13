import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuSkeleton,
} from "@/packages/ui/components/sidebar"

export function DashboardSidebarNavSkeleton({ groups = 2 }: { groups?: number }) {
	return (
		<>
			{Array.from({ length: groups }).map((_, groupIndex) => (
				<SidebarGroup key={groupIndex}>
					<SidebarGroupLabel>
						<span className="sr-only">Loading navigation</span>
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{Array.from({ length: 3 }).map((__, itemIndex) => (
								<SidebarMenuItem key={itemIndex}>
									<SidebarMenuSkeleton showIcon />
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			))}
		</>
	)
}
