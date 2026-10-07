"use client"

import dynamic from "next/dynamic"

import { BreadcrumbsSkeleton } from "./breadcrumb-breadcrumb-skeleton"

export const Breadcrumbs = dynamic(() => import("./breadcrumb-breadcrumb").then((mod) => mod.Breadcrumbs), {
	ssr: false,
	loading: () => <BreadcrumbsSkeleton />,
})
