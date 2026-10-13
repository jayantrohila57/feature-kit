import { Bell, BookOpen, CreditCard, LayoutGrid, Shield, Table2, User, Users } from "lucide-react"

import type { DashboardNavGroup } from "layout"

export const workspaceNavGroups: DashboardNavGroup[] = [
	{
		label: "Workspace",
		icon: LayoutGrid,
		defaultOpen: true,
		items: [
			{ title: "Overview", href: "/docs/examples/layout/shell-basic", icon: LayoutGrid },
			{ title: "Accounts", href: "/docs/examples/layout/shell-nested-nav", icon: Users },
			{ title: "Reports", href: "/docs/examples/layout/shell-table", icon: Table2 },
		],
	},
	{
		label: "Resources",
		icon: BookOpen,
		items: [
			{ title: "Documentation", href: "/docs", icon: BookOpen },
			{ title: "Notifications", href: "/docs/examples/layout/shell-settings", icon: Bell },
		],
	},
]

export const settingsNav = [
	{ id: "profile", title: "Profile", href: "/docs/examples/layout/shell-settings", icon: User },
	{ id: "billing", title: "Billing", href: "/docs/examples/layout/shell-settings#billing", icon: CreditCard },
	{ id: "security", title: "Security", href: "/docs/examples/layout/shell-settings#security", icon: Shield },
]
