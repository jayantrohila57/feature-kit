"use client"

import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type ComponentProps, type ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { GitHubIcon } from "@/components/site/github-icon"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { MenuToggleIcon } from "@/components/site/menu-toggle-icon"
import { useScroll } from "@/hooks/use-scroll"
import { exampleFeaturedLinks, exampleQuickLinks, githubUrl, kitLinks, type SiteNavLink } from "@/lib/site-nav"
import { Button } from "@/packages/ui/components/button"
import { Separator } from "@/packages/ui/components/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/packages/ui/components/tooltip"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/packages/ui/components/navigation-menu"
import { cn } from "@/packages/ui/lib/utils"

type FeatureKitBrandLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
	href?: ComponentProps<typeof Link>["href"]
}

export function FeatureKitBrandLink({ className, href = "/", ...props }: FeatureKitBrandLinkProps) {
	return (
		<Link
			className={cn(
				"shrink-0 rounded-lg px-3 py-2.5 font-semibold text-sm tracking-tight hover:bg-muted dark:hover:bg-muted/50",
				className,
			)}
			href={href}
			{...props}>
			Feature Kit
		</Link>
	)
}

type FeatureKitHeaderProps = {
	className?: string
	leading?: ReactNode
	actions?: ReactNode
	layout?: "site" | "docs"
	/** Docs: no marketing mobile drawer (fumadocs sidebar on small screens). Desktop nav matches marketing. */
	navMode?: "marketing" | "docs"
}

export function FeatureKitHeader({
	className,
	leading,
	actions,
	navMode = "marketing",
}: FeatureKitHeaderProps) {
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
				"sticky top-0 z-50 w-full border-b border-border transition-colors",
				"data-[transparent=false]:bg-background/95 data-[transparent=false]:backdrop-blur-sm data-[transparent=false]:supports-[backdrop-filter]:bg-background/80 dark:data-[transparent=false]:supports-[backdrop-filter]:bg-background/90",
				className,
			)}>
			<nav
				className={cn(
					"mx-auto flex h-14 w-full max-w-none items-center justify-between px-4 lg:px-6",
				)}>
				<div className="flex min-w-0 items-center gap-5">
					{leading}
					<FeatureKitBrandLink />
					<DesktopNav />
				</div>

				{actions !== null || navMode !== "docs" ? (
					<div
						className={cn(
							"flex shrink-0 items-center gap-2",
							navMode === "docs" ? "" : "hidden md:flex",
						)}>
						{actions ?? <HeaderUtilityActions />}
					</div>
				) : null}

				{navMode === "marketing" ? (
					<Button
						aria-controls="mobile-menu"
						aria-expanded={open}
						aria-label="Toggle menu"
						className="md:hidden dark:border-border dark:bg-muted/40 dark:hover:border-border dark:hover:bg-muted"
						onClick={() => setOpen((value) => !value)}
						size="icon"
						variant="outline">
						<MenuToggleIcon className="size-5" duration={300} open={open} />
					</Button>
				) : null}
			</nav>

			{navMode === "marketing" ? (
				<MobileMenu className="flex flex-col justify-between gap-2 overflow-y-auto" open={open}>
					<div className="flex w-full flex-col gap-y-2">
						<span className="text-sm">Kits</span>
						{kitLinks.map((link) => (
							<MobileNavLink key={link.href} {...link} />
						))}
						<span className="text-sm">Showcase</span>
						{exampleFeaturedLinks.map((link) => (
							<MobileNavLink key={link.href} {...link} />
						))}
						{exampleQuickLinks.map((link) => (
							<MobileNavLink key={link.href} {...link} compact />
						))}
					</div>
					<div className="mt-5 flex flex-col gap-2">
						<div className="flex items-center justify-center gap-2">
							<ThemeToggle />
							<GitHubNavLink className="flex-1 justify-center" />
						</div>
					</div>
				</MobileMenu>
			) : null}
		</header>
	)
}

function DesktopNav() {
	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent">Kits</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 dark:bg-background">
						<ul className="grid w-lg grid-cols-2 gap-2 rounded-lg border bg-popover p-2 shadow">
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
					<NavigationMenuTrigger className="bg-transparent">Showcase</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 pb-1.5 dark:bg-background">
						<div className="grid w-lg grid-cols-2 gap-2">
							<ul className="space-y-2 rounded-lg border bg-popover p-2 shadow">
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
												<span className="font-medium text-sm">{item.title}</span>
											</Link>
										</NavigationMenuLink>
									</li>
								))}
							</ul>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	)
}

export function HeaderUtilityActions() {
	return (
		<div className="flex items-center gap-1.5">
			<ThemeToggle size="icon" tooltip="Toggle theme" variant="secondary" />
			<Separator className="mx-0.5 h-6" orientation="vertical" />
			<GitHubNavLink iconOnly size="icon" tooltip="GitHub repository" variant="secondary" />
		</div>
	)
}

type GitHubNavLinkProps = {
	className?: string
	iconOnly?: boolean
	size?: ComponentProps<typeof Button>["size"]
	variant?: ComponentProps<typeof Button>["variant"]
	tooltip?: string
}

export function GitHubNavLink({
	className,
	iconOnly = false,
	size = iconOnly ? "icon" : "sm",
	variant = iconOnly ? "secondary" : "ghost",
	tooltip = iconOnly ? "GitHub repository" : undefined,
}: GitHubNavLinkProps) {
	const linkLabel = "GitHub repository"

	const button = (
		<Button
			asChild
			className={cn(variant === "ghost" && "text-muted-foreground hover:text-foreground", className)}
			size={size}
			variant={variant}>
			<a
				aria-label={iconOnly ? linkLabel : undefined}
				href={githubUrl}
				rel="noreferrer noopener"
				target="_blank">
				<GitHubIcon className={iconOnly ? "size-4" : "size-3.5"} {...(iconOnly ? {} : { "data-icon": "inline-start" })} />
				{iconOnly ? null : (
					<>
						GitHub
						<ExternalLink aria-hidden className="size-3 opacity-60" />
					</>
				)}
			</a>
		</Button>
	)

	if (!tooltip) {
		return button
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>{button}</TooltipTrigger>
			<TooltipContent>{tooltip}</TooltipContent>
		</Tooltip>
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
			className="fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 dark:supports-[backdrop-filter]:bg-background/90 md:hidden"
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
		<Link
			className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-accent/60 active:bg-muted dark:active:bg-muted/50"
			href={href}>
			<NavLinkIcon compact={compact} icon={Icon} />
			<NavLinkText description={description} title={title} />
		</Link>
	)
}

function NavLinkIcon({ icon: Icon, compact }: { icon: SiteNavLink["icon"]; compact: boolean }) {
	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center rounded-md border bg-card text-sm shadow-sm",
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
			{description ? <span className="line-clamp-2 text-muted-foreground text-xs">{description}</span> : null}
		</div>
	)
}
