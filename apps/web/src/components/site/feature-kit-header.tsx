"use client"

import { BookOpen } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type ComponentProps, type ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { MenuToggleIcon } from "@/components/site/menu-toggle-icon"
import { useScroll } from "@/hooks/use-scroll"
import { exampleFeaturedLinks, exampleQuickLinks, githubUrl, kitLinks, type SiteNavLink } from "@/lib/site-nav"
import { Button } from "@/packages/ui/components/button"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/packages/ui/components/navigation-menu"
import { cn } from "@/packages/ui/lib/utils"
import { FullSearchTrigger, SearchTrigger } from "fumadocs-ui/layouts/shared/slots/search-trigger"
import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch"

type FeatureKitHeaderProps = {
	className?: string
	leading?: ReactNode
	actions?: ReactNode
}

export function FeatureKitHeader({ className, leading, actions }: FeatureKitHeaderProps) {
	const [open, setOpen] = useState(false)
	const scrolled = useScroll(10)
	const pathname = usePathname()

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : ""
		return () => {
			document.body.style.overflow = ""
		}
	}, [open])

	useEffect(() => {
		setOpen(false)
	}, [pathname])

	return (
		<header
			data-transparent={scrolled ? "false" : "true"}
			className={cn(
				"sticky top-0 z-50 w-full border-b transition-colors",
				scrolled
					? "border-border bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/50"
					: "border-transparent",
				className,
			)}>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<div className="flex min-w-0 flex-1 items-center gap-3">
					{leading}
					<Link
						className="inline-flex items-center gap-2 rounded-md font-semibold text-sm tracking-tight hover:bg-accent/60"
						href="/">
						<span className="flex size-7 items-center justify-center rounded-md border bg-muted/60">
							<BookOpen className="size-4" />
						</span>
						Feature Kit
					</Link>
				</div>

				<NavigationMenu className="hidden flex-1 justify-center md:flex">
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuTrigger className="bg-transparent">Kits</NavigationMenuTrigger>
							<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 dark:bg-background">
								<ul className="grid w-lg grid-cols-2 gap-2 rounded-md border bg-popover p-2 shadow">
									{kitLinks.map((item) => (
										<li key={item.href}>
											<NavListItem {...item} />
										</li>
									))}
								</ul>
								<div className="p-2">
									<p className="text-muted-foreground text-sm">
										New here?{" "}
										<Link className="font-medium text-foreground hover:underline" href="/docs/getting-started">
											Read getting started
										</Link>
									</p>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuTrigger className="bg-transparent">Examples</NavigationMenuTrigger>
							<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 pb-1.5 dark:bg-background">
								<div className="grid w-lg grid-cols-2 gap-2">
									<ul className="space-y-2 rounded-md border bg-popover p-2 shadow">
										{exampleFeaturedLinks.map((item) => (
											<li key={item.href}>
												<NavListItem {...item} />
											</li>
										))}
									</ul>
									<ul className="space-y-2 p-3">
										{exampleQuickLinks.map((item) => (
											<li key={item.href}>
												<NavigationMenuLink asChild className="flex-row items-center gap-x-2">
													<Link className="flex items-center gap-2" href={item.href}>
														<item.icon className="size-4 text-foreground" />
														<span className="font-medium">{item.title}</span>
													</Link>
												</NavigationMenuLink>
											</li>
										))}
									</ul>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink asChild>
								<Link
									className={cn(
										"rounded-md px-4 py-2 text-sm hover:bg-accent",
										isDocsActive(pathname) && "bg-muted font-medium",
									)}
									href="/docs">
									Docs
								</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				<div className="hidden flex-1 items-center justify-end gap-2 md:flex">
					{actions ?? <DefaultHeaderActions />}
				</div>

				<Button
					aria-controls="mobile-menu"
					aria-expanded={open}
					aria-label="Toggle menu"
					className="md:hidden"
					onClick={() => setOpen((value) => !value)}
					size="icon"
					variant="outline">
					<MenuToggleIcon className="size-5" duration={300} open={open} />
				</Button>
			</nav>

			<MobileMenu className="flex flex-col justify-between gap-2 overflow-y-auto" open={open}>
				<div className="flex w-full flex-col gap-y-2">
					<span className="text-sm">Kits</span>
					{kitLinks.map((link) => (
						<MobileNavLink key={link.href} {...link} />
					))}
					<span className="text-sm">Examples</span>
					{exampleFeaturedLinks.map((link) => (
						<MobileNavLink key={link.href} {...link} />
					))}
					{exampleQuickLinks.map((link) => (
						<MobileNavLink key={link.href} {...link} compact />
					))}
					<Link className="rounded-md px-2 py-2 font-medium text-sm hover:bg-accent" href="/docs">
						Docs
					</Link>
					<Link className="rounded-md px-2 py-2 font-medium text-sm hover:bg-accent" href="/docs/examples">
						All examples
					</Link>
				</div>
				<div className="flex flex-col gap-2">
					<Button asChild className="w-full bg-transparent" variant="outline">
						<a href={githubUrl} rel="noreferrer noopener" target="_blank">GitHub</a>
					</Button>
					<Button asChild className="w-full">
						<Link href="/docs">Docs</Link>
					</Button>
				</div>
			</MobileMenu>
		</header>
	)
}

function isDocsActive(pathname: string) {
	return pathname === "/docs" || pathname.startsWith("/docs/")
}

function DefaultHeaderActions() {
	return (
		<>
			<FullSearchTrigger hideIfDisabled className="hidden max-w-[200px] bg-muted/60 sm:inline-flex" />
			<SearchTrigger hideIfDisabled className="md:hidden" />
			<ThemeSwitch />
			<HeaderCtas />
		</>
	)
}

export function HeaderCtas() {
	return (
		<>
			<Button asChild size="sm" variant="outline">
				<a href={githubUrl} rel="noreferrer noopener" target="_blank">GitHub</a>
			</Button>
			<Button asChild size="sm">
				<Link href="/docs">Docs</Link>
			</Button>
		</>
	)
}

type MobileMenuProps = ComponentProps<"div"> & {
	open: boolean
}

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === "undefined") {
		return null
	}

	return createPortal(
		<div
			className="fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/50 md:hidden"
			id="mobile-menu">
			<div
				className={cn(
					"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
					"size-full p-4",
					className,
				)}
				data-slot={open ? "open" : "closed"}
				{...props}>
				{children}
			</div>
		</div>,
		document.body,
	)
}

function NavListItem({
	title,
	description,
	icon: Icon,
	href,
	className,
	...props
}: ComponentProps<typeof NavigationMenuLink> & SiteNavLink) {
	return (
		<NavigationMenuLink asChild className={cn("w-full flex-row gap-x-2", className)} {...props}>
			<Link className="flex w-full items-center gap-3 rounded-md p-1 hover:bg-accent/60" href={href}>
				<NavLinkIcon compact={false} icon={Icon} />
				<NavLinkText description={description} title={title} />
			</Link>
		</NavigationMenuLink>
	)
}

function MobileNavLink({ title, description, icon: Icon, href, compact = false }: SiteNavLink & { compact?: boolean }) {
	return (
		<Link className="flex w-full items-center gap-3 rounded-md p-1 hover:bg-accent/60" href={href}>
			<NavLinkIcon compact={compact} icon={Icon} />
			<NavLinkText description={description} title={title} />
		</Link>
	)
}

function NavLinkIcon({ icon: Icon, compact }: { icon: SiteNavLink["icon"]; compact: boolean }) {
	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center rounded-md border bg-background/40 shadow-sm",
				compact ? "size-9" : "aspect-square size-12",
			)}>
			<Icon className={cn("text-foreground", compact ? "size-4" : "size-5")} />
		</div>
	)
}

function NavLinkText({ title, description }: { title: string; description?: string | undefined }) {
	return (
		<div className="flex min-w-0 flex-col items-start justify-center">
			<span className="font-medium text-sm">{title}</span>
			{description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
		</div>
	)
}
