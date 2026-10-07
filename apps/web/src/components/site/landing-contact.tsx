import { ArrowRight, BookOpen, ExternalLink, MessagesSquare } from "lucide-react"
import Link from "next/link"

import { GitHubIcon } from "@/components/site/github-icon"
import { githubUrl } from "@/lib/site-nav"
import { Button } from "@/packages/ui/components/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/packages/ui/components/card"
import { cn } from "@/packages/ui/lib/utils"

type ContactLink = {
	label: string
	href: string
	external?: boolean
}

const CONTACT_CARDS: {
	id: string
	title: string
	description: string
	icon: typeof BookOpen | typeof GitHubIcon
	links: ContactLink[]
}[] = [
	{
		id: "docs",
		title: "Docs & getting started",
		description:
			"Run the playground locally, wire workspace kits, and browse examples before copying patterns into your app.",
		icon: BookOpen,
		links: [
			{ label: "Getting started", href: "/docs/getting-started" },
			{ label: "Introduction", href: "/docs" },
			{ label: "Examples gallery", href: "/docs/examples" },
		],
	},
	{
		id: "github",
		title: "Source & issues",
		description:
			"Browse kit source on GitHub, follow releases, and open issues when something breaks in your stack.",
		icon: GitHubIcon,
		links: [
			{ label: "Repository", href: githubUrl, external: true },
			{ label: "Issues", href: `${githubUrl}/issues`, external: true },
			{ label: "Releases", href: `${githubUrl}/releases`, external: true },
		],
	},
	{
		id: "community",
		title: "Community & ideas",
		description:
			"Discuss provider wiring and monorepo aliases, or suggest kit changes before opening a PR.",
		icon: MessagesSquare,
		links: [
			{ label: "GitHub Discussions", href: `${githubUrl}/discussions`, external: true },
			{ label: "Contribute via pull request", href: githubUrl, external: true },
		],
	},
]

const contactLinkRowClassName =
	"group inline-flex w-full items-center gap-2 rounded-md py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"

function ContactCardPrimaryLink({ link }: { link: ContactLink }) {
	if (link.external) {
		return (
			<Button asChild className="h-8 w-fit" size="sm">
				<a href={link.href} rel="noreferrer noopener" target="_blank">
					{link.label}
					<ExternalLink aria-hidden className="size-3 opacity-60" />
				</a>
			</Button>
		)
	}

	return (
		<Button asChild className="h-8 w-fit" size="sm">
			<Link href={link.href}>
				{link.label}
				<ArrowRight className="size-3.5" data-icon="inline-end" />
			</Link>
		</Button>
	)
}

function ContactCardSecondaryLink({ link }: { link: ContactLink }) {
	const Icon = link.external ? ExternalLink : ArrowRight

	if (link.external) {
		return (
			<li>
				<a className={contactLinkRowClassName} href={link.href} rel="noreferrer noopener" target="_blank">
					<span className="min-w-0 flex-1">{link.label}</span>
					<Icon aria-hidden className="size-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-80" />
				</a>
			</li>
		)
	}

	return (
		<li>
			<Link className={contactLinkRowClassName} href={link.href}>
				<span className="min-w-0 flex-1">{link.label}</span>
				<Icon aria-hidden className="size-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-80" />
			</Link>
		</li>
	)
}

function ContactCardLinks({ links }: { links: ContactLink[] }) {
	const [primary, ...secondary] = links

	return (
		<div className="flex flex-col gap-3">
			{primary ? <ContactCardPrimaryLink link={primary} /> : null}
			{secondary.length > 0 ? (
				<ul
					className={cn(
						"flex flex-col gap-0.5",
						primary && "border-t border-border/60 pt-3",
					)}>
					{secondary.map((link) => (
						<ContactCardSecondaryLink key={`${link.href}-${link.label}`} link={link} />
					))}
				</ul>
			) : null}
		</div>
	)
}

export function LandingContact() {
	return (
		<section
			className="relative px-4 pt-10 pb-12 lg:px-6"
			aria-labelledby="landing-contact-heading">
			<div className="w-full space-y-8">
				<div className="max-w-2xl space-y-2">
					<h2 id="landing-contact-heading" className="font-medium text-2xl tracking-tight md:text-3xl">
						Get in touch with the project
					</h2>
					<p className="text-muted-foreground text-sm md:text-base">
						Feature Kit is open source—use the docs to get running, GitHub for bugs and releases, and
						discussions when you want a second opinion on wiring kits.
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					{CONTACT_CARDS.map((card) => {
						const Icon = card.icon
						return (
							<Card
								key={card.id}
								className="flex flex-col shadow-xs ring-1 ring-foreground/5 transition-colors hover:bg-muted/15">
								<CardHeader className="gap-3">
									<div
										className="flex size-10 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground"
										aria-hidden>
										<Icon className="size-5" />
									</div>
									<div className="space-y-1.5">
										<CardTitle className="text-base">{card.title}</CardTitle>
										<CardDescription className="text-sm leading-relaxed">
											{card.description}
										</CardDescription>
									</div>
								</CardHeader>
								<CardContent className="mt-auto pt-0">
									<ContactCardLinks links={card.links} />
								</CardContent>
							</Card>
						)
					})}
				</div>
			</div>
		</section>
	)
}
