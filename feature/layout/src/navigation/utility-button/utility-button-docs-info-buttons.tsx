"use client"

import { BookOpenIcon, CircleHelpIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { memo } from "react"

import { UtilityIconButton } from "./utility-button-utility-icon-button"
import type { UtilityIconButtonProps } from "./utility-button-types"

type DocsIconButtonProps = {
	href: string
	/** Used in `common.docsLink.aria` when set; otherwise a generic docs label. */
	page?: string | undefined
} & Pick<UtilityIconButtonProps, "variant" | "tooltipSide" | "className">

export const DocsIconButton = memo(function DocsIconButton({
	href,
	page,
	variant,
	tooltipSide,
	className,
}: DocsIconButtonProps) {
	const t = useTranslations()
	const pageLabel = page?.replaceAll("-", " ") ?? t("common.docsLink.defaultPage")
	const ariaLabel = t("common.docsLink.aria", { page: pageLabel })

	return (
		<UtilityIconButton
			href={href}
			openInNewTab
			icon={BookOpenIcon}
			label={ariaLabel}
			tooltipLabel={t("common.docsLink.tooltip")}
			tooltipSide={tooltipSide}
			variant={variant}
			className={className}
		/>
	)
})

type InfoIconButtonProps = {
	href: string
	/** Overrides default info tooltip/aria when provided. */
	label?: string | undefined
} & Pick<UtilityIconButtonProps, "variant" | "tooltipSide" | "className" | "openInNewTab">

export const InfoIconButton = memo(function InfoIconButton({
	href,
	label,
	openInNewTab = true,
	variant,
	tooltipSide,
	className,
}: InfoIconButtonProps) {
	const t = useTranslations()
	const resolvedLabel = label ?? t("common.infoLink.label")

	return (
		<UtilityIconButton
			href={href}
			openInNewTab={openInNewTab}
			icon={CircleHelpIcon}
			label={resolvedLabel}
			tooltipSide={tooltipSide}
			variant={variant}
			className={className}
		/>
	)
})
