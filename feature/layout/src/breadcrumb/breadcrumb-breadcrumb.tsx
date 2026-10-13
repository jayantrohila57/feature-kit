"use client"

import { CheckIcon, CopyIcon, HomeIcon, LinkIcon, SlashIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Fragment, useState } from "react"
import { toast } from "sonner"

import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/packages/ui/components/breadcrumb"
import { Button } from "@/packages/ui/components/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/packages/ui/components/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/packages/ui/components/tooltip"
import { cn } from "@/packages/ui/lib/utils"

import type { SearchParamsLike } from "./breadcrumb-breadcrumb-utils"
import {
	compressBreadcrumbs,
	generateBreadcrumbs,
	hasHidden,
	isExternalOrPortalHome,
	resolveHomeHref,
} from "./breadcrumb-breadcrumb-utils"
import { slugToTitle } from "./breadcrumb-url-utils"

type BreadcrumbsProps = {
	className?: string | undefined
	/** Optional locale prefix for the home crumb (e.g. `en` → `/en`). */
	locale?: string | undefined
	/** Override pathname for docs and tests; defaults to `usePathname()`. */
	pathname?: string | undefined
	/** Override search params when using `pathname`. */
	searchParams?: SearchParamsLike | null | undefined
	/** `header` hides below `md` (dashboard shell). `inline` always shows (docs, mobile nav). */
	display?: "header" | "inline" | undefined
}

export function Breadcrumbs({
	className,
	locale,
	pathname: pathnameProp,
	searchParams: searchParamsProp,
	display = "header",
}: BreadcrumbsProps) {
	const t = useTranslations()
	const pathnameFromRouter = usePathname()
	const searchParamsFromRouter = useSearchParams()
	const pathname = pathnameProp ?? pathnameFromRouter
	const searchParams = searchParamsProp ?? searchParamsFromRouter
	const homeHref = resolveHomeHref(locale)
	const { visible: breadcrumbs } = compressBreadcrumbs(generateBreadcrumbs(pathname, searchParams))
	const [copied, setCopied] = useState(false)

	const handleCopyUrl = async () => {
		const toastId = toast.loading(t("breadcrumb.copyingUrl"))
		try {
			await navigator.clipboard.writeText(window.location.href)
			setCopied(true)
			window.setTimeout(() => {
				setCopied(false)
			}, 2000)
			toast.success(t("breadcrumb.urlCopied"), { id: toastId })
		} catch {
			toast.error(t("breadcrumb.copyFailed"), { id: toastId })
		}
	}

	const homeLink = isExternalOrPortalHome(homeHref) ? (
		<a href={homeHref}>
			<HomeIcon size={16} aria-hidden="true" />
			<span className="sr-only">{t("common.home")}</span>
		</a>
	) : (
		<Link href={homeHref}>
			<HomeIcon size={16} aria-hidden="true" />
			<span className="sr-only">{t("common.home")}</span>
		</Link>
	)

	return (
		<Breadcrumb
			className={cn(
				"group w-auto flex-row",
				display === "inline" ? "flex" : "hidden md:flex",
			)}>
			<BreadcrumbList className={cn(className)}>
				<BreadcrumbItem>
					<Tooltip>
						<TooltipTrigger asChild>
							<BreadcrumbLink asChild>{homeLink}</BreadcrumbLink>
						</TooltipTrigger>
						<TooltipContent>{t("breadcrumb.portalHome")}</TooltipContent>
					</Tooltip>
				</BreadcrumbItem>

				{breadcrumbs.map((node, index) => {
					const isLast = index === breadcrumbs.length - 1
					const isEllipsis = node.label === "..."

					return (
						<Fragment key={isEllipsis ? "ellipsis" : node.href}>
							<BreadcrumbSeparator>
								<SlashIcon className="mx-1 -rotate-12" />
							</BreadcrumbSeparator>
							<BreadcrumbItem>
								{isEllipsis ? (
									<DropdownMenu>
										<DropdownMenuTrigger className="cursor-pointer rounded">
											<Tooltip>
												<TooltipTrigger asChild>
													<BreadcrumbEllipsis />
												</TooltipTrigger>
												<TooltipContent>{t("breadcrumb.hiddenLinks")}</TooltipContent>
											</Tooltip>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start" className="min-w-[180px]">
											{hasHidden(node) &&
												node.hidden.map((crumb) => (
													<DropdownMenuItem key={crumb.href} asChild>
														<Link href={crumb.href}>{slugToTitle(crumb.label)}</Link>
													</DropdownMenuItem>
												))}
										</DropdownMenuContent>
									</DropdownMenu>
								) : null}

								{!isEllipsis && isLast ? (
									<Tooltip>
										<TooltipTrigger asChild>
											<BreadcrumbPage>{slugToTitle(node.label)}</BreadcrumbPage>
										</TooltipTrigger>
										<TooltipContent>{t("breadcrumb.currentPage")}</TooltipContent>
									</Tooltip>
								) : null}

								{!isEllipsis && !isLast ? (
									<Tooltip>
										<TooltipTrigger asChild>
											<BreadcrumbLink asChild className="underline-offset-4 hover:underline">
												<Link href={node.href}>{slugToTitle(node.label)}</Link>
											</BreadcrumbLink>
										</TooltipTrigger>
										<TooltipContent>{t("breadcrumb.goTo", { label: slugToTitle(node.label) })}</TooltipContent>
									</Tooltip>
								) : null}
							</BreadcrumbItem>
						</Fragment>
					)
				})}

				<BreadcrumbItem className="ml-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={handleCopyUrl}
								aria-label={t("breadcrumb.copyUrl")}>
								{copied ? (
									<CheckIcon
										aria-hidden="true"
										focusable="false"
										className="size-3.5 text-emerald-500"
									/>
								) : (
									<>
										<CopyIcon
											aria-hidden="true"
											focusable="false"
											className="hidden size-3.5 group-hover:block"
										/>
										<LinkIcon
											aria-hidden="true"
											focusable="false"
											className="block size-3.5 group-hover:hidden"
										/>
									</>
								)}
								<span className="sr-only">{t("breadcrumb.copyUrl")}</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>{t("breadcrumb.copyUrl")}</TooltipContent>
					</Tooltip>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	)
}
