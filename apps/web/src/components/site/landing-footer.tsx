import Link from "next/link"

import { GitHubIcon } from "@/components/site/github-icon"
import { githubUrl, kitLinks } from "@/lib/site-nav"
import { Button } from "@/packages/ui/components/button"

type FooterColumn = {
	label: string
	links: { title: string; href: string; external?: boolean }[]
}

const footerColumns: FooterColumn[] = [
	{
		label: "Kits",
		links: kitLinks.map((item) => ({ title: item.title, href: item.href })),
	},
	{
		label: "Docs",
		links: [
			{ title: "Introduction", href: "/docs" },
			{ title: "Getting started", href: "/docs/getting-started" },
			{ title: "Examples", href: "/docs/examples" },
		],
	},
	{
		label: "Project",
		links: [
			{ title: "GitHub", href: githubUrl, external: true },
			{ title: "Changelog", href: `${githubUrl}/releases`, external: true },
		],
	},
	{
		label: "Support",
		links: [
			{ title: "Form kit guide", href: "/docs/form" },
			{ title: "Data table guide", href: "/docs/data-table" },
			{ title: "Report an issue", href: `${githubUrl}/issues`, external: true },
		],
	},
]

export function LandingFooter() {
	const year = new Date().getFullYear()

	return (
		<footer className="mt-auto border-t bg-muted/35">
			<div className="mx-auto max-w-5xl px-4 py-12 md:py-14">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
					{footerColumns.map((column) => (
						<div key={column.label}>
							<h3 className="font-semibold text-foreground text-sm">{column.label}</h3>
							<ul className="mt-4 space-y-2.5 text-muted-foreground text-sm">
								{column.links.map((link) => (
									<li key={link.href}>
										{link.external ? (
											<a
												className="transition-colors hover:text-foreground"
												href={link.href}
												rel="noreferrer noopener"
												target="_blank">
												{link.title}
											</a>
										) : (
											<Link className="transition-colors hover:text-foreground" href={link.href}>
												{link.title}
											</Link>
										)}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
					<div className="flex items-center gap-2">
						<Button asChild size="icon-sm" variant="outline">
							<a aria-label="GitHub" href={githubUrl} rel="noreferrer noopener" target="_blank">
								<GitHubIcon className="size-4" />
							</a>
						</Button>
					</div>
					<p className="text-center text-muted-foreground text-sm md:text-left">
						© {year} Feature Kit. Open-source UI kits for React and Next.js.
					</p>
				</div>
			</div>
		</footer>
	)
}
