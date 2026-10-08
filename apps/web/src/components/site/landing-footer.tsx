import Link from "next/link"

import { GitHubIcon } from "@/components/site/github-icon"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { githubUrl, kitLinks } from "@/lib/site-nav"
import { Button } from "@/packages/ui/components/button"

type FooterLink = { label: string; href: string; external?: boolean }

const footerColumns: { title: string; links: FooterLink[] }[] = [
	{
		title: "Kits",
		links: kitLinks.map((item) => ({ label: item.title, href: item.href })),
	},
	{
		title: "Docs",
		links: [
			{ label: "Introduction", href: "/docs" },
			{ label: "Getting started", href: "/docs/getting-started" },
			{ label: "Showcase", href: "/docs/examples" },
		],
	},
	{
		title: "Project",
		links: [
			{ label: "GitHub", href: githubUrl, external: true },
			{ label: "Releases", href: `${githubUrl}/releases`, external: true },
			{ label: "Issues", href: `${githubUrl}/issues`, external: true },
		],
	},
	{
		title: "Guides",
		links: [
			{ label: "Form kit", href: "/docs/form" },
			{ label: "Data table", href: "/docs/data-table" },
			{ label: "Layout", href: "/docs/layout" },
		],
	},
]

export function LandingFooter() {
	const year = new Date().getFullYear()

	return (
		<footer className="mt-auto border-t border-border bg-background">
			<div className="w-full px-4 lg:px-6">
				<div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-4">
					{footerColumns.map((column) => (
						<div key={column.title}>
							<h3 className="mb-4 text-xs">{column.title}</h3>
							<ul className="space-y-2 text-muted-foreground text-sm">
								{column.links.map((link) => (
									<li key={link.href}>
										{link.external ? (
											<a
												className="hover:text-foreground"
												href={link.href}
												rel="noreferrer noopener"
												target="_blank">
												{link.label}
											</a>
										) : (
											<Link className="hover:text-foreground" href={link.href}>
												{link.label}
											</Link>
										)}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="h-px bg-border" />

				<div className="flex flex-wrap items-center justify-between gap-4 py-5">
					<div className="flex items-center gap-2">
						<ThemeToggle
							className="dark:border-border dark:bg-muted/40 dark:hover:border-border dark:hover:bg-muted"
							variant="outline"
						/>
						<Button
							asChild
							className="dark:border-border dark:bg-muted/40 dark:hover:border-border dark:hover:bg-muted"
							size="icon"
							variant="outline">
							<a aria-label="GitHub" href={githubUrl} rel="noreferrer noopener" target="_blank">
								<GitHubIcon className="size-4" />
							</a>
						</Button>
					</div>
					<p className="text-muted-foreground text-sm">Open-source UI kits for React and Next.js</p>
				</div>

				<div className="h-px bg-border" />

				<div className="py-4 text-center text-muted-foreground text-xs">
					<p>MIT Licensed · © {year} Feature Kit</p>
				</div>
			</div>
		</footer>
	)
}
