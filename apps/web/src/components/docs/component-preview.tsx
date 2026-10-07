"use client"

import type { ReactNode } from "react"
import { useState } from "react"

import { cn } from "@/packages/ui/lib/utils"

type ComponentPreviewProps = {
	children: ReactNode
	code?: string
	className?: string
	align?: "start" | "center" | "end"
}

export function ComponentPreview({
	children,
	code,
	className,
	align = "start",
}: ComponentPreviewProps) {
	const [tab, setTab] = useState<"preview" | "code">("preview")
	const showTabs = Boolean(code)

	return (
		<div className={cn("not-prose my-6 overflow-hidden rounded-xl border bg-card", className)}>
			{showTabs ? (
				<div className="flex border-b">
					<button
						type="button"
						className={cn(
							"px-4 py-2 text-sm transition-colors",
							tab === "preview"
								? "border-b-2 border-primary font-medium text-foreground"
								: "text-muted-foreground hover:text-foreground",
						)}
						onClick={() => setTab("preview")}>
						Preview
					</button>
					<button
						type="button"
						className={cn(
							"px-4 py-2 text-sm transition-colors",
							tab === "code"
								? "border-b-2 border-primary font-medium text-foreground"
								: "text-muted-foreground hover:text-foreground",
						)}
						onClick={() => setTab("code")}>
						Code
					</button>
				</div>
			) : null}
			{!showTabs || tab === "preview" ? (
				<div
					className={cn(
						"flex min-h-[12rem] w-full p-6",
						align === "center" && "items-center justify-center",
						align === "end" && "items-end justify-end",
						align === "start" && "items-start justify-start",
					)}>
					<div className="w-full min-w-0">{children}</div>
				</div>
			) : (
				<pre className="max-h-[28rem] overflow-x-auto overflow-y-auto p-4 text-xs leading-relaxed whitespace-pre-wrap break-words">
					<code className="whitespace-pre-wrap break-words">{code}</code>
				</pre>
			)}
		</div>
	)
}
