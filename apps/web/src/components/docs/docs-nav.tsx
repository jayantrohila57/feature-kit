"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { docsNavItems, isDocsNavActive } from "@/lib/docs-nav"

export function DocsNav() {
	const pathname = usePathname()

	return (
		<nav
			aria-label="Documentation"
			className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-6 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{docsNavItems.map((item) => {
				const active = isDocsNavActive(item.href, pathname)
				return (
					<Link
						key={item.href}
						className={
							active
								? "shrink-0 rounded-md bg-muted px-3 py-1.5 font-medium text-foreground text-sm"
								: "shrink-0 rounded-md px-3 py-1.5 text-muted-foreground text-sm hover:bg-muted/60 hover:text-foreground"
						}
						href={item.href}>
						{item.title}
					</Link>
				)
			})}
		</nav>
	)
}
