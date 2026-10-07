import { Quote } from "lucide-react"

import { Avatar, AvatarFallback } from "@/packages/ui/components/avatar"
import { Card, CardContent, CardFooter } from "@/packages/ui/components/card"
import { cn } from "@/packages/ui/lib/utils"

type Testimonial = {
	id: string
	quote: string
	name: string
	role: string
	initials: string
}

const TESTIMONIALS_COLUMN_A: Testimonial[] = [
	{
		id: "forms-zod",
		quote:
			"We defined invite flows once with Zod and the form kit wired every field, server action, and error state. Our internal admin stopped drifting from the API contract.",
		name: "Jordan M.",
		role: "Platform engineer",
		initials: "JM",
	},
	{
		id: "monorepo",
		quote:
			"Copying feature/* into our pnpm workspace felt intentional—transpilePackages and shared UI tokens meant tables and forms looked like one product on day one.",
		name: "Samira L.",
		role: "Internal tools lead",
		initials: "SL",
	},
	{
		id: "table-url",
		quote:
			"Filters and pagination in the query string were the unlock. Support could share a listing URL without us building custom router glue.",
		name: "Alex R.",
		role: "Frontend engineer",
		initials: "AR",
	},
	{
		id: "layout-shell",
		quote:
			"The layout kit gave us sidebar, breadcrumbs, and confirmation dialogs with the same spacing as packages/ui—less time debating shell markup.",
		name: "Casey P.",
		role: "Staff engineer",
		initials: "CP",
	},
]

const TESTIMONIALS_COLUMN_B: Testimonial[] = [
	{
		id: "data-table",
		quote:
			"Column defs, empty states, and export hooks matched how we already thought about listings. We swapped mock data for our API without rewriting the table layer.",
		name: "Morgan T.",
		role: "Full-stack developer",
		initials: "MT",
	},
	{
		id: "docs-playground",
		quote:
			"The docs playground is the spec—when a recipe worked there, we knew providers and nuqs were wired the same way in our app.",
		name: "Riley K.",
		role: "Developer experience",
		initials: "RK",
	},
	{
		id: "uploader",
		quote:
			"Bulk import with validation feedback reused the same Zod shapes as our edit forms. Ops got CSV templates without a separate upload codebase.",
		name: "Devon H.",
		role: "Admin app maintainer",
		initials: "DH",
	},
	{
		id: "ui-primitives",
		quote:
			"Leaning on packages/ui for cards, dialogs, and badges kept our fork diff small—we customize tokens, not every primitive.",
		name: "Quinn W.",
		role: "Design systems engineer",
		initials: "QW",
	},
]

function TestimonialCard({ item }: { item: Testimonial }) {
	return (
		<Card className="shrink-0 gap-0 py-0 shadow-xs ring-1 ring-foreground/5">
			<CardContent className="space-y-3 pt-(--card-spacing)">
				<Quote aria-hidden className="size-4 text-muted-foreground/70" />
				<p className="text-sm leading-relaxed text-foreground/90">&ldquo;{item.quote}&rdquo;</p>
			</CardContent>
			<CardFooter className="gap-3 border-t border-border/60 pb-(--card-spacing)">
				<Avatar size="sm">
					<AvatarFallback className="bg-muted text-muted-foreground text-xs">{item.initials}</AvatarFallback>
				</Avatar>
				<div className="min-w-0">
					<p className="font-medium text-sm leading-none">{item.name}</p>
					<p className="mt-1 truncate text-muted-foreground text-xs">{item.role}</p>
				</div>
			</CardFooter>
		</Card>
	)
}

function ScrollingColumn({
	items,
	direction,
	duration,
	className,
}: {
	items: Testimonial[]
	direction: "up" | "down"
	duration: string
	className?: string
}) {
	const loop = [...items, ...items]

	return (
		<div className={cn("relative min-h-0 flex-1", className)}>
			<div
				className="landing-testimonials-fade pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-linear-to-b from-background to-transparent md:h-16"
				aria-hidden
			/>
			<div
				className="landing-testimonials-fade pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-linear-to-t from-background to-transparent md:h-16"
				aria-hidden
			/>

			<div className="landing-testimonials-scroll h-[22rem] overflow-hidden md:h-[28rem]">
				<div
					className={cn(
						"flex flex-col gap-3 will-change-transform",
						direction === "up" ? "animate-landing-testimonials-up" : "animate-landing-testimonials-down",
					)}
					style={{ ["--landing-testimonials-duration" as string]: duration }}>
					{loop.map((item, index) => (
						<TestimonialCard key={`${item.id}-${index}`} item={item} />
					))}
				</div>
			</div>

			<div className="landing-testimonials-static hidden flex-col gap-3">
				{items.map((item) => (
					<TestimonialCard key={item.id} item={item} />
				))}
			</div>
		</div>
	)
}

export function LandingTestimonials() {
	return (
		<section
			className="relative px-4 pt-10 pb-12 lg:px-6"
			aria-labelledby="landing-testimonials-heading">
			<div className="w-full">
				<div className="grid gap-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
					<div className="max-w-2xl space-y-2 lg:max-w-none lg:sticky lg:top-24">
						<p className="font-mono text-muted-foreground text-xs uppercase tracking-wide">Example voices</p>
						<h2 id="landing-testimonials-heading" className="font-medium text-2xl tracking-tight md:text-3xl">
							Teams wiring schema-first admin UI
						</h2>
						<p className="text-muted-foreground text-sm md:text-base">
							Illustrative quotes about using Feature Kit patterns—forms, tables, monorepo packages, and Zod—not
							verified customer testimonials or endorsements.
						</p>
					</div>

					<div className="grid min-h-0 gap-4 sm:grid-cols-2 sm:gap-3">
						<ScrollingColumn items={TESTIMONIALS_COLUMN_A} direction="up" duration="42s" />
						<ScrollingColumn
							items={TESTIMONIALS_COLUMN_B}
							direction="down"
							duration="48s"
							className="hidden sm:block"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
