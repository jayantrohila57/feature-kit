"use client"

import { Breadcrumbs, BreadcrumbsSkeleton } from "layout"
import { DashboardHeader } from "layout/shell"

import { BreadcrumbDocFrame } from "@/components/examples/breadcrumb/breadcrumb-doc-frame"
import { LayoutShellFrame } from "@/components/examples/layout/shell/layout-shell-frame"
import Shell from "@/packages/ui/components/shell"
import { SidebarProvider } from "@/packages/ui/components/sidebar"
const mockSearch = (name: string) => ({
	get: (key: string) => (key === "name" ? name : null),
})

export function BreadcrumbRouteShellExample() {
	return (
		<LayoutShellFrame className="h-[220px]">
			<SidebarProvider>
				<Shell className="flex h-full min-h-0 flex-col">
					<DashboardHeader actions={<span className="text-muted-foreground text-xs">Actions</span>} />
					<Shell.Main className="flex flex-1 items-center justify-center p-4 text-muted-foreground text-sm">
						Route-derived crumbs in the shell header (current docs path).
					</Shell.Main>
				</Shell>
			</SidebarProvider>
		</LayoutShellFrame>
	)
}

export const breadcrumbRouteShellCode = `import { DashboardHeader } from "layout/shell"

<DashboardHeader
  showBreadcrumbs
  actions={<ThemeSelector />}
/>`

export function BreadcrumbAutoCompressExample() {
	return (
		<BreadcrumbDocFrame>
			<Breadcrumbs
				display="inline"
				pathname="/org/teams/design/projects/website/settings/members"
				searchParams={null}
			/>
		</BreadcrumbDocFrame>
	)
}

export const breadcrumbAutoCompressCode = `// layout compresses trails longer than three segments into an ellipsis menu
<Breadcrumbs pathname={pathname} searchParams={searchParams} />`

export function BreadcrumbDynamicSegmentExample() {
	return (
		<BreadcrumbDocFrame>
			<Breadcrumbs
				display="inline"
				pathname="/accounts/acme-corp-42/settings"
				searchParams={mockSearch("Acme Corp")}
			/>
		</BreadcrumbDocFrame>
	)
}

export const breadcrumbDynamicSegmentCode = `// /accounts/[id]/settings?name=Acme+Corp
<Breadcrumbs
  pathname="/accounts/acme-corp-42/settings"
  searchParams={searchParams}
/>`

export function BreadcrumbDynamicLoadingExample() {
	return (
		<BreadcrumbDocFrame compact>
			<div className="flex items-center gap-3">
				<BreadcrumbsSkeleton />
				<span className="text-muted-foreground text-xs">Loading account name…</span>
			</div>
		</BreadcrumbDocFrame>
	)
}

export const breadcrumbDynamicLoadingCode = `import { BreadcrumbsSkeleton } from "layout"

{isLoading ? <BreadcrumbsSkeleton /> : <Breadcrumbs pathname={pathname} searchParams={searchParams} />}`

export function BreadcrumbI18nExample() {
	return (
		<BreadcrumbDocFrame>
			<Breadcrumbs display="inline" locale="en" pathname="/en/dashboard/reports" searchParams={null} />
		</BreadcrumbDocFrame>
	)
}

export const breadcrumbI18nCode = `// next-intl: home → /en, segments skip the locale prefix in labels
<Breadcrumbs locale={locale} pathname={pathname} searchParams={searchParams} />`

export function BreadcrumbSettingsNestedExample() {
	return (
		<BreadcrumbDocFrame>
			<Breadcrumbs display="inline" pathname="/settings/organization/billing/invoices" searchParams={null} />
		</BreadcrumbDocFrame>
	)
}

export const breadcrumbSettingsNestedCode = `<Breadcrumbs pathname="/settings/organization/billing/invoices" />`

export function BreadcrumbDataTableFlowExample() {
	const steps = [
		{ label: "List", path: "/customers" },
		{ label: "Detail", path: "/customers/cust_8f2a?name=Northwind+Traders" },
		{ label: "Edit", path: "/customers/cust_8f2a/edit?name=Northwind+Traders" },
	] as const

	return (
		<div className="grid gap-3 sm:grid-cols-3">
			{steps.map((step) => (
				<div key={step.path} className="space-y-2">
					<p className="font-medium text-muted-foreground text-xs">{step.label}</p>
					<BreadcrumbDocFrame compact>
						<Breadcrumbs
							display="inline"
							pathname={step.path}
							searchParams={mockSearch("Northwind Traders")}
						/>
					</BreadcrumbDocFrame>
				</div>
			))}
		</div>
	)
}

export const breadcrumbDataTableFlowCode = `// List → /customers
// Detail → /customers/[id]?name=...
// Edit → /customers/[id]/edit?name=...`

export function BreadcrumbAuthHiddenExample() {
	return (
		<LayoutShellFrame className="h-[200px]">
			<SidebarProvider>
				<Shell className="flex h-full min-h-0 flex-col">
					<DashboardHeader showBreadcrumbs={false} />
					<Shell.Main className="flex flex-1 items-center justify-center p-4 text-muted-foreground text-sm">
						Auth routes: no breadcrumb trail in the header.
					</Shell.Main>
				</Shell>
			</SidebarProvider>
		</LayoutShellFrame>
	)
}

export const breadcrumbAuthHiddenCode = `<DashboardHeader showBreadcrumbs={false} />`

export function BreadcrumbMobileNavExample() {
	return (
		<BreadcrumbDocFrame className="max-w-sm bg-background">
			<div className="flex items-center gap-2 border-b border-border pb-3">
				<div className="size-8 shrink-0 rounded-md border bg-muted/50" aria-hidden />
				<Breadcrumbs
					className="min-w-0 flex-1"
					display="inline"
					pathname="/projects/design-system/components/breadcrumb"
					searchParams={null}
				/>
			</div>
			<p className="pt-2 text-muted-foreground text-xs">
				Mobile sheet header: crumbs use <code className="text-foreground">min-w-0</code> and truncate inside the
				nav bar.
			</p>
		</BreadcrumbDocFrame>
	)
}

export const breadcrumbMobileNavCode = `<Breadcrumbs className="flex min-w-0 flex-1 md:hidden" pathname={pathname} />`

export function BreadcrumbLivePathExample() {
	return (
		<BreadcrumbDocFrame>
			<Breadcrumbs display="inline" />
		</BreadcrumbDocFrame>
	)
}

export const breadcrumbLivePathCode = `import { Breadcrumbs } from "layout"

<Breadcrumbs />`
