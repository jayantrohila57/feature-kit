"use client"

import dynamic from "next/dynamic"

import { GoBackButtonSkeleton } from "./back-button-back-button-skeleton"

export const GoBackButton = dynamic(
	() => import("./back-button-back-button").then((mod) => mod.GoBackButton),
	{
		ssr: false,
		loading: () => <GoBackButtonSkeleton />,
	},
)

export type { GoBackButtonProps } from "./back-button-back-button"
