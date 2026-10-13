import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"

import { BreadcrumbsDemo } from "@/components/docs/breadcrumbs-demo"
import { ChangelogRssLink } from "@/components/docs/changelog-rss-link"
import { DocsCallout } from "@/components/docs/docs-callout"
import { ExamplesGrid } from "@/components/docs/examples-grid"
import { DocsInstall } from "@/components/docs/docs-install"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PlaygroundLink } from "@/components/docs/playground-link"
import { PropsTable } from "@/components/docs/props-table"
import { FormKitBasicExample } from "@/components/examples/form/form-kit-basic-example"
import { FieldKitFiltersExample } from "@/components/examples/form/field-kit-filters-example"
import { FormKitFieldTypesExample } from "@/components/examples/form/form-kit-field-types-example"
import { FormKitValidationExample } from "@/components/examples/form/form-kit-validation-example"
import { TableBasicExample } from "@/components/examples/table/table-basic-example"
import { TableBulkActionsExample } from "@/components/examples/table/table-bulk-actions-example"
import { TableEmptyExample } from "@/components/examples/table/table-empty-example"
import { TableFiltersExample } from "@/components/examples/table/table-filters-example"
import { TableLoadingExample } from "@/components/examples/table/table-loading-example"
import { TableRowActionsExample } from "@/components/examples/table/table-row-actions-example"
import { TableUrlSyncExample } from "@/components/examples/table/table-url-sync-example"
import { AuthForgotPasswordExample } from "@/components/examples/auth/auth-forgot-password-example"
import { AuthHubExample } from "@/components/examples/auth/auth-hub-example"
import { AuthResetPasswordExample } from "@/components/examples/auth/auth-reset-password-example"
import { AuthSignInExample } from "@/components/examples/auth/auth-sign-in-example"
import { AuthSignUpExample } from "@/components/examples/auth/auth-sign-up-example"
import { AuthVerifyEmailExample } from "@/components/examples/auth/auth-verify-email-example"
import { LayoutShellAccountExample } from "@/components/examples/layout/shell/layout-shell-account-example"
import { LayoutShellAuthSplitExample } from "@/components/examples/layout/shell/layout-shell-auth-split-example"
import { LayoutShellBasicExample } from "@/components/examples/layout/shell/layout-shell-basic-example"
import { LayoutShellContentExample } from "@/components/examples/layout/shell/layout-shell-content-example"
import { LayoutShellIconSidebarExample } from "@/components/examples/layout/shell/layout-shell-icon-sidebar-example"
import { LayoutShellMobileExample } from "@/components/examples/layout/shell/layout-shell-mobile-example"
import { LayoutShellNestedNavExample } from "@/components/examples/layout/shell/layout-shell-nested-nav-example"
import { LayoutShellSettingsExample } from "@/components/examples/layout/shell/layout-shell-settings-example"
import { LayoutShellSkeletonExample } from "@/components/examples/layout/shell/layout-shell-skeleton-example"
import { LayoutShellTableExample } from "@/components/examples/layout/shell/layout-shell-table-example"
import { LayoutShellTopNavExample } from "@/components/examples/layout/shell/layout-shell-top-nav-example"
import { ThemeKitExample } from "@/components/examples/theme/theme-kit-example"
import { UtilityButtonsDemo } from "@/components/examples/utility-buttons-demo"
import { UploaderBasicExample } from "@/components/examples/uploader/uploader-basic-example"

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		PlaygroundLink,
		ComponentPreview,
		PropsTable,
		DocsInstall,
		DocsCallout,
		ExamplesGrid,
		ChangelogRssLink,
		BreadcrumbsDemo,
		FormKitBasicExample,
		FormKitFieldTypesExample,
		FormKitValidationExample,
		FieldKitFiltersExample,
		TableBasicExample,
		TableEmptyExample,
		TableLoadingExample,
		TableFiltersExample,
		TableBulkActionsExample,
		TableRowActionsExample,
		TableUrlSyncExample,
		UtilityButtonsDemo,
		UploaderBasicExample,
		LayoutShellBasicExample,
		LayoutShellIconSidebarExample,
		LayoutShellNestedNavExample,
		LayoutShellMobileExample,
		LayoutShellAccountExample,
		LayoutShellTopNavExample,
		LayoutShellAuthSplitExample,
		LayoutShellSettingsExample,
		LayoutShellContentExample,
		LayoutShellSkeletonExample,
		LayoutShellTableExample,
		AuthHubExample,
		AuthSignInExample,
		AuthSignUpExample,
		AuthForgotPasswordExample,
		AuthResetPasswordExample,
		AuthVerifyEmailExample,
		ThemeKitExample,
		...components,
	} satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
