export type BlockSlug =
	| "dashboard-overview"
	| "data-table-crud"
	| "detail-page"
	| "settings-area"
	| "auth-pages"
	| "uploader-import"
	| "app-states"
	| "top-nav-app"

export type BlockDefinition = {
	slug: BlockSlug
	title: string
	description: string
	registryItem: string
	packages: string[]
	importExample: string
	code: string
	tags: string[]
}

export const BLOCKS: BlockDefinition[] = [
	{
		slug: "dashboard-overview",
		title: "Dashboard overview",
		description: "Shell, stat cards, activity chart, and a recent accounts table.",
		registryItem: "blocks-dashboard-overview",
		packages: ["layout", "data-table", "theme", "ui"],
		importExample: `import { DashboardOverviewBlock } from "@/components/blocks/dashboard-overview"`,
		tags: ["dashboard", "shell", "table"],
		code: `"use client"

import { ContentPageHeader, DashboardShell } from "layout"
import { DataTable } from "data-table"

export function DashboardOverviewPage() {
  return (
    <DashboardShell {...shellSlots}>
      <ContentPageHeader title="Overview" description="KPIs and recent activity." />
      <StatsRow />
      <OverviewChart />
      <RecentAccountsTable />
    </DashboardShell>
  )
}`,
	},
	{
		slug: "data-table-crud",
		title: "Data table CRUD",
		description: "Filtered list, row actions, and create/edit in a sheet.",
		registryItem: "blocks-data-table-crud",
		packages: ["layout", "data-table", "form", "theme", "ui"],
		importExample: `import { DataTableCrudBlock } from "@/components/blocks/data-table-crud"`,
		tags: ["table", "crud", "sheet"],
		code: `"use client"

import { DashboardShell, ContentPageHeader } from "layout"
import { DataTable } from "data-table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { FormKit } from "form"

export function AccountsCrudPage() {
  const [open, setOpen] = useState(false)
  return (
    <DashboardShell {...shellSlots}>
      <ContentPageHeader title="Accounts" actions={<Button onClick={() => setOpen(true)}>New</Button>} />
      <DataTable columns={columns} data={rows} />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent><FormKit schema={schema}>...</FormKit></SheetContent>
      </Sheet>
    </DashboardShell>
  )
}`,
	},
	{
		slug: "detail-page",
		title: "Detail page",
		description: "Route breadcrumbs, title header, and tabbed sections.",
		registryItem: "blocks-detail-page",
		packages: ["layout", "theme", "ui"],
		importExample: `import { DetailPageBlock } from "@/components/blocks/detail-page"`,
		tags: ["detail", "tabs", "breadcrumb"],
		code: `"use client"

import { ContentPageHeader, DashboardShell } from "layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AccountDetailPage() {
  return (
    <DashboardShell {...shellSlots}>
      <ContentPageHeader title="Acme Corp" description="Customer account" />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">...</TabsContent>
      </Tabs>
    </DashboardShell>
  )
}`,
	},
	{
		slug: "settings-area",
		title: "Settings area",
		description: "Secondary nav, profile form, preferences, and theme selector.",
		registryItem: "blocks-settings-area",
		packages: ["layout", "theme", "preferences", "ui"],
		importExample: `import { SettingsAreaBlock } from "@/components/blocks/settings-area"`,
		tags: ["settings", "theme"],
		code: `import { DashboardShell, SettingsLayout, FormSection } from "layout"
import { ThemeSelector } from "theme"

export function SettingsPage() {
  return (
    <DashboardShell {...shellSlots}>
      <SettingsLayout navigation={nav} activeId="profile" title="Settings">
        <FormSection title="Profile">...</FormSection>
        <ThemeSelector />
      </SettingsLayout>
    </DashboardShell>
  )
}`,
	},
	{
		slug: "auth-pages",
		title: "Auth pages",
		description: "Sign-in, sign-up, forgot password, and split-screen layouts.",
		registryItem: "blocks-auth-pages",
		packages: ["layout", "auth", "form", "ui"],
		importExample: `import { AuthPagesBlock } from "@/components/blocks/auth-pages"`,
		tags: ["auth"],
		code: `import { AuthSplitShell } from "layout"
import { AuthCardLayout, SignInForm, SignUpForm, ForgotPasswordForm } from "auth"`,
	},
	{
		slug: "uploader-import",
		title: "Uploader / import",
		description: "Full-page import flow with template download and validation.",
		registryItem: "blocks-uploader-import",
		packages: ["layout", "uploader", "form", "ui"],
		importExample: `import { UploaderImportBlock } from "@/components/blocks/uploader-import"`,
		tags: ["uploader", "import"],
		code: `import { DashboardShell, ContentPageHeader } from "layout"
import { CommonUploaderButton } from "uploader"`,
	},
	{
		slug: "app-states",
		title: "Empty, loading & error",
		description: "Dashboard screens for empty data, pending loads, and failures.",
		registryItem: "blocks-app-states",
		packages: ["layout", "data-table", "ui"],
		importExample: `import { AppStatesBlock } from "@/components/blocks/app-states"`,
		tags: ["states", "table"],
		code: `import { DataTable } from "data-table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"`,
	},
	{
		slug: "top-nav-app",
		title: "Top-nav-only app",
		description: "Application chrome without a sidebar — horizontal primary nav.",
		registryItem: "blocks-top-nav-app",
		packages: ["layout", "theme", "ui"],
		importExample: `import { TopNavAppBlock } from "@/components/blocks/top-nav-app"`,
		tags: ["navigation", "top-nav"],
		code: `import { DashboardShell, ContentPageHeader } from "layout"

<DashboardShell showSidebar={false} topNavigation={<PrimaryNav />}>
  <ContentPageHeader title="Projects" />
</DashboardShell>`,
	},
]

export const BLOCK_BY_SLUG = Object.fromEntries(BLOCKS.map((b) => [b.slug, b])) as Record<
	BlockSlug,
	BlockDefinition
>

export function getBlockPreviewPath(slug: BlockSlug) {
	return `/blocks/preview/${slug}`
}
