import type { JSX } from "react"

import type { BlockSlug } from "@/lib/blocks/catalog"

import { AppStatesBlock } from "./pages/app-states-block"
import { AuthPagesBlock } from "./pages/auth-pages-block"
import { DashboardOverviewBlock } from "./pages/dashboard-overview-block"
import { DataTableCrudBlock } from "./pages/data-table-crud-block"
import { DetailPageBlock } from "./pages/detail-page-block"
import { SettingsAreaBlock } from "./pages/settings-area-block"
import { TopNavAppBlock } from "./pages/top-nav-app-block"
import { UploaderImportBlock } from "./pages/uploader-import-block"

export const BLOCK_PREVIEW_COMPONENTS: Record<BlockSlug, () => JSX.Element> = {
	"dashboard-overview": DashboardOverviewBlock,
	"data-table-crud": DataTableCrudBlock,
	"detail-page": DetailPageBlock,
	"settings-area": SettingsAreaBlock,
	"auth-pages": AuthPagesBlock,
	"uploader-import": UploaderImportBlock,
	"app-states": AppStatesBlock,
	"top-nav-app": TopNavAppBlock,
}
