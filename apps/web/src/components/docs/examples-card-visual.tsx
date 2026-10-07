import type { ReactNode } from "react"

import type { ExampleVisualId } from "@/components/docs/examples-index-data"
import { cn } from "@/packages/ui/lib/utils"

function MiniChrome({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				"pointer-events-none relative min-h-[5.5rem] overflow-hidden border-b bg-muted/30",
				className,
			)}>
			<div
				aria-hidden
				className="absolute inset-0 bg-[linear-gradient(to_right,--theme(--color-foreground/.04)_1px,transparent_1px),linear-gradient(to_bottom,--theme(--color-foreground/.04)_1px,transparent_1px)] bg-size-[0.75rem_0.75rem]"
			/>
			<div className="relative flex h-full min-h-[5.5rem] items-center justify-center p-3">{children}</div>
		</div>
	)
}

function FormBasicVisual() {
	return (
		<MiniChrome>
			<div className="w-full max-w-[10rem] space-y-2 rounded-md border bg-card/95 p-2 ring-1 ring-foreground/5">
				<div className="h-1.5 w-2/3 rounded-xs bg-muted-foreground/25" />
				<div className="h-4 w-full rounded-xs border bg-background" />
				<div className="flex justify-end">
					<div className="h-4 w-10 rounded-xs bg-primary/80" />
				</div>
			</div>
		</MiniChrome>
	)
}

function FormFieldTypesVisual() {
	return (
		<MiniChrome>
			<div className="flex w-full max-w-[11rem] flex-col gap-1.5">
				<div className="h-3 w-full rounded-xs border bg-background" />
				<div className="flex gap-1">
					<div className="h-3 flex-1 rounded-xs border bg-background" />
					<div className="size-3 shrink-0 rounded-xs border bg-muted/50" />
				</div>
				<div className="flex items-center gap-1.5">
					<div className="size-2.5 rounded-xs border border-primary/40 bg-primary/15" />
					<div className="h-1.5 flex-1 rounded-xs bg-muted-foreground/20" />
				</div>
			</div>
		</MiniChrome>
	)
}

function FormValidationVisual() {
	return (
		<MiniChrome>
			<div className="w-full max-w-[10rem] space-y-1 rounded-md border border-destructive/30 bg-card/95 p-2 ring-1 ring-destructive/10">
				<div className="h-4 w-full rounded-xs border border-destructive/40 bg-background" />
				<p className="text-[0.45rem] text-destructive">Invalid email format</p>
			</div>
		</MiniChrome>
	)
}

function FormFieldKitVisual() {
	return (
		<MiniChrome>
			<div className="flex w-full max-w-[11rem] gap-1.5">
				<div className="h-6 flex-1 rounded-xs border bg-card/95" />
				<div className="h-6 w-8 rounded-xs border bg-card/95" />
				<div className="h-6 w-6 rounded-xs bg-muted/60" />
			</div>
		</MiniChrome>
	)
}

function TableBasicVisual() {
	return (
		<MiniChrome>
			<div className="w-full max-w-[11rem] overflow-hidden rounded-md border bg-card/95 ring-1 ring-foreground/5">
				<div className="grid grid-cols-3 gap-px border-b bg-muted/40 p-1">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-1 rounded-xs bg-foreground/15" />
					))}
				</div>
				{[1, 2, 3].map((row) => (
					<div key={row} className="grid grid-cols-3 gap-1 border-b border-border/50 p-1 last:border-0">
						<div className="size-2 rounded-xs border border-muted-foreground/30" />
						<div className="h-1.5 rounded-xs bg-muted-foreground/15" />
						<div className="h-1.5 rounded-xs bg-muted-foreground/10" />
					</div>
				))}
			</div>
		</MiniChrome>
	)
}

function TableEmptyVisual() {
	return (
		<MiniChrome>
			<div className="flex w-full max-w-[9rem] flex-col items-center gap-1 rounded-md border border-dashed border-muted-foreground/30 bg-card/80 px-3 py-4">
				<div className="size-4 rounded-full bg-muted/60" />
				<div className="h-1 w-12 rounded-xs bg-muted-foreground/20" />
			</div>
		</MiniChrome>
	)
}

function TableLoadingVisual() {
	return (
		<MiniChrome>
			<div className="w-full max-w-[11rem] space-y-1.5 rounded-md border bg-card/95 p-2">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="h-2 animate-pulse rounded-xs bg-muted-foreground/15" />
				))}
			</div>
		</MiniChrome>
	)
}

function TableFiltersVisual() {
	return (
		<MiniChrome>
			<div className="w-full max-w-[11rem] space-y-1.5">
				<div className="flex gap-1">
					<div className="h-5 flex-1 rounded-xs border bg-card/95" />
					<div className="h-5 w-5 rounded-xs border bg-muted/40" />
				</div>
				<div className="h-8 rounded-md border bg-card/90" />
			</div>
		</MiniChrome>
	)
}

function TableBulkVisual() {
	return (
		<MiniChrome>
			<div className="w-full max-w-[11rem] space-y-1">
				<div className="flex items-center gap-1.5 rounded-xs bg-primary/10 px-2 py-1">
					<div className="size-2 rounded-xs border border-primary/50 bg-primary/20" />
					<div className="h-1 flex-1 rounded-xs bg-primary/30" />
				</div>
				<div className="h-6 rounded-md border bg-card/90" />
			</div>
		</MiniChrome>
	)
}

function TableRowActionsVisual() {
	return (
		<MiniChrome>
			<div className="flex w-full max-w-[10rem] items-center justify-between rounded-md border bg-card/95 px-2 py-1.5">
				<div className="h-1.5 flex-1 rounded-xs bg-muted-foreground/15" />
				<div className="flex flex-col gap-0.5">
					{[1, 2, 3].map((i) => (
						<div key={i} className="size-0.5 rounded-full bg-muted-foreground/40" />
					))}
				</div>
			</div>
		</MiniChrome>
	)
}

function TableUrlSyncVisual() {
	return (
		<MiniChrome>
			<div className="w-full max-w-[11rem] rounded-md border bg-card/95 px-2 py-1.5 font-mono text-[0.4rem] text-muted-foreground">
				<span className="text-foreground">?page=2</span>
				<span>&amp;sort=name</span>
				<span>&amp;q=acme</span>
			</div>
		</MiniChrome>
	)
}

function LayoutBreadcrumbsVisual() {
	return (
		<MiniChrome>
			<div className="flex w-full max-w-[11rem] items-center gap-1 text-[0.5rem] text-muted-foreground">
				<span>Home</span>
				<span>/</span>
				<span>Settings</span>
				<span>/</span>
				<span className="text-foreground">Users</span>
			</div>
		</MiniChrome>
	)
}

function LayoutUtilityVisual() {
	return (
		<MiniChrome>
			<div className="flex gap-1">
				{[1, 2, 3].map((i) => (
					<div key={i} className="size-6 rounded-md border bg-card/95 ring-1 ring-foreground/5" />
				))}
			</div>
		</MiniChrome>
	)
}

function UploaderBasicVisual() {
	return (
		<MiniChrome>
			<div className="flex w-full max-w-[11rem] items-center gap-2">
				<div className="flex flex-1 flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/35 bg-background/80 py-3">
					<div className="mb-0.5 size-3 rounded-xs bg-muted-foreground/25" />
					<div className="h-1 w-8 rounded-xs bg-muted-foreground/15" />
				</div>
				<div className="h-1 w-6 rounded-xs bg-primary/40" />
			</div>
		</MiniChrome>
	)
}

const VISUALS: Record<ExampleVisualId, () => ReactNode> = {
	"form-basic": FormBasicVisual,
	"form-field-types": FormFieldTypesVisual,
	"form-validation": FormValidationVisual,
	"form-field-kit": FormFieldKitVisual,
	"table-basic": TableBasicVisual,
	"table-empty": TableEmptyVisual,
	"table-loading": TableLoadingVisual,
	"table-filters": TableFiltersVisual,
	"table-bulk": TableBulkVisual,
	"table-row-actions": TableRowActionsVisual,
	"table-url-sync": TableUrlSyncVisual,
	"layout-breadcrumbs": LayoutBreadcrumbsVisual,
	"layout-utility": LayoutUtilityVisual,
	"uploader-basic": UploaderBasicVisual,
}

export function ExamplesCardVisual({ visual }: { visual: ExampleVisualId }) {
	const Visual = VISUALS[visual]
	return <Visual />
}
