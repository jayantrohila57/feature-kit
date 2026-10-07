import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"

import { BreadcrumbsDemo } from "@/components/docs/breadcrumbs-demo"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PlaygroundLink } from "@/components/docs/playground-link"
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
import { UtilityButtonsDemo } from "@/components/examples/utility-buttons-demo"
import { UploaderBasicExample } from "@/components/examples/uploader/uploader-basic-example"

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		PlaygroundLink,
		ComponentPreview,
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
		...components,
	} satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
