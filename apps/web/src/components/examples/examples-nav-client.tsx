"use client"

import { usePathname } from "next/navigation"

import { ExamplesNav } from "./examples-nav"

export function ExamplesNavClient() {
	const pathname = usePathname()
	return <ExamplesNav activeHref={pathname} />
}
